import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.module'
import course from './course.module'
import problem from './problem.module'
import tag from './tag.module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    course,
    problem,
    tag,
  },
})
