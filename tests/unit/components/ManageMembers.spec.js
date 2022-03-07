// import { mount } from '@vue/test-utils'
// import ManageMembers from '@/components/Course/Manages/ManageMembers.vue'
// import baseMountConfig from '../helper'
// import generateUserInfo from '../utils/generateUserInfo'

describe('ManageMembers.vue', () => {
  /**
   * Form Validation
   * 測試表單驗證
   */
  describe('Form Validation', () => {
    it('is not ready, skip the test', () => {})
  //   it('should NOT select teacher have 3 empty input when Creating a sandbox.', async () => {
  //     const wrapper = mount(ManageMembers, {
  //       ...baseMountConfig(),
  //       mixins: [],
  //       propsData: {
  //         members: [
  //           generateUserInfo({ id: '1', role: '教師' }),
  //           generateUserInfo({ id: '2', role: '學生' }),
  //           generateUserInfo({ id: '3', role: '學生' }),
  //         ],
  //         loading: false,
  //         canWriteCourse: true,
  //       },
  //     })
  //     await wrapper.vm.$nextTick()
  //     wrapper.vm.$data.selected = wrapper.vm.$props.members.slice()
  //     await wrapper.vm.$nextTick()
  //     expect(wrapper.vm.$data.selectedUser.includes(1)).toBeFalsy()
  //   })
  })
})
