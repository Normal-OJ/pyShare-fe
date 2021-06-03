declare namespace Course {
  type ID = string

  enum Status {
    Private = 0,
    Readonly = 1,
    Public = 2,
  }

  interface IInfo {
    description: string
    id: Course.ID
    name: string
    numOfComments: number
    numOfProblems: number
    semester: number
    status: Course.Status
    students: User.IInfo[]
    teacher: User.IInfo
    year: number
  }

  interface ICreateBody {
    description: string
    name: string
    semester: number
    status: Course.Status
    teacher: User.ID
    year: number
  }

  interface IPatchStudentsBody {
    users: User.ID[]
  }

  interface IPatchTagsBody {
    push: string[]
    pop: string[]
  }

  interface IStudentStats extends User.IStats {
    info: User.IInfo
  }
}
