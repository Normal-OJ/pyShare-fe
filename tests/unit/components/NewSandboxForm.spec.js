import { mount } from '@vue/test-utils'
import NewSandboxForm from '@/components/Admin/NewSandboxForm'
import baseMountConfig from '../helper'

const urlId = '[data-test=url]'
const aliasId = '[data-test=alias]'
const tokenId = '[data-test=token]'
const submitId = '[data-test=submit]'
const cancelId = '[data-test=cancel]'

describe('NewSandboxForm.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕等欄位，並檢查其初始值和顯示文字
   */
  describe('Form UI', () => {
    it('should have 3 empty input when Creating a sandbox.', async () => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { new: true, data: { url: '', alias: '', token: '' } },
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm).toEqual({
        isValid: false,
        data: { url: '', alias: '', token: '' },
      })
      // the submit button is disabled
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
      // check input elements
      const ids = [urlId, aliasId, tokenId]
      ids.forEach(id => {
        const node = wrapper.find(id)
        expect(node.exists()).toEqual(true)
        expect(node.element.value).toEqual('')
      })
    })

    it.each([{ url: 'http://foo.bar', alias: 'foobar' }, { url: 'http://madoka' }])(
      'should have correct input value when Modifying a sandbox.',
      async populateWith => {
        const wrapper = mount(NewSandboxForm, {
          ...baseMountConfig(),
          propsData: {
            populateWith: { data: populateWith },
          },
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$data.newSandboxForm).toEqual({
          isValid: true,
          data: { ...populateWith },
        })
        const url = wrapper.find(urlId)
        expect(url.element.value).toEqual(populateWith.url)
        expect(url.element.readOnly).toEqual(true)
        const alias = wrapper.find(aliasId)
        expect(alias.element.value).toEqual(populateWith.alias || '')
      },
    )
  })

  /**
   * Form Validation
   * 測試表單驗證
   */
  describe('Form Validation', () => {
    it('should require url, token & not require alias when Creating a sandbox.', async () => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { new: true, data: { url: '', alias: '', token: '' } },
        },
      })
      await wrapper.find(urlId).setValue('http://foo.bar')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(false)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
      await wrapper.find(aliasId).setValue('nickname')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(false)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
      await wrapper.find(tokenId).setValue('s3cr3t')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(true)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)
      await wrapper.find(aliasId).setValue('')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(true)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)
    })

    it('should not require alias when Modifying a sandbox.', async () => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { data: { url: 'http://foo.bar', alias: '' } },
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(true)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)
      await wrapper.find(aliasId).setValue('nickname')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSandboxForm.isValid).toEqual(true)
      expect(NewSandboxForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)
    })

    it.each([
      { new: true, data: { url: '', alias: '', token: '' } },
      { data: { url: 'http://foo.bar', alias: '' } },
    ])('should not emit if form validation failed.', async populateWith => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: { populateWith },
      })
      await wrapper.find(aliasId).setValue(new Array(33).join('A'))
      await wrapper.find(submitId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().submit).toBeFalsy()
    })
  })

  /**
   * Event Emitter
   * 測試元件 emit 預期的 event & payload
   */
  describe('Event Emitter', () => {
    it.each([
      ['http://foo.bar', 'nickname', 's3cr3t'],
      ['http://123', '', 's3cr3t'],
    ])("should emit 'submit' after submitting a New sandbox.", async (url, alias, token) => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { new: true, data: { url: '', alias: '', token: '' } },
        },
      })
      await wrapper.find(urlId).setValue(url)
      if (alias) await wrapper.find(aliasId).setValue(alias)
      await wrapper.find(tokenId).setValue(token)
      await wrapper.find(submitId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().submit).toBeTruthy()
      expect(wrapper.emitted().submit[0]).toEqual([{ url, alias, token }])
    })

    it.each([
      ['http://foo.bar', 'nickname'],
      ['http://123', ''],
    ])("should emit 'modify' after submitting a Modified sandbox.", async (url, alias) => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { data: { url, alias: alias } },
        },
      })
      await wrapper.find(submitId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().modify).toBeTruthy()
      expect(wrapper.emitted().modify[0]).toEqual([{ url, alias }])
    })

    it("should emit 'cancel' after clicking cancel button.", async () => {
      const wrapper = mount(NewSandboxForm, {
        ...baseMountConfig(),
        propsData: {
          populateWith: { data: { url: '', alias: '', token: '' } },
        },
      })
      await wrapper.find(cancelId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().cancel).toBeTruthy()
    })
  })
})
