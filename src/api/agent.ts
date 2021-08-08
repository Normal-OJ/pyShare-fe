import config from '@/constants/config'
import store from '@/store'
import { MutationTypes } from '@/store/mutation-types'
import axios, { AxiosResponse } from 'axios'

const fetcher = axios.create({
  baseURL: config.API_BASE_URL,
})

fetcher.interceptors.response.use(
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
  login: (body: Auth.ILoginBody) => fetcher.post('/auth/session', body),

  logout: () => fetcher.get('/auth/session'),

  checkToken: () => fetcher.post('/auth/check/token'),

  batchSignup: (body: Auth.IBatchSignupBody) => fetcher.post('/auth/batch-signup', body),

  changePassword: (body: Auth.IChangePasswordBody) => fetcher.post('/auth/change/password', body),

  changeEmail: (body: Auth.IChangeEmailBody) => fetcher.post('/auth/change/email', body),

  validateEmail: (body: Auth.IValidateEmailBody) => fetcher.post('/auth/check/email', body),
}

const Course = {
  getList: (): PysharePromise<Partial<Course.IInfo>[]> => fetcher.get('/course'),

  get: (id: Course.ID): PysharePromise<Course.IInfo> => fetcher.get(`/course/${id}`),

  create: (body: Course.ICreateBody) => fetcher.post('/course', body),

  update: (id: Course.ID, body: Course.ICreateBody) => fetcher.put(`/course/${id}`, body),

  addStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    fetcher.patch(`/course/${id}/student/insert`, body),

  removeStudent: (id: Course.ID, body: Course.IPatchStudentsBody) =>
    fetcher.patch(`/course/${id}/student/remove`, body),

  patchTags: (id: Course.ID, body: Course.IPatchTagsBody) =>
    fetcher.patch(`/course/${id}/tag`, body),

  getStats: (id: Course.ID): PysharePromise<Course.IStudentStats[]> =>
    fetcher.get(`/course/${id}/statistic`),

  getOJStats: (id: Course.ID, pids: Problem.ID[]): PysharePromise<Course.IOJStats> =>
    fetcher.get(`/course/${id}/statistic/oj-problem`, { params: { pids } }),

  getPermission: (id: Course.ID): PysharePromise<string[]> =>
    fetcher.get(`/course/${id}/permission`),
}

const Problem = {
  getList: (params: Problem.IQueryOption): PysharePromise<Problem.IInfo[]> =>
    fetcher.get('/problem', { params }),

  get: (id: Problem.ID): PysharePromise<Problem.IInfo> => fetcher.get(`/problem/${id}`),

  create: (body: Problem.ICreateBody) => fetcher.post('/problem', body),

  update: (id: Problem.ID, body: Problem.ICreateBody) => fetcher.put(`/problem/${id}`, body),

  delete: (id: Problem.ID) => fetcher.delete(`/problem/${id}`),

  getAttachment: (id: Problem.ID, name: string): PysharePromise<File> =>
    fetcher.get(`/problem/${id}/attachment/${name}`),

  addAttachment: (id: Problem.ID, body: FormData) =>
    fetcher.post(`/problem/${id}/attachment`, body),

  removeAttachment: (id: Problem.ID, body: FormData) =>
    fetcher({ method: 'delete', url: `/problem/${id}/attachment`, data: body }),

  clone: (pid: Problem.ID, cid: Course.ID, isTemplate: boolean) =>
    fetcher.get(`/problem/${pid}/clone/${cid}`, { params: { isTemplate } }),
}

const Comment = {
  get: (id: _Comment.ID): PysharePromise<_Comment.IInfo> => fetcher.get(`/comment/${id}`),

  create: (body: _Comment.ICreateBody) => fetcher.post('/comment', body),

  update: (id: _Comment.ID, body: _Comment.ICreateBody) => fetcher.put(`/comment/${id}`, body),

  delete: (id: _Comment.ID) => fetcher.delete(`/comment/${id}`),

  like: (id: _Comment.ID) => fetcher.get(`/comment/${id}/like`),

  createSubmission: (id: _Comment.ID, body: Pick<_Comment.ICreateBody, 'code'>) =>
    fetcher.post(`/comment/${id}/submission`, body),
}

const Tag = {
  getList: (params: Tag.IQueryOption): PysharePromise<Tag.name[]> =>
    fetcher.get('/tag', { params }),

  create: (body: Tag.ICreateBody) => fetcher.post('/tag', body),

  check: (body: Tag.ICreateBody): PysharePromise<Tag.ICheckResponse> =>
    fetcher.post('/tag/check', body),

  delete: (body: Tag.ICreateBody) => fetcher({ method: 'delete', url: `/tag`, data: body }),
}

const User = {
  get: (id: User.ID): PysharePromise<User.IInfo> => fetcher.get(`/user/${id}`),

  getList: (): PysharePromise<User.IInfo[]> => fetcher.get('/user'),

  getStats: (id: User.ID): PysharePromise<User.IStats> => fetcher.get(`/user/${id}/statistic`),
}

const Submission = {
  get: (id: Submission.ID): PysharePromise<Submission.IInfo> => fetcher.get(`/submission/${id}`),

  grade: (id: Submission.ID, state: Submission.State) =>
    fetcher.put(`/submission/${id}/state`, { state }),

  createTest: (body: Submission.ITestBody) => fetcher.post('/submission', body),
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
  ): PysharePromise<string[]> => fetcher.get(`/${resource}/${id}/permission`),
}

const Dataset = {
  getList: (): PysharePromise<Dataset.IInfo[]> => fetcher.get('/dataset'),
  get: (id: Dataset.ID): PysharePromise<Dataset.IInfo> => fetcher.get(`/dataset/${id}`),
}

const School = {
  getList: (): PysharePromise<School.Info[]> => fetcher.get('/school'),
  get: (abbr: Pick<School.Info, 'abbr'>): PysharePromise<School.Info> =>
    fetcher.get(`/school/${abbr}`),
  createSchool: (body: School.Info) => fetcher.post('/school', body),
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
