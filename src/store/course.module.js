import agent from '@/api/agent'
import { GET_COURSES } from './actions.type'
import { SET_COURSES } from './mutations.type'

const initialState = {
  courses: [],
}

const state = { ...initialState }

const getters = {}

const actions = {
  async [GET_COURSES]({ commit }) {
    try {
      const { data } = await agent.Course.getList()
      commit(SET_COURSES, data.data)
    } catch (error) {
      console.log('[vuex/course] error', error)
    }
  },
}

const mutations = {
  [SET_COURSES](state, payload) {
    state.courses = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
