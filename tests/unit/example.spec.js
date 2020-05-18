import { createLocalVue, shallowMount } from "@vue/test-utils"
import Problems from '@/views/problems'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moxios from 'moxios'

const localVue = createLocalVue();
localVue.use(VueAxios, axios)

beforeEach(() => {
    moxios.install();
    moxios.stubRequest('/course', {
        status: 200,
        response: {
            data: [{
                name: 'Golf',
                teacher: {
                    username: 'tcc',
                    displayedName: '蔣宗哲',
                }
            }]
        }
    });
});

afterEach(() => {
    moxios.uninstall();
});


describe('Problems', () => {
    it('get courses into array', (done) => {
        const wrapper = shallowMount(Problems, { localVue });
        moxios.wait(() => {
            expect(wrapper.vm.$data.courses).toMatchObject(['Golf', '不限課程']);
            done();
        });
    })
})