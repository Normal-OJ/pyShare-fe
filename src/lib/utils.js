import Vue from 'vue'
import store from '@/store'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'

const isSelf = target => {
  const username = store.getters && store.getters[GetterTypes.USERNAME]
  if (!username) return false
  return target === username
}

const hasPermission = async (resource, id, requirement) => {
  try {
    const permissions = store.getters && store.getters[GetterTypes.PERMISSIONS]
    if (!permissions[resource][id]) {
      await store.dispatch(ActionTypes.GET_PERMISSIONS, { resource, id })
    }
    // 物件 copy by sharing，這裡會吃到新的
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
