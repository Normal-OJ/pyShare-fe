import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { initialState, State } from './state'
import { RootState } from '../types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'
import { getJwt } from '@/lib/jwt'
import { GetterTypes } from '../getter-types'
import agent from '@/api/agent'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.USERNAME](state) {
    return state.username
  },
  [GetterTypes.USER_INFO](state) {
    return {
      id: state.id,
      username: state.username,
      displayName: state.displayName,
      role: state.role,
      md5: state.md5,
    }
  },
}

const actions = <ActionTree<State, RootState>>{
  /**
   * login and refresh states
   */
  async [ActionTypes.LOGIN]({ commit }, body: Auth.ILoginBody) {
    await agent.Auth.login(body)
    commit(MutationTypes.SET_JWT)
    commit(MutationTypes.SET_IS_SHOW_LOGOUT_MODAL, false)
  },
  /**
   * logout and refresh states
   */
  async [ActionTypes.LOGOUT]({ commit }) {
    await agent.Auth.logout()
    commit(MutationTypes.SET_JWT)
    commit(MutationTypes.SET_IS_SHOW_LOGOUT_MODAL, false)
  },
  /**
   * get jwt with checking whether token is valid or not
   */
  async [ActionTypes.GET_JWT]({ commit }) {
    if (!getJwt()) {
      commit(MutationTypes.SET_IS_VISITOR)
      return
    }
    try {
      await agent.Auth.checkToken()
      commit(MutationTypes.SET_JWT)
    } catch (error) {
      console.log('[vuex/auth/getJwt] error', error)
      commit(MutationTypes.SET_IS_SHOW_LOGOUT_MODAL, true)
    }
  },
}

const mutations = <MutationTree<State>>{
  /**
   * parse jwt and assign to auth state
   */
  [MutationTypes.SET_JWT](state) {
    const jwt = getJwt()
    if (!jwt) {
      Object.assign(state, initialState)
    } else {
      const newState = { ...state, ...jwt }
      Object.assign(state, newState)
    }
  },
  /**
   * change value of isShowLogoutModal, show modal when JWT is expired or invalid
   */
  [MutationTypes.SET_IS_SHOW_LOGOUT_MODAL](state, payload: boolean) {
    state.isShowLogoutModal = payload
  },
  [MutationTypes.SET_IS_VISITOR](state) {
    state.role = 3
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
