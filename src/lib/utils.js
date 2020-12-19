import Vue from 'vue'
import store from '@/store'
import { USERNAME } from '@/store/getters.type'

const isSelf = target => {
  const username = store.getters && store.getters[USERNAME]
  if (!username) return false
  return target === username
}

const alertSuccess = text => {
  Vue.notify({
    group: 'alert',
    type: 'my-success',
    title: text,
  })
}

const alertFail = text => {
  Vue.notify({
    group: 'alert',
    type: 'my-error',
    title: text,
  })
}

export const utilsPlugin = {
  install(Vue) {
    Vue.prototype.$isSelf = isSelf
    Vue.prototype.$alertSuccess = alertSuccess
    Vue.prototype.$alertFail = alertFail
  },
}
