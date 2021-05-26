declare namespace User {
  type ID = string

  enum Role {
    Admin = 0,
    Teacher = 1,
    Student = 2,
  }

  interface IInfo {
    displayName: string
    email: string
    id: UserId
    md5: string
    role: User.Role
    school: string
    username: string
  }

  type CommonStats = {
    course: Pick<User, 'id' | 'name'>
    floor: number
    pid: Problem.ID
  }
  type CommentStats = CommonStats & {
    accepted: boolean
  }
  type ExecInfoStats = CommonStats & {
    fail: number
    success: number
  }
  type LikedStats = CommonStats & {
    starers: User.IInfo[]
  }
  type LikesStats = CommonStats & {
    staree: User.IInfo
  }
  type ReplyStats = CommonStats

  interface IStats {
    comments: CommentStats[]
    execInfo: ExecInfoStats[]
    liked: LikedStats[]
    likes: LikesStats[]
    problems: Pick<CommonStats, 'course' | 'pid'>[]
    replies: ReplyStats[]
  }
}
