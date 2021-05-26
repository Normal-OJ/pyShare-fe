import Vue from 'vue'
import config from '@/constants/config'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)

const vue = new Vue()

export const getJwt = () => {
  if (!vue.$cookie.get(config.jwt)) return null
  const { _id, username, displayName, role } = parseJwt(vue.$cookie.get(config.jwt))
  return { id: _id, username, displayName, role, isAuthenticated: true }
}

function parseJwt(
  token: string,
): {
  _id: User.ID | null
  username: string | null
  displayName: string | null
  role: User.Role | null
  isAuthenticated: boolean
} {
  return JSON.parse(atob(token.split('.')[1])).data
}
