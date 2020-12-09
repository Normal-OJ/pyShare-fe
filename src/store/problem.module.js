import { PROBLEMS, TEMPLATES, PROBLEMS_OF_MINE } from './getters.type'
import { GET_PROBLEMS, GET_PROBLEM_INFO } from './actions.type'
import { SET_PROBLEMS, SET_PROBLEM_INFO } from './mutations.type'
import agent from '@/api/agent'

const initialState = {
  problems: [],
  problemInfo: null,
}

const state = { ...initialState }

const getters = {
  [PROBLEMS](state) {
    return state.problems.filter(p => !p.isTemplate)
  },
  [TEMPLATES](state) {
    return state.problems.filter(p => p.isTemplate)
  },
  [PROBLEMS_OF_MINE](state, getters, rootState) {
    const username = rootState.auth
    return getters[PROBLEMS].filter(p => p.author.username === username)
  }
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
  async [GET_PROBLEM_INFO]({ commit }, pid) {
    try {
      const { data } = await agent.Problem.get(pid)
      commit(SET_PROBLEM_INFO, data.data)
    } catch (error) {
      console.log('[vuex/problem/getProblemInfo] error', error)
    }
  },
}

const mutations = {
  [SET_PROBLEMS](state, payload) {
    state.problems = payload
  },
  [SET_PROBLEM_INFO](state, payload) {
    state.problemInfo = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
