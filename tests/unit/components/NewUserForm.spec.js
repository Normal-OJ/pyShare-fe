import { mount } from '@vue/test-utils'
import NewUserForm from '@/components/Admin/NewUserForm'
import baseMountConfig from '../helper'
import Papa from 'papaparse'

const schoolId = '[data-test=school]'
const usernameId = '[data-test=username]'
const displayNameId = '[data-test=displayName]'
const passwordId = '[data-test=password]'
const roleId = '[data-test=role]'
const emailId = '[data-test=email]'
const submitId = '[data-test=submit]'
const cancelId = '[data-test=cancel]'

describe('NewUserForm.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕等欄位，並檢查其初始值和顯示文字
   */
  describe('Form UI', () => {
    it('should have 6 empty input when Creating a school.', async () => {
      const wrapper = mount(NewUserForm, { ...baseMountConfig(), propsData: { schoolOptions: [] } })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newUserForm).toEqual({
        isValid: false,
        isShowPassword: false,
        isLoading: false,
        data: { school: '', username: '', displayName: '', password: '', email: '', role: 1 },
      })
      // the submit button is disabled
      expect(NewUserForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
      // check input elements
      const ids = [schoolId, usernameId, displayNameId, passwordId, roleId, emailId]
      ids.forEach(id => {
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
    it('should require username, displayName and password when Creating a school.', async () => {
      const wrapper = mount(NewUserForm, { ...baseMountConfig(), propsData: { schoolOptions: [] } })

      await wrapper.find(usernameId).setValue('madoka')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newUserForm.isValid).toEqual(false)
      expect(NewUserForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)

      await wrapper.find(displayNameId).setValue('madoka')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newUserForm.isValid).toEqual(false)
      expect(NewUserForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)

      await wrapper.find(passwordId).setValue('madoka')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newUserForm.isValid).toEqual(true)
      expect(NewUserForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)

      await wrapper.find(displayNameId).setValue('')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data.newUserForm.isValid).toEqual(false)
      expect(NewUserForm.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
    })

    it('should not emit if form validation failed.', async () => {
      const wrapper = mount(NewUserForm, { ...baseMountConfig(), propsData: { schoolOptions: [] } })
      await wrapper.find(usernameId).setValue(new Array(17).join('A'))
      await wrapper.find(displayNameId).setValue(new Array(17).join('A'))
      await wrapper.find(passwordId).setValue(new Array(17).join('A'))
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
      ['username', 'displayName', 'password', 1, ''],
      ['username', 'displayName', 'password', 1, 'dev@noj.tw'],
      ['username', 'displayName', 'password', 0, 'admin@pyshare.noj.tw'],
    ])(
      "should emit 'submit' after submitting a New school.",
      async (username, displayName, password, role, email) => {
        const wrapper = mount(NewUserForm, {
          ...baseMountConfig(),
          propsData: { schoolOptions: [] },
        })
        await wrapper.find(usernameId).setValue(username)
        await wrapper.find(displayNameId).setValue(displayName)
        await wrapper.find(passwordId).setValue(password)
        await wrapper.find(roleId).setValue(role)
        await wrapper.find(emailId).setValue(email)
        await wrapper.find(submitId).trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().submit).toBeTruthy()
        expect(Papa.parse(wrapper.emitted().submit[0][0]).data).toEqual([
          ['school', 'username', 'displayName', 'password', 'role'].concat(email ? 'email' : []),
          ['', username, displayName, password, `${role}`].concat(email || []),
        ])
      },
    )

    it("should emit 'cancel' after clicking cancel button.", async () => {
      const wrapper = mount(NewUserForm, { ...baseMountConfig(), propsData: { schoolOptions: [] } })
      await wrapper.find(cancelId).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().cancel).toBeTruthy()
    })
  })
})
