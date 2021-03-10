import Vue from 'vue'
import store from '@/store'
import { USERNAME } from '@/store/getters.type'
import { PERMISSIONS } from '@/store/getters.type'
import { GET_PERMISSIONS } from '@/store/actions.type'

const isSelf = target => {
  const username = store.getters && store.getters[USERNAME]
  if (!username) return false
  return target === username
}

const hasPermission = async (resource, id, requirement) => {
  try {
    let permissions = store.getters && store.getters[PERMISSIONS]
    if (!permissions[resource][id]) {
      await store.dispatch(GET_PERMISSIONS, { resource, id })
    }
    return requirement.every(req => permissions[resource][id].includes(req))
  } catch (error) {
    console.log('[lib/utils/hasPermission] error', error)
    return false
  }
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
    Vue.prototype.$hasPermission = hasPermission
    Vue.prototype.$alertSuccess = alertSuccess
    Vue.prototype.$alertFail = alertFail
  },
}
