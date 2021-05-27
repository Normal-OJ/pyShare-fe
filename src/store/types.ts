import { State as AuthState } from './auth/state'
import { State as Comment } from './comment/state'
import { State as CourseState } from './course/state'
import { State as PermissionState } from './permission/state'
import { State as ProblemState } from './problem/state'

export interface RootState {
  auth: AuthState
  comment: Comment
  course: CourseState
  permission: PermissionState
  problem: ProblemState
}
