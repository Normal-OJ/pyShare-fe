declare namespace _Comment {
  type ID = string

  enum Status {
    Hidden = 0,
    Show = 1,
  }

  interface ICreateBody {
    title: string
    content: string
    code: string
  }

  interface IInfo {
    author: User.IInfo
    content: string
    created: Date
    depth: number
    floor: number
    hasAccepted: boolean
    liked: User.IInfo[]
    replies: _Comment.ID[]
    status: _Comment.Status
    submission: Submission.IInfo
    submissions: Submission.ID[]
    title: string
    updated: Date
  }
}
