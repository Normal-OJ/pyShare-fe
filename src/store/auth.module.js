import { SET_AUTH } from './mutations.type'
import { getJwt } from '@/lib/jwt'

const initialState = {
  isAuthenticated: getJwt().isAuthenticated,
  username: null,
  displayName: null,
  role: null,
  courses: null,
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
