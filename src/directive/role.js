// ref: https://github.com/PanJiaChen/vue-element-admin/tree/master/src/directive/permission
import store from '@/store'
import { ROLE } from '@/store/getters.type'

function checkRole(el, binding) {
  const { value } = binding
  const role = store.getters && store.getters[ROLE]

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      // Check if the permission includes my role level or not
      const hasRolePermission = permissionRoles.includes(role)
      const isHideElement = !hasRolePermission
      isHideElement && el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-role="['admin', 'teacher']"`)
  }
}

export default {
  inserted(el, binding) {
    checkRole(el, binding)
  },
  update(el, binding) {
    checkRole(el, binding)
  },
}
