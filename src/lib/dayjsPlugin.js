import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'

dayjs.locale('zh-tw')

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const timeFromNow = timestamp => {
  return dayjs(timestamp * 1000).fromNow()
}

const formattedTime = timestamp => {
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
}

export const dayjsPlugin = {
  install(Vue) {
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$timeFromNow = timeFromNow
    Vue.prototype.$formattedTime = formattedTime
  },
}

export default new dayjs()
