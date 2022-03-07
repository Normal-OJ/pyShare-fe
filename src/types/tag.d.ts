declare namespace Tag {
  type name = string
  type category = 0 | 1 | 2 | 3

  interface IQueryOption {
    course?: Course.ID
    category?: Tag.category
  }

  interface ICreateBody {
    tags: Tag.name[]
    category: Tag.category
  }

  interface ICheckResponse {
    [key: string]: number
  }
}
