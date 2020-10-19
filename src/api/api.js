import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '@/constants/config'

export function apiSetup() {
  Vue.use(VueAxios, axios)
  Vue.axios.defaults.baseURL = config.BASE_API_URL
  Vue.axios.interceptors.response.use(
    res => res,
    error => {
      if (error && error.response && error.response.data) {
        throw error.response.data
      }
      throw error
    },
  )
}
