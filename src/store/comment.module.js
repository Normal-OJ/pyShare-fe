import { COMMENTS } from './getters.type'
import { GET_COMMENTS } from './actions.type'
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
  async [GET_COMMENTS]({ commit }, commentIds) {
    try {
      const results = await Promise.all(commentIds.map(commentId => agent.Comment.get(commentId)))
      const comments = results.map(result => result.data.data)
      const commentsWithId = comments.map((comment, index) => ({
        id: commentIds[index],
        ...comment,
      }))
      commit(SET_COMMENTS, commentsWithId)
    } catch (error) {
      console.log('[vuex/comment/getComments] error', error)
      throw error
    }
  },
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
