import Vue from 'vue'

const Auth = {
  login: body => Vue.axios.post('/auth/session', body),
  logout: () => Vue.axios.get('/auth/session'),
}

const Course = {
  getList: () => Vue.axios.get('/course'),
  get: name => Vue.axios.get(`/course/${name}`),
  create: body => Vue.axios.post('/course', body),
  delete: name => Vue.axios.delete(`/course/${name}`),
  addStudent: (name, body) => Vue.axios.post(`/course/${name}/student`, body),
  removeStudent: (name, body) => Vue.axios.delete(`/course/${name}/student`, body),
  manageTags: (name, body) => Vue.axios.patch(`/course/${name}/tag`, body),
  getStatistic: name => Vue.axios.get(`/course/${name}/statistic`),
}

const Problem = {
  getList: params => Vue.axios.get('/problem', { params }),
  get: pid => Vue.axios.get(`/problem/${pid}`),
  create: body => Vue.axios.post('/problem', body),
  update: (pid, body) => Vue.axios.put(`/problem/${pid}`, body),
  delete: pid => Vue.axios.put(`/problem/${pid}`),
  addAttachment: (pid, body) => Vue.axios.post(`/problem/${pid}/attachment`, body),
  removeAttachment: (pid, body) => Vue.axios.delete(`/problem/${pid}/attachment`, body),
}

const Tag = {
  getList: body => Vue.axios.get('/tag', body),
  create: body => Vue.axios.post('/tag', body),
  delete: body => Vue.axios.delete('/tag', body),
}

const User = {}

export default {
  Auth,
  Course,
  Problem,
  Tag,
  User,
}
