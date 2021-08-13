import { GetterTree, MutationTree, ActionTree } from 'vuex'
import agent from '@/api/agent'
import { initialState, State } from './state'
import { RootState } from '../types'
import { GetterTypes } from '../getter-types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.PERMISSIONS](state) {
    return state.permissions
  },
}

const actions = <ActionTree<State, RootState>>{
  async [ActionTypes.GET_PERMISSIONS](
    { commit },
    {
      resource,
      id,
    }: {
      resource: 'course' | 'problem' | 'comment'
      id: Course.ID | Problem.ID | _Comment.ID
    },
  ) {
    try {
      const { data } = await agent.Permission.get(resource, id)
      commit(MutationTypes.SET_PERMISSIONS, { resource, id, value: data.data })
    } catch (error) {
      console.log('[vuex/permission/getPermissions] error', error)
      throw error
    }
  },
}

const mutations = <MutationTree<State>>{
  [MutationTypes.SET_PERMISSIONS](
    state,
    {
      resource,
      id,
      value,
    }: {
      resource: 'course' | 'problem' | 'comment'
      id: Course.ID | Problem.ID | _Comment.ID
      value: string[]
    },
  ) {
    state.permissions[resource][id] = value
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
