import { LOGOUT } from './actions.type'
import { SET_AUTH, CLEAR_AUTH, SET_IS_SHOW_LOGOUT_MODAL } from './mutations.type'
import { getJwt, UNAUTHENTICATED } from '@/lib/jwt'
import { ROLE, USERNAME, USER } from './getters.type'
import agent from '@/api/agent'

const initialState = {
  // TODO: 日後在 router 設定先驗證 jwt 後，每次重開應都會 SET_AUTH
  ...getJwt(),
  isShowLogoutModal: false,
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
      throw error
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
    state.isShowLogoutModal = false
  },
  /**
   * change state isShowLogoutModal, trigger at JWT Expired
   * @param {object} state auth state
   * @param {bool} payload the target value
   */
  [SET_IS_SHOW_LOGOUT_MODAL](state, payload) {
    state.isShowLogoutModal = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
