import { mount } from '@vue/test-utils'
import Login from '@/views/Login/Login.vue'
import flushPromises from 'flush-promises'
import baseMountConfig from '../helper'
import { createMockAgent } from '../mock'
import { SCHOOLS } from '@/constants/auth'
import Vuex from 'vuex'

const titleId = '[data-test=title]'
const schoolId = '[data-test=school]'
const usernameId = '[data-test=username]'
const emailId = '[data-test=email]'
const passwordId = '[data-test=password]'
const loginBtnId = '[data-test=submitLoginBtn]'
const emailRadioId = '[data-test=emailRadio]'

const validLoginForm = {
  school: 'NTNU',
  email: '',
  username: 'username',
  password: 'password',
}
const validLoginFormByEmail = {
  school: null,
  email: 'email@test.com',
  username: '',
  password: 'password',
}

const LOGIN_METHOD = {
  USERNAME: 0,
  EMAIL: 1,
}

describe('Login.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕等欄位，並檢查其初始值和顯示文字
   */
  describe('Form UI', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Login, {
        ...baseMountConfig(),
        mocks: {
          $agent: createMockAgent('School', 'getList', []),
        },
      })
    })

    it('should have a title.', () => {
      const title = wrapper.find(titleId)
      expect(title.exists()).toBeTruthy()
    })

    it('should have School, Username and Password inputs with label and empty value.', () => {
      const school = wrapper.find(schoolId)
      expect(school.element.value).toEqual('')
      expect(wrapper.find(`[for="${school.attributes().id}"]`).text()).toMatch('學校')

      const username = wrapper.find(usernameId)
      expect(username.element.value).toEqual('')
      expect(wrapper.find(`[for="${username.attributes().id}"]`).text()).toMatch('使用者名稱')

      const password = wrapper.find(passwordId)
      expect(password.element.value).toEqual('')
      expect(wrapper.find(`[for="${password.attributes().id}"]`).text()).toMatch('密碼')
    })

    it('should have two radio btns and can switch to login by Email.', async () => {
      wrapper.find(emailRadioId).setChecked(true)
      expect(wrapper.vm.$data.loginMethod).toEqual(LOGIN_METHOD.EMAIL)
      // 畫面渲染為非同步，等待下一個週期
      await wrapper.vm.$nextTick()
      const email = wrapper.find(emailId)
      expect(email.element.value).toEqual('')
      expect(wrapper.find(`[for="${email.attributes().id}"]`).text()).toMatch('電子信箱')
    })

    it('should have a submit button.', () => {
      const btn = wrapper.find(loginBtnId)
      expect(btn.text()).toMatch('登入')
    })
  })

  /**
   * Form Validation
   * 測試登入表單的欄位驗證是否正確
   */
  describe('Form Validation', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Login, {
        ...baseMountConfig(),
        mocks: {
          $agent: createMockAgent('School', 'getList', []),
        },
      })
    })

    it('should validate username, email and password that cannot be empty.', () => {
      const loginRules = wrapper.vm.$data.loginRules
      const testcase = [
        { input: '', expectedType: 'string' },
        { input: '0', expectedType: 'boolean' },
        { input: '-', expectedType: 'boolean' },
        { input: 'madoka', expectedType: 'boolean' },
        { input: '.............', expectedType: 'boolean' },
      ]
      testcase.forEach((tc) => {
        expect(
          loginRules.username.every(
            (rule) => rule(tc.input) && typeof rule(tc.input) === tc.expectedType,
          ),
        ).toBeTruthy()
        expect(
          loginRules.email.every(
            (rule) => rule(tc.input) && typeof rule(tc.input) === tc.expectedType,
          ),
        ).toBeTruthy()
        expect(
          loginRules.password.every(
            (rule) => rule(tc.input) && typeof rule(tc.input) === tc.expectedType,
          ),
        ).toBeTruthy()
      })
    })

    it('should validate school that cannot be Null.', () => {
      const loginRules = wrapper.vm.$data.loginRules
      const testcase = [
        { input: null, expectedValue: '請選擇您的學校' },
        { input: '', expectedValue: true },
        { input: 'NTNU', expectedValue: true },
        { input: 'NTUST', expectedValue: true },
      ]
      testcase.forEach((tc) => {
        expect(loginRules.school.every((rule) => rule(tc.input) === tc.expectedValue)).toBeTruthy()
      })
    })

    it('should validate the input after clicking login btn. (by username)', async () => {
      // initially (empty)
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      // only set school
      await wrapper.find(schoolId).setValue('NTNU')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      // set school & username
      await wrapper.find(usernameId).setValue('madoka')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      // set school, username and password
      await wrapper.find(passwordId).setValue('madoka')
      expect(wrapper.vm.$refs.form.validate()).toBeTruthy()
      // remove username
      await wrapper.find(usernameId).setValue('')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    })

    it('should validate the input after clicking login btn. (by email)', async () => {
      // initially (empty)
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      // Switch to login by email
      wrapper.find(emailRadioId).setChecked(true)
      // 畫面渲染為非同步，等待下一個週期
      await wrapper.vm.$nextTick()
      // only set email
      await wrapper.find(emailId).setValue('abc@pyshare.tw')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
      // set password
      await wrapper.find(passwordId).setValue('madoka')
      expect(wrapper.vm.$refs.form.validate()).toBeTruthy()
      // remove email
      await wrapper.find(emailId).setValue('')
      expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    })
  })

  /**
   * API call
   * 測試取得的學校列表是否被正確地賦值和渲染
   */
  describe('API call', () => {
    it('should fetched school list and display in <v-select>.', async () => {
      const expectedValue = [
        { abbr: '', name: '無' },
        { abbr: 'NTNU', name: '國立臺灣師範大學' },
      ]
      const wrapper = mount(Login, {
        ...baseMountConfig(),
        mocks: {
          $agent: createMockAgent('School', 'getList', expectedValue),
        },
      })
      await flushPromises()
      expect(wrapper.vm.$data.schoolOptions).toEqual(expectedValue)
    })

    it('should use backup school list if the fetch failed.', async () => {
      const wrapper = mount(Login, {
        ...baseMountConfig(),
        mocks: {
          $agent: createMockAgent('School', 'getList', null, 'error'),
        },
      })
      await flushPromises()
      expect(wrapper.vm.$data.schoolOptions).toEqual(SCHOOLS)
    })
  })

  /**
   * Vuex
   * 測試是否成功從 Vuex 獲取資料，並能夠在更新時響應地拿到最新的值
   * 測試登入表單送出後是否正確 dispatch login
   */
  describe('Vuex', () => {
    const mocks = { $agent: createMockAgent('School', 'getList', []) }

    it('should get vuex state (auth.id) via mapState.', async () => {
      const store = { state: { auth: { id: 'mock_auth_id_in_vuex' } } }
      const wrapper = mount(Login, { ...baseMountConfig(store), mocks })
      expect(wrapper.vm.id).toEqual('mock_auth_id_in_vuex')
    })

    it('should get updated vuex state (auth.id) via mapState after mutating state.', async () => {
      const { localVue, vuetify, store } = { ...baseMountConfig({
        state: { auth: { id: 1 } },
        mutations: { change: (state) => (state.auth.id = 2) },
      }) }
      const wrapper = mount(Login, { localVue, vuetify, store, mocks })
      expect(wrapper.vm.id).toEqual(1)
      store.commit('change')
      expect(wrapper.vm.id).toEqual(2)
    })

    it.each([
      [
        validLoginForm,
        LOGIN_METHOD.USERNAME,
        (({ school, username, password }) => ({ school, username, password }))(validLoginForm),
      ],
      [
        validLoginFormByEmail,
        LOGIN_METHOD.EMAIL,
        (({ email, password }) => ({ email, password }))(validLoginFormByEmail),
      ],
    ])(
      'should dispatch login with correct data after submit.',
      async (payload, loginMethod, expectedData) => {
        const actions = {
          login: jest.fn(() => new Promise((resolve) => resolve())),
        }
        const store = { actions }
        const data = () => ({ loginForm: payload, loginMethod })
        const $router = { push: jest.fn() }
        const wrapper = mount(Login, {
          ...baseMountConfig(store),
          mocks: { ...mocks, $router, $route: { query: { redirectToPath: '' } } },
          data,
        })
        await wrapper.find(loginBtnId).trigger('click')
        // the second argument (body) of the first call
        expect(actions.login.mock.calls[0][1]).toEqual(expectedData)
      },
    )

    it.each([
      ['', { name: 'courses' }],
      ['/courses', { path: '/courses' }],
      ['/profile/userid', { path: '/profile/userid' }],
    ])(
      'should dispatch login after button being clicked, and login successfully.',
      async (redirectToPath, expectedValue) => {
        const actions = {
          login: jest.fn(() => new Promise((resolve) => resolve())),
        }
        const store = { actions }
        const data = () => ({ loginForm: validLoginForm })
        const $router = { push: jest.fn() }
        const wrapper = mount(Login, {
          ...baseMountConfig(store),
          mocks: { ...mocks, $router, $route: { query: { redirectToPath } } },
          data,
        })
        await wrapper.find(loginBtnId).trigger('click')
        expect(actions.login).toHaveBeenCalled()
        expect(wrapper.vm.$data.isLoading).toEqual(true)
        await flushPromises()
        expect($router.push.mock.calls[0][0]).toEqual(expectedValue)
        expect(wrapper.vm.$data.isLoading).toEqual(false)
      },
    )

    it.each([
      [validLoginForm, LOGIN_METHOD.USERNAME, '登入失敗：學校、使用者名稱或密碼有誤'],
      [validLoginFormByEmail, LOGIN_METHOD.EMAIL, '登入失敗：信箱或密碼有誤'],
    ])(
      'should dispatch login after button being clicked, and login failed.',
      async (loginForm, loginMethod, expectedError) => {
        const actions = {
          login: jest.fn(() => new Promise((_, reject) => reject({ message: 'Login Failed' }))),
        }
        const store = { actions }
        const data = () => ({ loginForm, loginMethod })
        const wrapper = mount(Login, { ...baseMountConfig(store), mocks, data })
        expect(wrapper.vm.$data.errorMsg).toEqual('')
        await wrapper.find(loginBtnId).trigger('click')
        expect(actions.login).toHaveBeenCalled()
        expect(wrapper.vm.$data.isLoading).toEqual(true)
        await flushPromises()
        expect(wrapper.vm.$data.isLoading).toEqual(false)
        expect(wrapper.vm.$data.errorMsg).toEqual(expectedError)
      },
    )

    it(
      'should dispatch login after button being clicked, and login failed with unknown error.',
      async () => {
        const actions = {
          login: jest.fn(() => new Promise((_, reject) => reject({}))),
        }
        const store = { actions }
        const data = () => ({ loginForm: validLoginForm })
        const wrapper = mount(Login, { ...baseMountConfig(store), mocks, data })
        expect(wrapper.vm.$data.errorMsg).toEqual('')
        await wrapper.find(loginBtnId).trigger('click')
        expect(actions.login).toHaveBeenCalled()
        expect(wrapper.vm.$data.isLoading).toEqual(true)
        await flushPromises()
        expect(wrapper.vm.$data.isLoading).toEqual(false)
        expect(wrapper.vm.$data.errorMsg).toEqual('登入失敗：系統異常，請洽管理員')
      },
    )

    it('should not dispatch login with invalid form.', async () => {
      const store = { actions: { login: jest.fn() } }
      // set password empty to make it invalid
      const data = () => ({ loginForm: { ...validLoginForm, password: '' } })
      const wrapper = mount(Login, { ...baseMountConfig(store), mocks, data })
      await wrapper.find(loginBtnId).trigger('click')
      expect(store.actions.login).not.toHaveBeenCalled()
      expect(wrapper.vm.$data.isLoading).toEqual(false)
    })
  })
})
