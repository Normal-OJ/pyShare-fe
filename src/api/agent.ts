import Vue from 'vue'
import config from '@/constants/config'
import { AxiosResponse } from 'axios'

// 因為後端在每個 response 裡面的 data 又塞了一個 data，
// 所以這裡複寫 AxiosResponse 裡面的 data，改成 data: { data: <REAL_DATA> }
interface PyshareResponse<T = any> extends Omit<AxiosResponse<T>, 'data'> {
  data: {
    data: T
  }
}

interface PysharePromise<T = any> extends Promise<PyshareResponse<T>> {}

const Auth = {
  login: (body: Auth.ILoginBody) => Vue.axios.post('/auth/session', body),

  logout: () => Vue.axios.get('/auth/session'),

  checkToken: () => Vue.axios.post('/auth/check/token'),

  batchSignup: (body: Auth.IBatchSignupBody) => Vue.axios.post('/auth/batch-signup', body),

  changePassword: (body: Auth.IChangePasswordBody) => Vue.axios.post('/auth/change/password', body),

  changeEmail: (body: Auth.IChangeEmailBody) => Vue.axios.post('/auth/change/email', body),

  validateEmail: (body: Auth.IValidateEmailBody) => Vue.axios.post('/auth/check/email', body),
}

const Course = {
  getList: (): PysharePromise<Course.IInfo[]> => Vue.axios.get('/course'),

  get: (id: Course.ID): PysharePromise<Course.IInfo> => Vue.axios.get(`/course/${id}`),

  create: (body: Course.ICreateBody) => Vue.axios.post('/course', body),

  update: (id: Course.ID, body: Course.ICreateBody) => Vue.axios.put(`/course/${id}`, body),

  // TODO: re-define delete api
  // delete: id => Vue.axios.delete(`/course/${id}`),

  addStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    Vue.axios.patch(`/course/${id}/student/insert`, body),

  removeStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    Vue.axios.patch(`/course/${id}/student/remove`, body),

  patchTags: (id: Course.ID, body: Course.IPatchTagsBody) =>
    Vue.axios.patch(`/course/${id}/tag`, body),

  getStats: (id: Course.ID): PysharePromise<Course.IStudentStats[]> =>
    Vue.axios.get(`/course/${id}/statistic`),

  getPermission: (id: Course.ID): PysharePromise<string[]> =>
    Vue.axios.get(`/course/${id}/permission`),
}

const Problem = {
  getList: (params: Problem.IQueryOption): PysharePromise<Problem.IInfo[]> =>
    Vue.axios.get('/problem', { params }),

  get: (id: Problem.ID): PysharePromise<Problem.IInfo> => Vue.axios.get(`/problem/${id}`),

  create: (body: Problem.ICreateBody) => Vue.axios.post('/problem', body),

  update: (id: Problem.ID, body: Problem.ICreateBody) => Vue.axios.put(`/problem/${id}`, body),

  delete: (id: Problem.ID) => Vue.axios.delete(`/problem/${id}`),

  getAttachment: (id: Problem.ID, name: string): PysharePromise<File> =>
    Vue.axios.get(`/problem/${id}/attachment/${name}`),

  addAttachment: (id: Problem.ID, body: FormData) =>
    Vue.axios.post(`/problem/${id}/attachment`, body),

  removeAttachment: (id: Problem.ID, body: FormData) =>
    Vue.axios({ method: 'delete', url: `/problem/${id}/attachment`, data: body }),
}

const Comment = {
  get: (id: _Comment.ID): PysharePromise<_Comment.IInfo> => Vue.axios.get(`/comment/${id}`),

  create: (body: _Comment.ICreateBody) => Vue.axios.post('/comment', body),

  update: (id: _Comment.ID, body: _Comment.ICreateBody) => Vue.axios.put(`/comment/${id}`, body),

  delete: (id: _Comment.ID) => Vue.axios.delete(`/comment/${id}`),

  like: (id: _Comment.ID) => Vue.axios.get(`/comment/${id}/like`),

  createSubmission: (id: _Comment.ID, body: Pick<_Comment.ICreateBody, 'code'>) =>
    Vue.axios.post(`/comment/${id}/submission`, body),
}

const Tag = {
  getList: (params: Tag.IQueryOption): PysharePromise<Tag.name[]> =>
    Vue.axios.get('/tag', { params }),

  create: (body: Tag.ICreateBody) => Vue.axios.post('/tag', body),

  check: (body: Tag.ICreateBody): PysharePromise<Tag.ICheckResponse> =>
    Vue.axios.post('/tag/check', body),

  // TODO: re-define delete api
  // delete: body => Vue.axios.delete('/tag', body),

  delete: (body: Tag.ICreateBody) => Vue.axios({ method: 'delete', url: `/tag`, data: body }),
}

const User = {
  getList: (): PysharePromise<User.IInfo[]> => Vue.axios.get('/user'),

  getStats: (id: User.ID): PysharePromise<User.IStats> => Vue.axios.get(`/user/${id}/statistic`),
}

const Submission = {
  get: (id: Submission.ID): PysharePromise<Submission.IInfo> => Vue.axios.get(`/submission/${id}`),

  grade: (id: Submission.ID, state: Submission.State) =>
    Vue.axios.put(`/submission/${id}/state`, { state }),

  createTest: (body: Submission.ITestBody) => Vue.axios.post('/submission', body),
}

const Gitlab = {
  getReleases: async () => {
    const url = `${config.GITLAB_API_BASE_URL}/projects/${config.GITLAB_PROJECT_ID}/releases`
    return fetch(url).then(response => response.json())
  },
}

const Permission = {
  get: (
    resource: 'course' | 'problem' | 'comment',
    id: Course.ID | Problem.ID | _Comment.ID,
  ): PysharePromise<string[]> => Vue.axios.get(`/${resource}/${id}/permission`),
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
  Permission,
}
