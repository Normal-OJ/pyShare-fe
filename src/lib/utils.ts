import Vue from 'vue'
import store from '@/store'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import { VueConstructor } from 'vue/types/umd'

const isSelf = (name: string) => {
  const username = store.getters && store.getters[GetterTypes.USERNAME]
  if (!username) return false
  return name === username
}

export const hasPermission = async (
  resource: 'course' | 'problem' | 'comment',
  id: Course.ID | Problem.ID | _Comment.ID,
  requirement: string[],
) => {
  try {
    const permissions = store.getters && store.getters[GetterTypes.PERMISSIONS]
    if (!permissions[resource][id]) {
      await store.dispatch(ActionTypes.GET_PERMISSIONS, { resource, id })
    }
    // 物件 copy by sharing，這裡會吃到新的
    return requirement.every((req) => permissions[resource][id].includes(req))
  } catch (error) {
    console.log('[lib/utils/hasPermission] error', error)
    return false
  }
}

export const alertSuccess = (text: string) => {
  Vue.notify({
    group: 'alert',
    type: 'my-success',
    title: text,
  })
}

export const alertFail = (text: string) => {
  Vue.notify({
    group: 'alert',
    type: 'my-error',
    title: text,
  })
}

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const createFileDownloadLink = (filename: string, href: string): HTMLAnchorElement => {
  const fileDownloadLink = document.createElement('a')
  fileDownloadLink.download = filename
  fileDownloadLink.href = href
  return fileDownloadLink
}

export const downloadFile = (filename: string, href: string): void => {
  const link = createFileDownloadLink(filename, href)
  link.click()
  link.remove()
}

export const utilsPlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$isSelf = isSelf
    Vue.prototype.$hasPermission = hasPermission
    Vue.prototype.$alertSuccess = alertSuccess
    Vue.prototype.$alertFail = alertFail
  },
}
