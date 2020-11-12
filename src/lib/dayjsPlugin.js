import dayjs from 'dayjs'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const timeToNow = timestamp => {
  return dayjs(timestamp).toNow()
}

const formattedTime = timestamp => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

export const dayjsPlugin = {
  install(Vue) {
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$timeToNow = timeToNow
    Vue.prototype.$formattedTime = formattedTime
  },
}

export default new dayjs()
