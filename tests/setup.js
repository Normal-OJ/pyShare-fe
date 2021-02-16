import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
// Nice tip from CEO of Vuetify
// https://github.com/vuetifyjs/vuetify/issues/3456
const el = document.createElement('div')
el.setAttribute('data-app', true)
document.body.appendChild(el)
