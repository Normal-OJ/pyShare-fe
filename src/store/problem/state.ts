export const initialState: State = {
  problems: [],
  problemInfo: null,
}

export type State = {
  problems: Problem.IInfo[]
  problemInfo: Problem.IInfo | null
}
