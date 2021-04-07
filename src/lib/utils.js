import Vue from 'vue'
import store from '@/store'
import { USERNAME, PERMISSIONS, GRAVATARS } from '@/store/getters.type'
import { GET_PERMISSIONS } from '@/store/actions.type'
import { SET_GRAVATARS } from '@/store/mutations.type'
import config from '@/constants/config'

const isSelf = target => {
  const username = store.getters && store.getters[USERNAME]
  if (!username) return false
  return target === username
}

const hasPermission = async (resource, id, requirement) => {
  try {
    const permissions = store.getters && store.getters[PERMISSIONS]
    if (!permissions[resource][id]) {
      await store.dispatch(GET_PERMISSIONS, { resource, id })
    }
    // 物件 copy by sharing，這裡會吃到新的
    return requirement.every(req => permissions[resource][id].includes(req))
  } catch (error) {
    console.log('[lib/utils/hasPermission] error', error)
    return false
  }
}

const getGravatar = md5 => {
  const defaultAvatar = encodeURI(config.DEFAULT_AVATAR)
  const url = `${config.GRAVATAR_API_BASE_URL}/${md5}?d=${defaultAvatar}`
  return url
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
    Vue.prototype.$getGravatar = getGravatar
    Vue.prototype.$alertSuccess = alertSuccess
    Vue.prototype.$alertFail = alertFail
  },
}
