import { COMMENTS } from './getters.type'
import { GET_COMMENTS, GET_COMMENT } from './actions.type'
import { SET_COMMENTS } from './mutations.type'
import agent from '@/api/agent'

const initialState = {
  comments: [],
}

const state = { ...initialState }

const getters = {
  [COMMENTS](state) {
    return state.comments.filter(c => c.status !== 0)
  },
}

const actions = {
  /**
   * get a bunch of comments
   * @param {*} param0
   * @param {Array} commentIds array of commentId of a problem
   */
  async [GET_COMMENTS]({ commit, dispatch }, commentIds) {
    try {
      const comments = commentIds.slice()
      await Promise.all(
        comments.map((cid, index, arr) => {
          return dispatch(GET_COMMENT, { cid, index, arr })
        }),
      )
      commit(SET_COMMENTS, comments)
    } catch (error) {
      console.log('[vuex/comment/getComments] error', error)
      throw error
    }
  },
  async [GET_COMMENT]({ commit }, { cid, index, arr }) {
    try {
      const result = await agent.Comment.get(cid)
      arr[index] = result.data.data
      arr[index].id = cid
    } catch (error) {
      arr[index] = { status: 0, id: cid }
      // throw error
    }
  }
}

const mutations = {
  [SET_COMMENTS](state, payload) {
    state.comments = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
