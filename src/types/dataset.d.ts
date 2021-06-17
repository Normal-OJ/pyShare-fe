declare namespace Dataset {
  type ID = string

  interface IInfo {
    id: string
    title: string
    description: string
    author: Pick<User.IInfo, 'username' | 'displayName' | 'id'>
    update: Date
    view: number
    download: number
  }
}
