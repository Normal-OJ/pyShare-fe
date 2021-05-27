export const initialState: State = {
  courses: [],
  courseStats: null,
  courseInfo: null,
  courseTags: [],
}

export type State = {
  courses: Course.ID[]
  courseStats: Course.IStudentStats[] | null
  courseInfo: Course.IInfo | null
  courseTags: Tag.name[]
}
