import { mount } from '@vue/test-utils'
import NewSchoolForm from '@/components/Admin/NewSchoolForm.vue'
import baseMountConfig from '../helper'

const abbrId = '[data-test=abbr]'
const nameId = '[data-test=name]'
const submitId = '[data-test=submit]'
const cancelId = '[data-test=cancel]'

describe('NewSchoolForm.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕等欄位，並檢查其初始值和顯示文字
   */
  describe('Form UI', () => {
    it('should have 2 empty input when Creating a school.', async () => {
      const wrapper = mount(NewSchoolForm, { ...baseMountConfig() })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSchoolForm).toEqual({
        isValid: false,
        isLoading: false,
        data: { abbr: '', name: '' },
      })
      // the submit button is disabled
      expect(NewSchoolForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
      // check input elements
      const ids = [abbrId, nameId]
      ids.forEach((id) => {
        const node = wrapper.find(id)
        expect(node.exists()).toEqual(true)
        expect(node.element.value).toEqual('')
      })
    })
  })

  /**
   * Form Validation
   * 測試表單驗證
   */
  describe('Form Validation', () => {
    it('should require both abbr & name when Creating a school.', async () => {
      const wrapper = mount(NewSchoolForm, { ...baseMountConfig() })

      await wrapper.find(abbrId).setValue('NTNU')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSchoolForm.isValid).toEqual(false)
      expect(NewSchoolForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)

      await wrapper.find(nameId).setValue('國立臺灣師範大學')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSchoolForm.isValid).toEqual(true)
      expect(NewSchoolForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)

      await wrapper.find(nameId).setValue('')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newSchoolForm.isValid).toEqual(false)
      expect(NewSchoolForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
    })

    it('should not emit if form validation failed.', async () => {
      const wrapper = mount(NewSchoolForm, { ...baseMountConfig() })
      await wrapper.find(abbrId).setValue(new Array(17).join('A'))
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
      ['NTNU', '國立臺灣師範大學'],
      ['AAA', '一二三'],
      ['BBB', 'CCC'],
    ])('should emit \'submit\' after submitting a New school.', async (abbr, name) => {
      const wrapper = mount(NewSchoolForm, { ...baseMountConfig() })
      await wrapper.find(abbrId).setValue(abbr)
      await wrapper.find(nameId).setValue(name)
      await wrapper.find(submitId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().submit).toBeTruthy()
      expect(wrapper.emitted().submit[0][0]).toEqual({ abbr, name })
    })

    it('should emit \'cancel\' after clicking cancel button.', async () => {
      const wrapper = mount(NewSchoolForm, { ...baseMountConfig() })
      await wrapper.find(cancelId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().cancel).toBeTruthy()
    })
  })
})
