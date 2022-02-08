import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw'
import { VueConstructor } from 'vue/types/umd'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

const format = 'YYYY-MM-DD HH:mm'

const timeFromNow = (timestamp: number | string) => {
  if (typeof timestamp === 'number') {
    return dayjs(timestamp * 1000).fromNow()
  }
  return dayjs(timestamp).fromNow()
}

const formattedTime = (timestamp: number | string) => {
  if (typeof timestamp === 'number') {
    return dayjs(timestamp * 1000).format(format)
  }
  return dayjs(timestamp).format(format)
}

export const dayjsPlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$timeFromNow = timeFromNow
    Vue.prototype.$formattedTime = formattedTime
  },
}
