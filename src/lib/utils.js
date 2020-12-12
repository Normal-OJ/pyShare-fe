import store from '@/store'
import { USERNAME } from '@/store/getters.type'

const isSelf = target => {
  const username = store.getters && store.getters[USERNAME]
  if (!username) return false
  return target === username
}

export const utilsPlugin = {
  install(Vue) {
    Vue.prototype.$isSelf = isSelf
  },
}
