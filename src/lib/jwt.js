// import Vue from 'vue'
// import config from '@/constants/config'

// TODO: fix vue-cookies!

// const vue = new Vue()
export const getJwt = () => ({ isAuthenticated: true })
// export const getJwt = () => {
//   if (!vue.$cookies.isKey(config.jwt)) return { isAuthenticated: false }
//   const { username, displayName, role, courses } = parseJwt(vue.$cookies.get(config.jwt))
//   return { username, displayName, role, courses, isAuthenticated: true }
// }

// eslint-disable-next-line no-unused-vars
function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1])).data
}
