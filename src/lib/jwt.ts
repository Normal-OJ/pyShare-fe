import Vue from 'vue'
import config from '@/constants/config'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)

const vue = new Vue()

export const getJwt = () => {
  if (!vue.$cookie.get(config.jwt)) return null
  const { _id, username, displayName, role, md5, courses } = parseJwt(vue.$cookie.get(config.jwt))
  return {
    id: _id,
    username,
    displayName,
    role,
    md5,
    courses: courses || [],
    isAuthenticated: true,
  }
}

function parseJwt(
  token: string,
): {
  _id: User.ID | null
  username: string | null
  displayName: string | null
  role: User.Role | null
  md5: string | null
  courses: Course.ID[]
  isAuthenticated: boolean
} {
  return JSON.parse(atob(token.split('.')[1])).data
}
