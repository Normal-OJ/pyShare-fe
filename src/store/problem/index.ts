import { GetterTree, MutationTree, ActionTree } from 'vuex'
import agent from '@/api/agent'
import { initialState, State } from './state'
import { RootState } from '../types'
import { GetterTypes } from '../getter-types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.PROBLEMS](state): Problem.IInfo[] {
    return state.problems.filter(p => p.extra._cls !== 'OJProblem')
  },
  [GetterTypes.TEMPLATES](state): Problem.IInfo[] {
    return state.problems.filter(p => p.extra._cls !== 'OJProblem' && p.isTemplate)
  },
  [GetterTypes.CHALLENGES](state): Problem.IInfo[] {
    return state.problems.filter(p => p.extra._cls === 'OJProblem')
  },
  [GetterTypes.CHALLENGES_TEMPLATES](state): Problem.IInfo[] {
    return state.problems.filter(p => p.extra._cls === 'OJProblem' && p.isTemplate)
  },
  [GetterTypes.PROBLEMS_OF_MINE](state, getters, rootState): Problem.IInfo[] {
    const { username } = rootState.auth
    return getters[GetterTypes.PROBLEMS].filter(p => p.author.username === username)
  },
}

const actions = <ActionTree<State, RootState>>{
  async [ActionTypes.GET_PROBLEMS](
    { commit, state },
    params: Omit<Problem.IQueryOption, 'offset' | 'count'>,
  ) {
    if (state.problems.length > 0 && state.problems[0].course !== params.course) {
      commit(MutationTypes.SET_PROBLEMS, [])
    }
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
}

const mutations = <MutationTree<State>>{
  [MutationTypes.SET_PROBLEMS](state, payload) {
    state.problems = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
