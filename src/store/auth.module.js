import { SET_AUTH } from './mutations.type'
import { getJwt } from '@/lib/jwt'

const initialState = {
  // TODO: 日後在 router 設定先驗證 jwt 後，每次重開應都會 SET_AUTH
  ...getJwt(),
  // isAuthenticated: getJwt().isAuthenticated,
  // username: null,
  // displayName: null,
  // role: null,
  // courses: null,
}

const state = { ...initialState }

const getters = {}

const actions = {}

const mutations = {
  [SET_AUTH](state) {
    const { isAuthenticated, username, displayName, role, courses } = getJwt()
    state.isAuthenticated = isAuthenticated
    state.username = username
    state.displayName = displayName
    state.role = role
    state.courses = courses
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
