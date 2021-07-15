import Vue from 'vue'
import VueCookie from 'vue-cookie'
import Rollbar from 'rollbar'
import { hasPermission } from './lib/utils'

// untyped 3rd party module
declare module 'vue-cookie'

declare module 'vue/types/vue' {
  // make us access vue prototype: Vue.$cookie
  interface Vue {
    $cookie: VueCookie
    $rollbar: Rollbar
    $hasPermission: typeof hasPermission
    $alertSuccess: typeof alertSuccess
    $alertFail: typeof alertFail
  }
}
