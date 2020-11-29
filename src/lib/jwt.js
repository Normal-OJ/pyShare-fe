import Vue from 'vue'
import config from '@/constants/config'
import VueCookie from 'vue-cookie'

const unAuthenticated = { isAuthenticated: false }

Vue.use(VueCookie)

const vue = new Vue()

export const getJwt = () => {
  if (!vue.$cookie.get(config.jwt)) return unAuthenticated
  const { username, displayName, role, courses } = parseJwt(vue.$cookie.get(config.jwt))
  return { username, displayName, role, courses, isAuthenticated: true }
}

// eslint-disable-next-line no-unused-vars
function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1])).data
}
