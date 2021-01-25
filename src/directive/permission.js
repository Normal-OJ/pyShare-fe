// ref: https://github.com/PanJiaChen/vue-element-admin/tree/master/src/directive/permission
import store from '@/store'
import { ROLE, USERNAME, COURSE_INFO } from '@/store/getters.type'
import { ROLE as ROLES } from '@/constants/auth'
import router from '@/router/index'

const COURSE = 'COURSE'

function checkCoursePermission() {
  const courseInfo = store.getters && store.getters[COURSE_INFO]
  // if no course info or if course is PUBLIC
  if (!courseInfo || courseInfo.status === 2 || courseInfo.name !== router.currentRoute.params.name)
    return true
  const username = store.getters && store.getters[USERNAME]
  const isTeacher = courseInfo.teacher.username === username
  const isStudent = courseInfo.students.findIndex(s => s.username === username) !== -1
  return isTeacher || isStudent
}

function checkPermission(el, binding) {
  const { value } = binding
  const role = store.getters && store.getters[ROLE]

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      // ADMIN has all permission, but when MAGIC is found in array, it means take permission away from ADMIN
      const isAdmin = role === ROLES.ADMIN && !permissionRoles.includes('MAGIC')
      // Check if the permission includes my role level or not
      const hasRolePermission = permissionRoles.includes(role) || permissionRoles.includes('ALL')
      const hasCoursePermission = !permissionRoles.includes(COURSE) || checkCoursePermission()
      const isHideElement = !isAdmin && (!hasRolePermission || !hasCoursePermission)
      const isFabulous = permissionRoles.includes('OUT_OF_COURSE') && !checkCoursePermission()
      !isFabulous && isHideElement && el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin', 'teacher']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  },
}
