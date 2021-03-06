import Vue from 'vue'
import config from '@/constants/config'
import VueCookie from 'vue-cookie'

const initialState = {
  isAuthenticated: false,
  id: null,
  username: null,
  displayName: null,
  role: null,
}

Vue.use(VueCookie)

const vue = new Vue()

export const getJwt = () => {
  if (!vue.$cookie.get(config.jwt)) return initialState
  const { _id, username, displayName, role } = parseJwt(vue.$cookie.get(config.jwt))
  return { id: _id, username, displayName, role, isAuthenticated: true }
}

// eslint-disable-next-line no-unused-vars
function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1])).data
}
