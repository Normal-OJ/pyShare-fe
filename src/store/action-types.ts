export enum ActionTypes {
  // auth module
  LOGIN = 'login',
  LOGOUT = 'logout',
  GET_JWT = 'getJwt',

  // problem module
  GET_PROBLEMS = 'getProblems',

  // course module
  GET_COURSES = 'getCourses',
  GET_COURSE_STATS = 'getCourseStats',
  GET_COURSE_INFO = 'getCourseInfo',
  GET_COURSE_TAGS = 'getCourseTags',

  // comment module
  GET_COMMENTS = 'getComments',
  GET_COMMENT = 'getComment',

  // permission module
  GET_PERMISSIONS = 'getPermissions',
}
