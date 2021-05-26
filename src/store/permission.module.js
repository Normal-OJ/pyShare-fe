import { PERMISSIONS } from './getters.type'
import { ActionTypes } from './actions-type'
import { SET_PERMISSIONS } from './mutations.type'
import agent from '@/api/agent'

const initialState = {
  permissions: {
    course: {},
    problem: {},
    comment: {},
  },
}

const state = { ...initialState }

const getters = {
  [PERMISSIONS](state) {
    return state.permissions
  },
}

const actions = {
  async [ActionTypes.GET_PERMISSIONS]({ commit }, { resource, id }) {
    try {
      const { data } = await agent.Permission.get(resource, id)
      commit(SET_PERMISSIONS, { resource, id, value: data.data })
    } catch (error) {
      console.log('[vuex/permission/getPermissions] error', error)
      throw error
    }
  },
}

const mutations = {
  [SET_PERMISSIONS](state, { resource, id, value }) {
    state.permissions[resource][id] = value
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
