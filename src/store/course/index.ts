import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { initialState, State } from './state'
import { RootState } from '../types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'
import agent from '@/api/agent'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{}

const actions = <ActionTree<State, RootState>>{
  async [ActionTypes.GET_COURSES]({ commit }) {
    try {
      const { data } = await agent.Course.getList()
      commit(MutationTypes.SET_COURSES, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourses] error', error)
      throw error
    }
  },
  /**
   * get courses statistics
   */
  async [ActionTypes.GET_COURSE_STATS]({ commit }, id) {
    try {
      const { data } = await agent.Course.getStats(id)
      commit(MutationTypes.SET_COURSE_STATS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseStats] error', error)
      throw error
    }
  },
  /**
   * get course information
   */
  async [ActionTypes.GET_COURSE_INFO]({ commit }, id) {
    try {
      const { data } = await agent.Course.get(id)
      commit(MutationTypes.SET_COURSE_INFO, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseInfo] error', error)
      throw error
    }
  },
  async [ActionTypes.GET_COURSE_TAGS]({ commit }, id) {
    try {
      const { data } = await agent.Tag.getList({ course: id })
      commit(MutationTypes.SET_COURSE_TAGS, data.data)
    } catch (error) {
      console.log('[vuex/course/getCourseTags] error', error)
      throw error
    }
  },
}

const mutations = <MutationTree<State>>{
  [MutationTypes.SET_COURSES](state, payload) {
    state.courses = payload
  },
  [MutationTypes.SET_COURSE_STATS](state, payload) {
    state.courseStats = payload
  },
  [MutationTypes.SET_COURSE_INFO](state, payload) {
    state.courseInfo = payload
  },
  [MutationTypes.SET_COURSE_TAGS](state, payload) {
    state.courseTags = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
