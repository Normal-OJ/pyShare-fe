import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw'

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

const timeFromNow = (timestamp: number) => {
  return dayjs(timestamp * 1000).fromNow()
}

const formattedTime = (timestamp: number) => {
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
}

export const dayjsPlugin = {
  install(Vue) {
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$timeFromNow = timeFromNow
    Vue.prototype.$formattedTime = formattedTime
  },
}
