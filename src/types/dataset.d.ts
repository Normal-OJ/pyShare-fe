declare namespace Dataset {
  type ID = string

  interface IInfo {
    id: string
    filename: string
    description: string
    author: User.IInfo
    created: Date
    updated: Date
    size: number
    tags: string[]
    patchNote: string[]
  }
}
