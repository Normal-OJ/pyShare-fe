import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import course from './course.module'
import problem from './problem.module'
import comment from './comment.module'
import permission from './permission.module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    course,
    problem,
    comment,
    permission,
  },
})
