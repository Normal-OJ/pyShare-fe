export const initialState: State = {
  problems: [],
  problemDatasets: [],
}

export type State = {
  problems: Problem.IInfo[]
  problemDatasets: {
    filename: string
    id: string
  }[]
}
