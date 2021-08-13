import agent from './api/agent'
import Rollbar from 'rollbar'
import { hasPermission, alertSuccess, alertFail } from './lib/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $agent: typeof agent
    $cookie: any
    $rollbar: Rollbar
    $hasPermission: typeof hasPermission
    $alertSuccess: typeof alertSuccess
    $alertFail: typeof alertFail
  }
}
