import Vuetify from 'vuetify'
import { createLocalVue } from '@vue/test-utils'

export default function baseMountConfig() {
  return {
    localVue: createLocalVue(),
    vuetify: new Vuetify(),
  }
}
