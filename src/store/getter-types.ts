export enum GetterTypes {
  // auth module
  ROLE = 'role',
  USERNAME = 'username',
  USER_INFO = 'userInfo',

  // course module
  TEACHING_COURSES = 'teachingCourses', // all courses whose teacher is me
  ENROLLED_COURSES = 'enrolledCourses', // all courses that i'm enrolled (as student)
  OTHER_COURSES = 'otherCourses', // all courses that i'm not in but visible.

  // problem module
  GET_PROBLEM_BY_ID = 'getProblemById',
  PROBLEMS = 'problems', // get problems that are not template
  TEMPLATES = 'templates',
  PROBLEMS_OF_MINE = 'problemsOfMine',

  // comment module
  COMMENTS = 'comments', // get comments that are visible (not deleted)

  // permission module
  PERMISSIONS = 'permissions',
}
