// ref: https://github.com/PanJiaChen/vue-element-admin/tree/master/src/directive/permission
import store from '@/store'
import { ROLE } from '@/store/getters.type'
import { ROLE as ROLES } from '@/constants/auth'

function checkPermission(el, binding) {
  const { value } = binding
  const role = store.getters && store.getters[ROLE]

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      // ADMIN has all permission, or check if the permission includes my role level or not
      const hasPermission =
        (role === ROLES.ADMIN && !permissionRoles.includes('MAGIC')) ||
        permissionRoles.includes(role)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
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
