import Vue from 'vue'
import gitlab from '@/constants/gitlab'

const Auth = {
  login: body => Vue.axios.post('/auth/session', body),
  logout: () => Vue.axios.get('/auth/session'),
  batchSignup: body => Vue.axios.post('/auth/batch-signup', body),
  changePassword: body => Vue.axios.post('/auth/change-password', body),
}

const Course = {
  getList: () => Vue.axios.get('/course'),
  get: id => Vue.axios.get(`/course/${id}`),
  create: body => Vue.axios.post('/course', body),
  // TODO: re-define delete api
  // delete: name => Vue.axios.delete(`/course/${name}`),
  addStudent: (id, body) => Vue.axios.patch(`/course/${id}/student/insert`, body),
  removeStudent: (id, body) => Vue.axios.patch(`/course/${id}/student/remove`, body),
  patchTags: (id, body) => Vue.axios.patch(`/course/${id}/tag`, body),
  getStats: id => Vue.axios.get(`/course/${id}/statistic`),
}

const Problem = {
  getList: params => Vue.axios.get('/problem', { params }),
  get: pid => Vue.axios.get(`/problem/${pid}`),
  create: body => Vue.axios.post('/problem', body),
  update: (pid, body) => Vue.axios.put(`/problem/${pid}`, body),
  delete: pid => Vue.axios.delete(`/problem/${pid}`),
  getAttachment: (pid, name) => Vue.axios.get(`/problem/${pid}/attachment/${name}`),
  addAttachment: (pid, body) => Vue.axios.post(`/problem/${pid}/attachment`, body),
  removeAttachment: (pid, body) =>
    Vue.axios({ method: 'delete', url: `/problem/${pid}/attachment`, data: body }),
}

const Comment = {
  get: cid => Vue.axios.get(`/comment/${cid}`),
  create: body => Vue.axios.post('/comment', body),
  update: (cid, body) => Vue.axios.put(`/comment/${cid}`, body),
  delete: cid => Vue.axios.delete(`/comment/${cid}`),
  like: cid => Vue.axios.get(`/comment/${cid}/like`),
  createSubmission: (cid, body) => Vue.axios.post(`/comment/${cid}/submission`, body),
}

const Tag = {
  getList: params => Vue.axios.get('/tag', { params }),
  create: body => Vue.axios.post('/tag', body),
  check: body => Vue.axios.post('/tag/check', body),
  // TODO: re-define delete api
  // delete: body => Vue.axios.delete('/tag', body),
  delete: body => Vue.axios({ method: 'delete', url: `/tag`, data: body }),
}

const User = {
  getList: () => Vue.axios.get('/user'),
  getStats: id => Vue.axios.get(`/user/${id}/statistic`),
}

const Submission = {
  get: sid => Vue.axios.get(`/submission/${sid}`),
  grade: (sid, state) => Vue.axios.put(`/submission/${sid}/state`, { state }),
  createTest: body => Vue.axios.post('/submission', body),
}

const Gitlab = {
  getReleases: () => {
    const url = `${gitlab.API_BASE_URL}/projects/${gitlab.PROJECT_ID}/releases`
    return fetch(url).then(response => response.json())
  },
}

export default {
  Auth,
  Course,
  Problem,
  Comment,
  Tag,
  User,
  Submission,
  Gitlab,
}
