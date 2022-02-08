export const REQ_TYPE = {
  SOLVE_OJ_PROBLEM: 'Requirement.SolveOJProblem',
  LEAVE_COMMENT: 'Requirement.LeaveComment',
  REPLY_TO_COMMENT: 'Requirement.ReplyToComment',
  LIKE_OTHERS_COMMENT: 'Requirement.LikeOthersComment',
}

export const REQ_TYPE_ROUTE = {
  [REQ_TYPE.SOLVE_OJ_PROBLEM]: 'solve-oj-problem',
  [REQ_TYPE.LEAVE_COMMENT]: 'leave-comment',
  [REQ_TYPE.REPLY_TO_COMMENT]: 'reply-to-comment',
  [REQ_TYPE.LIKE_OTHERS_COMMENT]: 'like-others-comment',
}

export const INIT_REQUIREMENT = {
  type: REQ_TYPE.SOLVE_OJ_PROBLEM,
  problems: [],
  problem: null,
  requiredNumber: 1,
  acceptance: 0, // 0: AC, 2: PENDING
  sync: false,
}
