import { LOGOUT } from './actions.type'
import { SET_AUTH, CLEAR_AUTH } from './mutations.type'
import { getJwt, UNAUTHENTICATED } from '@/lib/jwt'
import { ROLE, USERNAME, USER } from './getters.type'
import agent from '@/api/agent'

const initialState = {
  // TODO: 日後在 router 設定先驗證 jwt 後，每次重開應都會 SET_AUTH
  ...getJwt(),
}

const state = { ...initialState }

const getters = {
  [ROLE](state) {
    return state.role
  },
  [USERNAME](state) {
    return state.username
  },
  [USER](state) {
    const { username, displayName } = state
    return { username, displayName }
  },
}

const actions = {
  async [LOGOUT]({ commit }) {
    try {
      await agent.Auth.logout()
      commit(CLEAR_AUTH)
    } catch (error) {
      console.log('[vuex/auth/logout] error', error)
    }
  },
}

const mutations = {
  [SET_AUTH](state) {
    const { isAuthenticated, username, displayName, role, courses } = getJwt()
    state.isAuthenticated = isAuthenticated
    state.username = username
    state.displayName = displayName
    state.role = role
    state.courses = courses
  },
  [CLEAR_AUTH](state) {
    const { isAuthenticated, username, displayName, role, courses } = UNAUTHENTICATED
    state.isAuthenticated = isAuthenticated
    state.username = username
    state.displayName = displayName
    state.role = role
    state.courses = courses
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
