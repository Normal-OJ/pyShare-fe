import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { initialState, State } from './state'
import { RootState } from '../types'
import { GetterTypes } from '../getter-types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'
import agent from '@/api/agent'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.PROBLEMS](state): Problem.IInfo[] {
    return state.problems.filter(p => !p.isTemplate)
  },
  [GetterTypes.TEMPLATES](state): Problem.IInfo[] {
    return state.problems.filter(p => p.isTemplate)
  },
  [GetterTypes.PROBLEMS_OF_MINE](state, getters, rootState): Problem.IInfo[] {
    const { username } = rootState.auth
    return getters[GetterTypes.PROBLEMS].filter(p => p.author.username === username)
  },
}

const actions = <ActionTree<State, RootState>>{
  async [ActionTypes.GET_PROBLEMS](
    { commit },
    params: Omit<Problem.IQueryOption, 'offset' | 'count'>,
  ) {
    const paramsWithGetAll = {
      offset: 0,
      count: -1,
    }
    try {
      const { data } = await agent.Problem.getList({ ...paramsWithGetAll, ...params })
      commit(MutationTypes.SET_PROBLEMS, data.data)
    } catch (error) {
      console.log('[vuex/problem/getProblems] error', error)
      throw error
    }
  },
  async [ActionTypes.GET_PROBLEM_INFO]({ commit }, id: Problem.ID) {
    try {
      const { data } = await agent.Problem.get(id)
      commit(MutationTypes.SET_PROBLEM_INFO, data.data)
    } catch (error) {
      console.log('[vuex/problem/getProblemInfo] error', error)
      throw error
    }
  },
}

const mutations = <MutationTree<State>>{
  [MutationTypes.SET_PROBLEMS](state, payload) {
    state.problems = payload
  },
  [MutationTypes.SET_PROBLEM_INFO](state, payload) {
    state.problemInfo = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
