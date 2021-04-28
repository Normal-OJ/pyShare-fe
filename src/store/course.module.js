import agent from '@/api/agent'
import { COURSE_INFO } from './getters.type'
import {
  GET_COURSE_STATS,
  GET_COURSE_INFO,
  GET_COURSE_TAGS,
  GET_COURSE_PROBLEMS,
} from './actions.type'
import {
  SET_COURSE_STATS,
  SET_COURSE_INFO,
  SET_COURSE_TAGS,
  SET_COURSE_PROBLEMS,
} from './mutations.type'

const initialState = {
  courseStats: null,
  courseInfo: null,
  coursePermission: {},
  courseProblems: null,
  courseTags: [],
}

const state = { ...initialState }

const getters = {
  [COURSE_INFO](state) {
    return state.courseInfo
  },
}

const actions = {
  /**
   * get courses statistics
   * @param {Object} context
   * @param {String} payload course id
   */
  async [GET_COURSE_STATS]({ commit }, id) {
    try {
      const { data } = await agent.Course.getStats(id)
      commit(SET_COURSE_STATS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseStats] error', error)
      throw error
    }
  },
  /**
   * get course information
   * @param {Object} context
   * @param {String} payload course id
   */
  async [GET_COURSE_INFO]({ commit }, id) {
    try {
      const { data } = await agent.Course.get(id)
      commit(SET_COURSE_INFO, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseInfo] error', error)
      throw error
    }
  },
  async [GET_COURSE_TAGS]({ commit }, id) {
    try {
      const { data } = await agent.Tag.getList({ course: id })
      commit(SET_COURSE_TAGS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseTags] error', error)
      throw error
    }
  },
  async [GET_COURSE_PROBLEMS]({ commit }, id) {
    try {
      const { data } = await agent.Problem.getList({ course: id })
      commit(SET_COURSE_PROBLEMS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseProblems] error', error)
      throw error
    }
  },
}

const mutations = {
  [SET_COURSE_STATS](state, payload) {
    state.courseStats = payload
  },
  [SET_COURSE_INFO](state, payload) {
    state.courseInfo = payload
  },
  [SET_COURSE_TAGS](state, payload) {
    state.courseTags = payload
  },
  [SET_COURSE_PROBLEMS](state, payload) {
    state.courseProblems = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
