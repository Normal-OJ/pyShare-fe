import Vue from 'vue'
import VueCookie from 'vue-cookie'
import Rollbar from 'rollbar'

// untyped 3rd party module
declare module 'vue-cookie'

declare module 'vue/types/vue' {
  // make us access vue prototype: Vue.$cookie
  interface Vue {
    $cookie: VueCookie
    $rollbar: Rollbar
  }
}
