import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { initialState, State } from './state'
import { RootState } from '../types'
import { ActionTypes } from '../action-types'
import { MutationTypes } from '../mutation-types'
import agent from '@/api/agent'
import { GetterTypes } from '../getter-types'

const state = { ...initialState }

const getters = <GetterTree<State, RootState>>{
  [GetterTypes.TEACHING_COURSES](state, getters, RootState) {
    const myCourses = RootState.auth.courses
    const isMyCourses = (course: Course.IInfo) => myCourses.indexOf(course.id) !== -1
    const isTeachedByMe = (course: Course.IInfo) => course.teacher.id === RootState.auth.id
    return state.courses.filter(course => isMyCourses(course) && isTeachedByMe(course))
  },
  [GetterTypes.ENROLLED_COURSES](state, getters, RootState) {
    const myCourses = RootState.auth.courses
    const isMyCourses = (course: Course.IInfo) => myCourses.indexOf(course.id) !== -1
    const notTeachedByMe = (course: Course.IInfo) => course.teacher.id !== RootState.auth.id
    return state.courses.filter(course => isMyCourses(course) && notTeachedByMe(course))
  },
  [GetterTypes.OTHER_COURSES](state, getters, RootState) {
    const myCourses = RootState.auth.courses
    const notMyCourses = (course: Course.IInfo) => myCourses.indexOf(course.id) === -1
    return state.courses.filter(notMyCourses)
  },
}

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
  [MutationTypes.SET_COURSES](state, payload: Course.IInfo[]) {
    state.courses = payload
  },
  [MutationTypes.SET_COURSE_STATS](state, payload: Course.IStudentStats[]) {
    state.courseStats = payload
  },
  [MutationTypes.SET_COURSE_INFO](state, payload: Course.IInfo) {
    state.courseInfo = payload
  },
  [MutationTypes.SET_COURSE_TAGS](state, payload: Tag.name[]) {
    state.courseTags = payload
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
