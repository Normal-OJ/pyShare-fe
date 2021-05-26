import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '@/constants/config'
import store from '@/store'
import { MutationTypes } from '@/store/mutation-types'

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
          store.commit(MutationTypes.SET_IS_SHOW_LOGOUT_MODAL, true)
        }
        throw error.response.data
      }
      throw error
    },
  )
}
