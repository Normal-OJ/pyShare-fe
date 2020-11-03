import { GET_PROBLEM_BY_ID, PROBLEMS, TEMPLATES } from './getters.type'
import { GET_PROBLEMS } from './actions.type'
import { SET_PROBLEMS } from './mutations.type'
import agent from '@/api/agent'

const initialState = {
  problems: [],
}

const state = { ...initialState }

const getters = {
  [GET_PROBLEM_BY_ID](state) {
    return pid => state.problems.find(prob => prob.pid === pid)
  },
  [PROBLEMS](state) {
    return state.problems.filter(p => !p.isTemplate)
  },
  [TEMPLATES](state) {
    return state.problems.filter(p => p.isTemplate)
  },
}

const actions = {
  async [GET_PROBLEMS]({ commit }, params) {
    const paramsWithGetAll = {
      offset: 0,
      count: -1,
    }
    try {
      const { data } = await agent.Problem.getList({ ...paramsWithGetAll, ...params })
      commit(SET_PROBLEMS, data.data)
    } catch (error) {
      console.log('[vuex/problem/getProblems] error', error)
    }
  },
}

const mutations = {
  [SET_PROBLEMS](state, payload) {
    state.problems = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
