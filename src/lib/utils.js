import store from '@/store'
import { USERNAME } from '@/store/getters.type'

const username = store.getters && store.getters[USERNAME]

const isSelf = target => {
  return target === username
}

export const utilsPlugin = {
  install(Vue) {
    Vue.prototype.$isSelf = isSelf
  },
}
