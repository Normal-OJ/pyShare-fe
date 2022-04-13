import { mount } from '@vue/test-utils'
import CloneProblemModal from '@/components/Course/Problem/CloneProblemModal.vue'
import baseMountConfig from '../helper'
import { createMockAgent } from '../mock'
import flushPromises from 'flush-promises'

const targetId = '[data-test=target]'
const submitId = '[data-test=submit]'
const baseProps = {
  isOpen: true,
  clonePid: 1,
  label: '主題',
}
const baseStore = {
  getters: { teachingCourses: () => [{ name: 'test_course', id: 'test' }] },
  actions: { getCourses: jest.fn() },
}

describe('CloneProblemModal.vue', () => {
  /**
   * Form UI
   * 測試元件是否正確渲染出輸入框、按鈕，並檢查其初始值
   */
  describe('Form UI', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = mount(CloneProblemModal, { ...baseMountConfig(baseStore), propsData: baseProps })
      await wrapper.vm.$nextTick()
    })

    it('should have the select input element.', async () => {
      const node = wrapper.find(targetId)
      expect(node.exists()).toEqual(true)
      expect(node.element.value).toEqual('')
    })

    it('should have the submit button.', async () => {
      const node = wrapper.find(submitId)
      expect(node.exists()).toEqual(true)
    })

    it('should have empty value at the beginning.', async () => {
      expect(wrapper.vm.$data.isLoading).toEqual(false)
      expect(wrapper.vm.$data.target).toEqual(null)
    })

    it('should have button disabled at the beginning.', async () => {
      expect(CloneProblemModal.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(true)
    })
  })

  describe('Modal text description', () => {
    it.each([
      { ids: 1, expectedText: '1' },
      { ids: [1], expectedText: '1' },
      { ids: [1, 2], expectedText: '1, 2' },
      { ids: [1, 2, 3], expectedText: '1, 2, 3' },
    ])('should give correct problem ids.', async ({ ids, expectedText }) => {
      const wrapper = mount(CloneProblemModal, {
        ...baseMountConfig(baseStore),
        propsData: {
          ...baseProps,
          clonePid: ids,
        },
      })
      await wrapper.vm.$nextTick()
      expect(CloneProblemModal.computed.pids.call(wrapper.vm)).toEqual(expectedText)
    })
  })

  describe('API call', () => {
    it.each([
      { ids: 1, expectedArgs: [[1, 'test']] },
      { ids: [1], expectedArgs: [[1, 'test']] },
      { ids: [1, 2], expectedArgs: [[1, 'test'], [2, 'test']] },
      { ids: [1, 2, 3], expectedArgs: [[1, 'test'], [2, 'test'], [3, 'test']] },
    ])('should request cloneProblem with correct body.', async ({ ids, expectedArgs }) => {
      const request = jest.fn(() => new Promise((resolve) => resolve()))
      const wrapper = mount(CloneProblemModal, {
        ...baseMountConfig(baseStore),
        propsData: {
          ...baseProps,
          clonePid: ids,
        },
        data: () => ({ target: 'test' }),
        mocks: {
          $agent: createMockAgent('Problem', 'clone', null, null, request),
        },
      })
      await wrapper.vm.$nextTick()
      expect(CloneProblemModal.computed.isSubmitDisabled.call(wrapper.vm)).toEqual(false)
      await wrapper.find(submitId).trigger('click')
      await flushPromises()
      expect(request).toHaveBeenCalled()
      expect(request.mock.calls).toEqual(expectedArgs)
    })
  })
})
