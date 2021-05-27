import Vue from 'vue'
import Vuex from 'vuex'
import { RootState } from './types'
import auth from './auth'
import course from './course'
import problem from './problem'
import comment from './comment'
import permission from './permission'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    course,
    problem,
    comment,
    permission,
  },
})
