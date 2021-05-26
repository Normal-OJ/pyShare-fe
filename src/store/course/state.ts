export const initialState: State = {
  courses: [],
  courseStats: null,
  courseInfo: null,
  courseProblems: null,
  courseTags: [],
}

export type State = {
  courses: Course.ID[]
  courseStats: Course.IStudentStats[] | null
  courseInfo: Course.IInfo | null
  courseProblems: Problem.IInfo[] | null
  courseTags: Tag.name[]
}
