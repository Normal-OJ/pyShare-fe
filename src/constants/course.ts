export const YEARS = [108, 109, 110]
export const SEMESTERS = [1, 2, 3]
export const COURSE_STATE = {
  PRIVATE: 0,
  READONLY: 1,
  PUBLIC: 2,
}
export const COURSE_STATUS_LABEL = {
  0: '不公開課程',
  1: '公開課程',
  2: '開放課程',
}
export const STATUS_OPTIONS = [
  {
    status: 2,
    icon: 'mdi-earth',
    title: '開放課程',
    subtitle: '任何使用者都可以檢視，並擁有在課程內創作的權限',
  },
  {
    status: 1,
    icon: 'mdi-eye',
    title: '公開課程',
    subtitle: '任何使用者都可以檢視，但沒有新增主題、創作的權限',
  },
  {
    status: 0,
    icon: 'mdi-lock',
    title: '不公開課程',
    subtitle: '僅有被加入課程的學生才可造訪以及創作',
  },
]
