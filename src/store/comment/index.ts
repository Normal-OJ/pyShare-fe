import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { initialState, State } from './state'
import { RootState } from '../types'
import { GetterTypes } from '../getter-types'
import { MutationTypes } from '../mutation-types'
import { ActionTypes } from '../action-types'
import agent from '@/api/agent'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.COMMENTS](state) {
    return state.comments.filter(c => c.status !== 0)
  },
}

const actions = <ActionTree<State, RootState>>{
  /**
   * get a bunch of comments
   */
  async [ActionTypes.GET_COMMENTS]({ commit, dispatch }, ids: _Comment.ID[]) {
    try {
      const comments = ids.slice()
      await Promise.all(
        comments.map((id, index, arr) => {
          // 注意這個 arr 把指標帶進去了，所以在 GET_COMMENT 的修改會進到 state
          return dispatch(ActionTypes.GET_COMMENT, { id, index, arr })
        }),
      )
      commit(MutationTypes.SET_COMMENTS, comments)
    } catch (error) {
      console.log('[vuex/comment/getComments] error', error)
      throw error
    }
  },
  async [ActionTypes.GET_COMMENT](
    _,
    {
      id,
      index,
      arr,
    }: {
      id: _Comment.ID
      index: number
      arr: _Comment.IInfo[] | { status: number; id: string }
    },
  ) {
    try {
      const result = await agent.Comment.get(id)
      arr[index] = result.data.data
      arr[index].id = id
    } catch (error) {
      // 被刪除的會拿到 404，所以沒有資訊可以放
      // 在業務邏輯那邊是寫死若 status 為 0 則不進行後續動作
      arr[index] = { status: 0, id }
      // 這邊不用再拋出 error，已知的錯誤不要 log 到 rollbar
    }
  },
}

const mutations = <MutationTree<State>>{
  [MutationTypes.SET_COMMENTS](state, payload: _Comment.IInfo[]) {
    state.comments = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
