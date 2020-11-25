import Vue from 'vue'

const Auth = {
  login: body => Vue.axios.post('/auth/session', body),
  logout: () => Vue.axios.get('/auth/session'),
  batchSignup: body => Vue.axios.post('/auth/batch-signup', body),
}

const Course = {
  getList: () => Vue.axios.get('/course'),
  get: name => Vue.axios.get(`/course/${name}`),
  create: body => Vue.axios.post('/course', body),
  // TODO: refind delete api
  // delete: name => Vue.axios.delete(`/course/${name}`),
  addStudent: (name, body) => Vue.axios.post(`/course/${name}/student`, body),
  removeStudent: (name, body) => Vue.axios.delete(`/course/${name}/student`, body),
  patchTags: (name, body) => Vue.axios.patch(`/course/${name}/tag`, body),
  getStats: name => Vue.axios.get(`/course/${name}/statistic`),
}

const Problem = {
  getList: params => Vue.axios.get('/problem', { params }),
  get: pid => Vue.axios.get(`/problem/${pid}`),
  create: body => Vue.axios.post('/problem', body),
  update: (pid, body) => Vue.axios.put(`/problem/${pid}`, body),
  delete: pid => Vue.axios.put(`/problem/${pid}`),
  getAttachment: (pid, name) => Vue.axios.get(`/problem/${pid}/attachment/${name}`),
  addAttachment: (pid, body) => Vue.axios.post(`/problem/${pid}/attachment`, body),
  removeAttachment: (pid, body) =>
    Vue.axios({ method: 'delete', url: `/problem/${pid}/attachment`, data: body }),
}

const Comment = {
  get: cid => Vue.axios.get(`/comment/${cid}`),
  create: body => Vue.axios.post('/comment', body),
  update: (cid, body) => Vue.axios.put(`/comment/${cid}`, body),
  createSubmission: (cid, body) => Vue.axios.post(`/comment/${cid}/submission`, body),
}

const Tag = {
  getList: params => Vue.axios.get('/tag', { params }),
  create: body => Vue.axios.post('/tag', body),
  // TODO: refind delete api
  // delete: body => Vue.axios.delete('/tag', body),
}

const User = {
  getList: () => Vue.axios.get('/user'),
  getStats: username => Vue.axios.get(`/user/${username}/statistic`),
}

const Submission = {
  createTest: body => Vue.axios.post('/submission', body),
}

export default {
  Auth,
  Course,
  Problem,
  Comment,
  Tag,
  User,
  Submission,
}
