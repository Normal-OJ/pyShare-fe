declare namespace Problem {
  type ID = number

  enum Type {
    Normal = 'NormalProblem',
    OJ = 'OJProblem',
  }

  interface IQueryOption {
    offset?: number
    count?: number
    title?: string
    tags?: Tag.name[]
    course?: Course.ID
    is_template?: boolean
    allow_multiple_comments?: boolean
  }

  interface ICreateBody {
    title: string
    description: string
    tags: Tag.name[]
    hidden: boolean
    attachments: string[]
    defaultCode: string
    isTemplate: boolean
    allowMultipleComments: boolean
  }

  interface IInfo {
    allowMultipleComments: boolean
    attachments: string[]
    author: User.IInfo
    comments: _Comment.ID[]
    course: Course.ID
    defaultCode: string
    description: string
    extra: {
      _cls: Problem.Type
      input?: string
      output?: string
    }
    isTemplate: boolean
    pid: Problem.ID
    hidden: boolean
    tags: Tag.name[]
    timestamp: Date
    title: string
  }
}
