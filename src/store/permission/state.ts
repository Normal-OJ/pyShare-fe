export const initialState: State = {
  permissions: {
    course: {},
    problem: {},
    comment: {},
  },
}

export type State = {
  permissions: {
    course: {
      [key: string]: string[]
    }
    problem: {
      [key: string]: string[]
    }
    comment: {
      [key: string]: string[]
    }
  }
}
