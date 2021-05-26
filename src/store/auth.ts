import { ActionTypes } from './actions-type'
import { SET_JWT, SET_IS_SHOW_LOGOUT_MODAL } from './mutations.type'
import { getJwt } from '@/lib/jwt'
import { ROLE, USERNAME, USER } from './getters.type'
import agent from '@/api/agent'

const initialState = {
  isAuthenticated: false,
  id: null,
  username: null,
  displayName: null,
  role: null,
  courses: [],
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
  async [ActionTypes.LOGIN]({ commit }, body) {
    await agent.Auth.login(body)
    commit(SET_JWT)
  },
  async [ActionTypes.LOGOUT]({ commit }) {
    await agent.Auth.logout()
    commit(SET_JWT)
    commit(SET_IS_SHOW_LOGOUT_MODAL, false)
  },
  async [ActionTypes.GET_JWT]({ commit }) {
    if (!getJwt()) return
    commit(SET_JWT)
    try {
      await agent.Auth.checkToken()
    } catch (error) {
      console.log('[vuex/auth/getJwt] error', error)
      commit(SET_IS_SHOW_LOGOUT_MODAL, true)
    }
  },
}

const mutations = {
  [SET_JWT](state) {
    const jwt = getJwt()
    if (!jwt) {
      Object.assign(state, initialState)
    } else {
      const newState = { ...state, ...jwt }
      Object.assign(state, newState)
    }
  },
  /**
   * change state isShowLogoutModal, trigger when JWT Expired/Invalid
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
