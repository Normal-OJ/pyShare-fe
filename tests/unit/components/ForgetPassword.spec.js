import CompositionApi from '@vue/composition-api'
import { mount } from '@vue/test-utils'
import ForgetPassword from '@/views/Login/ForgetPassword.vue'
import flushPromises from 'flush-promises'
import baseMountConfig from '../helper'
import { createMockAgent } from '../mock'

const emailId = '[data-test=email]'
const submitId = '[data-test=submit]'
const successId = '[data-test=success]'

describe('ForgetPassword.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕等欄位，並檢查其初始值和顯示文字
   */
  describe('Form UI', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(ForgetPassword, { ...baseMountConfig() })
    })

    it('should have Email inputs with label and empty value.', () => {
      const email = wrapper.find(emailId)
      expect(email.element.value).toEqual('')
      expect(wrapper.find(`[for="${email.attributes().id}"]`).text()).toMatch('電子信箱')
    })

    it('should have a submit button.', () => {
      const btn = wrapper.find(submitId)
      expect(btn.text()).toMatch('送出')
    })
  })

  /**
   * Form Validation
   * 測試登入表單的欄位驗證是否正確
   */
  describe('Form Validation', () => {
    let wrapper
    beforeEach(() => {
      const { localVue, vuetify } = baseMountConfig()
      localVue.use(CompositionApi)
      wrapper = mount(ForgetPassword, { localVue, vuetify })
    })

    it('should require email value.', () => {
      const { emailRules } = wrapper.vm
      const testcase = [
        { input: '', expectedValue: '請輸入您的電子信箱' },
        { input: 'gg@test.com', expectedValue: true },
        { input: 'dev@pyshare.io', expectedValue: true },
      ]
      testcase.forEach((tc) => {
        expect(emailRules.every((rule) => rule(tc.input) === tc.expectedValue)).toBeTruthy()
      })
    })

    it('should validate the input after clicking submit btn.', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      await wrapper.find(emailId).setValue('madoka@gg.gg')
      expect(wrapper.vm.$refs.form.validate()).toBeTruthy()
      await wrapper.find(emailId).setValue('')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    })
  })

  /**
   * API call
   * 測試取得的學校列表是否被正確地賦值和渲染
   */
  describe('API call', () => {
    it('should show success UI after the request fulfilled.', async () => {
      const email = 'madoka@gg.gg'
      const { localVue, vuetify } = baseMountConfig()
      localVue.use(CompositionApi)
      const wrapper = mount(ForgetPassword, {
        localVue,
        vuetify,
        mocks: {
          $agent: createMockAgent('Auth', 'passwordRecovery', null),
        },
      })
      await wrapper.find(emailId).setValue(email)
      await wrapper.find(submitId).trigger('click')
      await flushPromises()
      expect(wrapper.vm.success).toEqual(true)
      expect(wrapper.find(successId).exists()).toBeTruthy()
    })

    it.each([
      ['User Not Exists', '查無帳號使用此電子信箱'],
      ['bad request', '發生未知錯誤'],
    ])('should show error message after the request failed.', async (error, expectedErrorMsg) => {
      const email = 'madoka@gg.gg'
      const { localVue, vuetify } = baseMountConfig()
      localVue.use(CompositionApi)
      const wrapper = mount(ForgetPassword, {
        localVue,
        vuetify,
        mocks: {
          $agent: createMockAgent('Auth', 'passwordRecovery', null, error),
        },
      })
      await wrapper.find(emailId).setValue(email)
      await wrapper.find(submitId).trigger('click')
      await flushPromises()
      expect(wrapper.vm.success).toEqual(false)
      expect(wrapper.find(successId).exists()).toBeFalsy()
      expect(wrapper.vm.errorMsg).toEqual(expectedErrorMsg)
    })
  })
})
