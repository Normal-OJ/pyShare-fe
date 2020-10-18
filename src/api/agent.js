import Vue from 'vue'

// eslint-disable-next-line no-unused-vars
const queryString = require('query-string')

const Auth = {
  login: body => Vue.axios.post('/auth/session', body),
  logout: () => Vue.axios.get('/auth/session'),
}

const User = {}

const Problem = {}

const Course = {
  getList: () => Vue.axios.get('/course'),
  get: name => Vue.axios.get(`/course/${name}`),
  delete: name => Vue.axios.delete(`/course/${name}`),
  create: body => Vue.axios.post('/course', body),
  addStudent: (name, body) => Vue.axios.post(`/course/${name}/student`, body),
  removeStudent: (name, body) => Vue.axios.delete(`/course/${name}/student`, body),
  manageTags: (name, body) => Vue.axios.patch(`/course/${name}/tag`, body),
  getStatistic: name => Vue.axios.get(`/course/${name}/statistic`),
}

export default {
  Auth,
  User,
  Problem,
  Course,
}
