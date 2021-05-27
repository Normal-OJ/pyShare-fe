export const initialState: State = {
  isAuthenticated: false,
  id: null,
  username: null,
  displayName: null,
  role: null,
  courses: [],
  isShowLogoutModal: false,
}

export type State = {
  isAuthenticated: boolean
  id: User.ID | null
  username: string | null
  displayName: string | null
  role: User.Role | null
  courses: Course.ID[]
  isShowLogoutModal: boolean
}
