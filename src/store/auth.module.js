import { LOGIN, LOGOUT } from './actions.type'
import { APPLY_JWT, SET_IS_SHOW_LOGOUT_MODAL } from './mutations.type'
import { getJwt } from '@/lib/jwt'
import { ROLE, USERNAME, USER } from './getters.type'
import agent from '@/api/agent'

const initialState = {
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
  async [LOGIN]({ commit }, body) {
    await agent.Auth.login(body)
    commit(APPLY_JWT)
  },
  async [LOGOUT]({ commit }) {
    await agent.Auth.logout()
    commit(APPLY_JWT)
    commit(SET_IS_SHOW_LOGOUT_MODAL, false)
  },
}

const mutations = {
  [APPLY_JWT](state) {
    const { isAuthenticated, id, username, displayName, role, courses } = getJwt()
    state.isAuthenticated = isAuthenticated
    state.id = id
    state.username = username
    state.displayName = displayName
    state.role = role
    state.courses = courses
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
