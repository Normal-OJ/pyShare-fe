import agent from '@/api/agent'
import { GET_COURSES, GET_COURSE_STATS, GET_COURSE_INFO, GET_COURSE_TAGS } from './actions.type'
import { SET_COURSES, SET_COURSE_STATS, SET_COURSE_INFO, SET_COURSE_TAGS } from './mutations.type'

const initialState = {
  courses: [],
  courseStats: [],
  courseInfo: {
    teacher: null,
    students: [],
    problems: [],
  },
  courseTags: [],
}

const state = { ...initialState }

const getters = {}

const actions = {
  async [GET_COURSES]({ commit }) {
    try {
      const { data } = await agent.Course.getList()
      commit(SET_COURSES, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourses] error', error)
    }
  },
  async [GET_COURSE_STATS]({ commit }, name) {
    try {
      const { data } = await agent.Course.getStats(name)
      commit(SET_COURSE_STATS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseStats] error', error)
    }
  },
  async [GET_COURSE_INFO]({ commit }, name) {
    try {
      const { data } = await agent.Course.get(name)
      commit(SET_COURSE_INFO, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseInfo] error', error)
    }
  },
  async [GET_COURSE_TAGS]({ commit }, params) {
    try {
      const { data } = await agent.Tag.getList(params)
      commit(SET_COURSE_TAGS, data.data)
    } catch (error) {
      console.log('[vuex/tag/getTags] error', error)
    }
  },
}

const mutations = {
  [SET_COURSES](state, payload) {
    state.courses = payload
  },
  [SET_COURSE_STATS](state, payload) {
    state.courseStats = payload
  },
  [SET_COURSE_INFO](state, payload) {
    state.courseInfo = payload
  },
  [SET_COURSE_TAGS](state, payload) {
    state.courseTags = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
