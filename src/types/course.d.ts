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

  interface IOJStats {
    overview: {
      [propName: string]: {
        acCount: number
        acUser: number
        tryCount: number
        tryUser: number
      }
    }
    users: {
      overview: {
        acCount: number
        tryCount: number
      }
      info: User.IInfo
      [propName: string]: {
        commentId: Comment.ID
        // PASS | FAIL | NOT TRY
        result: 0 | 1 | 2
        tryCount: number
      }
    }[]
  }
}
