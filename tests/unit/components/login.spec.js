// Libraries
import Vuetify from 'vuetify'
// Components
import Login from '@/views/Login/Login'
// Utilities
import { createLocalVue, mount } from '@vue/test-utils'

describe('Login.vue', () => {
  const localVue = createLocalVue()
  let wrapper
  beforeEach(() => {
    const vuetify = new Vuetify()
    wrapper = mount(Login, { localVue, vuetify })
  })

  it('should have a custom title.', () => {
    const title = wrapper.find('[data-test="title"]')
    expect(title.text()).toMatch('歡迎回來，請先登入')
  })

  it('should have three inputs with label and empty value.', () => {
    // school input
    const school = wrapper.find('[data-test="school"]')
    expect(school.element.value).toEqual('')
    const schoolLabel = wrapper.find(`[for="${school.attributes().id}"]`)
    expect(schoolLabel.text()).toMatch('學校')
    // username input
    const username = wrapper.find('[data-test="username"]')
    expect(username.element.value).toEqual('')
    const usernameLabel = wrapper.find(`[for="${username.attributes().id}"]`)
    expect(usernameLabel.text()).toMatch('使用者名稱')
    // password input
    const password = wrapper.find('[data-test="password"]')
    expect(password.element.value).toEqual('')
    const passwordLabel = wrapper.find(`[for="${password.attributes().id}"]`)
    expect(passwordLabel.text()).toMatch('密碼')
  })

  it('should have a submit button.', () => {
    const btn = wrapper.find('[data-test="loginBtn"]')
    expect(btn.text()).toMatch('登入')
  })

  it('should validate the input.', async () => {
    // initially (empty)
    expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    // only set school
    await wrapper.find('[data-test="school"').setValue('NTNU')
    expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    // set school & username
    await wrapper.find('[data-test="username"').setValue('madoka')
    expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
    // set school, username and password
    await wrapper.find('[data-test="password"').setValue('madoka')
    expect(wrapper.vm.$refs.form.validate()).toBeTruthy()
    // remove school
    await wrapper.find('[data-test="school"').setValue('')
    expect(wrapper.vm.$refs.form.validate()).toBeFalsy()
  })
})
