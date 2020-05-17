import { createLocalVue, shallowMount } from "@vue/test-utils"
import flushPromises from 'flush-promises'
import Problems from '@/views/problems'
import axios from 'axios'
import VueAxios from 'vue-axios'

const localVue = createLocalVue();
localVue.use(VueAxios, axios)

describe('Problem', () => {
    const wrapper = shallowMount(Problems, { localVue });

    it('renders html', async() => {
        await flushPromises()
        expect(wrapper.html()).toContain('<title>創作分享平台</title>')
    })
})