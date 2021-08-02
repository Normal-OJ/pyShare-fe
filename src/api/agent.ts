import config from '@/constants/config'
import store from '@/store'
import { MutationTypes } from '@/store/mutation-types'
import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: config.API_BASE_URL,
})

instance.interceptors.response.use(
  res => res,
  error => {
    if (error?.response) {
      // catch Authorization Expired
      if (
        error.response?.data.message === 'Authorization Expired' ||
        error.response?.data.message === 'Invalid Token'
      ) {
        store.commit(MutationTypes.SET_IS_SHOW_LOGOUT_MODAL, true)
      }
      throw error.response.data
    }
    throw error
  },
)

// 因為後端在每個 response 裡面的 data 又塞了一個 data，
// 所以這裡複寫 AxiosResponse 裡面的 data，改成 data: { data: <ACTUAL_DATA> }
interface PyshareResponse<T = any> extends Omit<AxiosResponse<T>, 'data'> {
  data: {
    data?: T
  }
}

interface PysharePromise<T = any> extends Promise<PyshareResponse<T>> {}

const Auth = {
  login: (body: Auth.ILoginBody) => instance.post('/auth/session', body),

  logout: () => instance.get('/auth/session'),

  checkToken: () => instance.post('/auth/check/token'),

  batchSignup: (body: Auth.IBatchSignupBody) => instance.post('/auth/batch-signup', body),

  changePassword: (body: Auth.IChangePasswordBody) => instance.post('/auth/change/password', body),

  changeEmail: (body: Auth.IChangeEmailBody) => instance.post('/auth/change/email', body),

  validateEmail: (body: Auth.IValidateEmailBody) => instance.post('/auth/check/email', body),
}

const Course = {
  getList: (): PysharePromise<Partial<Course.IInfo>[]> => instance.get('/course'),

  get: (id: Course.ID): PysharePromise<Course.IInfo> => instance.get(`/course/${id}`),

  create: (body: Course.ICreateBody) => instance.post('/course', body),

  update: (id: Course.ID, body: Course.ICreateBody) => instance.put(`/course/${id}`, body),

  // TODO: re-define delete api
  // delete: id => instance.delete(`/course/${id}`),

  addStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    instance.patch(`/course/${id}/student/insert`, body),

  removeStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    instance.patch(`/course/${id}/student/remove`, body),

  patchTags: (id: Course.ID, body: Course.IPatchTagsBody) =>
    instance.patch(`/course/${id}/tag`, body),

  getStats: (id: Course.ID): PysharePromise<Course.IStudentStats[]> =>
    instance.get(`/course/${id}/statistic`),

  getOJStats: (id: Course.ID, pids: Problem.ID[]): PysharePromise<Course.IOJStats> =>
    instance.get(`/course/${id}/statistic/oj-problem`, { params: { pids } }),

  getPermission: (id: Course.ID): PysharePromise<string[]> =>
    instance.get(`/course/${id}/permission`),
}

const Problem = {
  getList: (params: Problem.IQueryOption): PysharePromise<Problem.IInfo[]> =>
    instance.get('/problem', { params }),

  get: (id: Problem.ID): PysharePromise<Problem.IInfo> => instance.get(`/problem/${id}`),

  create: (body: Problem.ICreateBody) => instance.post('/problem', body),

  update: (id: Problem.ID, body: Problem.ICreateBody) => instance.put(`/problem/${id}`, body),

  delete: (id: Problem.ID) => instance.delete(`/problem/${id}`),

  getAttachment: (id: Problem.ID, name: string): PysharePromise<File> =>
    instance.get(`/problem/${id}/attachment/${name}`),

  addAttachment: (id: Problem.ID, body: FormData) =>
    instance.post(`/problem/${id}/attachment`, body),

  removeAttachment: (id: Problem.ID, body: FormData) =>
    instance({ method: 'delete', url: `/problem/${id}/attachment`, data: body }),

  clone: (pid: Problem.ID, cid: Course.ID, isTemplate: boolean) =>
    instance.get(`/problem/${pid}/clone/${cid}`, { params: { isTemplate } }),
}

const Comment = {
  get: (id: _Comment.ID): PysharePromise<_Comment.IInfo> => instance.get(`/comment/${id}`),

  create: (body: _Comment.ICreateBody) => instance.post('/comment', body),

  update: (id: _Comment.ID, body: _Comment.ICreateBody) => instance.put(`/comment/${id}`, body),

  delete: (id: _Comment.ID) => instance.delete(`/comment/${id}`),

  like: (id: _Comment.ID) => instance.get(`/comment/${id}/like`),

  createSubmission: (id: _Comment.ID, body: Pick<_Comment.ICreateBody, 'code'>) =>
    instance.post(`/comment/${id}/submission`, body),
}

const Tag = {
  getList: (params: Tag.IQueryOption): PysharePromise<Tag.name[]> =>
    instance.get('/tag', { params }),

  create: (body: Tag.ICreateBody) => instance.post('/tag', body),

  check: (body: Tag.ICreateBody): PysharePromise<Tag.ICheckResponse> =>
    instance.post('/tag/check', body),

  // TODO: re-define delete api
  // delete: body => instance.delete('/tag', body),

  delete: (body: Tag.ICreateBody) => instance({ method: 'delete', url: `/tag`, data: body }),
}

const User = {
  get: (id: User.ID): PysharePromise<User.IInfo> => instance.get(`/user/${id}`),

  getList: (): PysharePromise<User.IInfo[]> => instance.get('/user'),

  getStats: (id: User.ID): PysharePromise<User.IStats> => instance.get(`/user/${id}/statistic`),
}

const Submission = {
  get: (id: Submission.ID): PysharePromise<Submission.IInfo> => instance.get(`/submission/${id}`),

  grade: (id: Submission.ID, state: Submission.State) =>
    instance.put(`/submission/${id}/state`, { state }),

  createTest: (body: Submission.ITestBody) => instance.post('/submission', body),
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
  ): PysharePromise<string[]> => instance.get(`/${resource}/${id}/permission`),
}

const Dataset = {
  getList: (): PysharePromise<Dataset.IInfo[]> => instance.get('/dataset'),
  get: (id: Dataset.ID): PysharePromise<Dataset.IInfo> => instance.get(`/dataset/${id}`),
}

const School = {
  getList: (): PysharePromise<School.Info[]> => instance.get('/school'),
  get: (abbr: Pick<School.Info, 'abbr'>): PysharePromise<School.Info> =>
    instance.get(`/school/${abbr}`),
  createSchool: (body: School.Info) => instance.post('/school', body),
}

export default {
  Auth,
  Course,
  Problem,
  Comment,
  Tag,
  User,
  School,
  Submission,
  Gitlab,
  Permission,
  Dataset,
}
