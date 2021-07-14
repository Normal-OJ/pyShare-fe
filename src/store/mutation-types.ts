export enum MutationTypes {
  // auth module
  SET_JWT = 'setJwt',
  SET_IS_SHOW_LOGOUT_MODAL = 'setIsShowLogoutModal',
  SET_IS_VISITOR = 'SET_IS_VISITOR',

  // course module
  SET_COURSES = 'setCourses',
  SET_COURSE_STATS = 'setCourseStats',
  SET_COURSE_INFO = 'setCourseInfo',
  SET_COURSE_TAGS = 'setCourseTags',

  // problem module
  SET_PROBLEMS = 'setProblems',

  // comment module
  SET_COMMENTS = 'setComments',

  // permission module
  SET_PERMISSIONS = 'setPermissions',
}
