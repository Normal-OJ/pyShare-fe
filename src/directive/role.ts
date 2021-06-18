// ref: https://github.com/PanJiaChen/vue-element-admin/tree/master/src/directive/permission
import { DirectiveOptions } from 'vue'
import store from '@/store'
import { GetterTypes } from '@/store/getter-types'
import { DirectiveBinding } from 'vue/types/options'

function checkRole(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding
  const role = store.getters && store.getters[GetterTypes.ROLE]

  if (value && value instanceof Array) {
    if (value.length > 0 && role !== null) {
      const permissionRoles = value
      // Check if the permission includes my role level or not
      const hasRolePermission = permissionRoles.includes(role)
      const isHideElement = !hasRolePermission
      isHideElement && el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-role="[0, 1]"`)
  }
}

const directive: DirectiveOptions = {
  inserted(el, binding) {
    checkRole(el, binding)
  },
  update(el, binding) {
    checkRole(el, binding)
  },
}

export default directive
