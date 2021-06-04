export enum GetterTypes {
  // auth module
  ROLE = 'role',
  USERNAME = 'username',
  USER_INFO = 'userInfo',

  // problem module
  GET_PROBLEM_BY_ID = 'getProblemById',
  PROBLEMS = 'problems', // get problems that are not template
  TEMPLATES = 'templates',
  CHALLENGES = 'challenges',
  PROBLEMS_OF_MINE = 'problemsOfMine',

  // comment module
  COMMENTS = 'comments', // get comments that are visible (not deleted)
  COMMENT_OF_MINE = 'commentOfMine',

  // permission module
  PERMISSIONS = 'permissions',
}
