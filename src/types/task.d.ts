declare namespace Task {
  type ID = number
  type ReqType = string // FIXME: should be enum string
  type ReqID = number

  interface ICreateBody {
    course: Course.ID
    title: string
    content: string
    startsAt: string
    endsAt: string
  }

  type RequirementCreateBody =
    | ICreateSolveOJProblem
    | ICreateLeaveComment
    | ICreateReplyToComment
    | ICreateLikeOthersComment

  interface ICreateSolveOJProblem {
    problems: Problem.ID[]
  }

  interface ICreateLeaveComment {
    problem: Problem.ID
    requiredNumber?: number
    acceptance?: number
  }

  interface ICreateReplyToComment {
    requiredNumber: number
  }

  interface ICreateLikeOthersComment {
    requiredNumber: number
  }

  type Requirement =
    | ISolveOJProblemInfo
    | ILeaveCommentInfo
    | IReplyToCommentInfo
    | ILikeOthersCommentInfo

  interface IInfo {
    id: Task.ID
    title: string
    content: string
    course: Course.ID
    startsAt: string
    endsAt: string
    requirements: Requirement[]
  }

  interface ISolveOJProblemInfo {
    problems: Problem.ID[]
    completedProblems: Problem.ID[]
  }

  interface ILeaveCommentInfo {
    problem: Problem.ID
    requiredNumber?: number
    acceptance?: number
    completedNumber: number
  }

  interface IReplyToCommentInfo {
    requiredNumber: number
    completedNumber: number
  }

  interface ILikeOthersCommentInfo {
    requiredNumber: number
    completedNumber: number
  }

  interface ITaskCompleteness {
    userInfo: User.IInfo
    progress: number[]
    completes: string | null
  }

  interface ITaskProgress {
    id: Task.ID
    title: string
    content: string
    completes: ITaskCompleteness[]
  }
}
