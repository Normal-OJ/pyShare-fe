export const YEARS = [108, 109, 110, 111]
export const SEMESTERS = [1, 2, 3]
export const COURSE_STATE = {
  PRIVATE: 0,
  READONLY: 1,
  PUBLIC: 2,
}
export const COURSE_STATUS_LABEL = {
  0: '不公開課程',
  1: '半公開課程',
  2: '公開課程',
}
export const STATUS_OPTIONS = [
  {
    status: 2,
    icon: 'mdi-earth',
    title: COURSE_STATUS_LABEL[2],
    subtitle: '任何使用者都可以檢視，並擁有在課程內新增主題、創作的權限。',
  },
  {
    status: 1,
    icon: 'mdi-eye',
    title: COURSE_STATUS_LABEL[1],
    subtitle: '任何使用者都可以檢視，但沒有新增主題、創作的權限。',
  },
  {
    status: 0,
    icon: 'mdi-lock',
    title: COURSE_STATUS_LABEL[0],
    subtitle: '僅有被加入課程的學生才可檢視以及創作。',
  },
]
