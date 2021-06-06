export const initialState: State = {
  courses: [],
  courseStats: null,
  courseInfo: null,
  courseTags: [],
}

export type State = {
  courses: Course.IInfo[]
  courseStats: Course.IStudentStats[] | null
  courseInfo: Course.IInfo | null
  courseTags: Tag.name[]
}
