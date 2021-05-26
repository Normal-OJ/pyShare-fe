import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '@/constants/config'
import store from '@/store'
import { SET_IS_SHOW_LOGOUT_MODAL } from '@/store/mutations.type.js'

export function apiSetup() {
  Vue.use(VueAxios, axios)
  Vue.axios.defaults.baseURL = config.API_BASE_URL
  Vue.axios.interceptors.response.use(
    res => res,
    error => {
      if (error && error.response && error.response.data) {
        // catch Authorization Expired
        if (
          error.response.data.message === 'Authorization Expired' ||
          error.response.data.message === 'Invalid Token'
        ) {
          store.commit(SET_IS_SHOW_LOGOUT_MODAL, true)
        }
        throw error.response.data
      }
      throw error
    },
  )
}
