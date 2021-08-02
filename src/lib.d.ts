import Vue from 'vue'
import agent from './api/agent'
import VueCookie from 'vue-cookie'
import Rollbar from 'rollbar'
import { hasPermission, alertSuccess, alertFail } from './lib/utils'

// untyped 3rd party module
declare module 'vue-cookie'

declare module 'vue/types/vue' {
  // make us access vue prototype: Vue.$cookie
  interface Vue {
    $agent: typeof agent
    $cookie: VueCookie
    $rollbar: Rollbar
    $hasPermission: typeof hasPermission
    $alertSuccess: typeof alertSuccess
    $alertFail: typeof alertFail
  }
}
