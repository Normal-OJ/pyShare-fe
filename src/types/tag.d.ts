declare namespace Tag {
  type name = string

  interface IQueryOption {
    course: Course.ID
  }

  interface ICreateBody {
    tags: Tag.name[]
  }

  interface ICheckResponse {
    [key: string]: number
  }
}
