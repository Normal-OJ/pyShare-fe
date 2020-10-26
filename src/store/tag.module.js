import { GET_TAGS } from './actions.type'
import { SET_TAGS } from './mutations.type'
import agent from '@/api/agent'

const initialState = {
  tags: [],
}

const state = { ...initialState }

const getters = {}

const actions = {
  async [GET_TAGS]({ commit }, params) {
    try {
      const { data } = await agent.Tag.getList(params)
      commit(SET_TAGS, data.data)
    } catch (error) {
      console.log('[vuex/tag] error', error)
    }
  },
}

const mutations = {
  [SET_TAGS](state, payload) {
    state.tags = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
