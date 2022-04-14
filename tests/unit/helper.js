import Vuetify from 'vuetify'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

export default function baseMountConfig(stores) {
  const ret = {}
  const localVue = createLocalVue()
  if (stores) {
    localVue.use(Vuex)
    ret['store'] = new Vuex.Store(stores)
  }
  ret['localVue'] = localVue
  ret['vuetify'] = new Vuetify()
  return ret
}
