import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Fragment from 'vue-fragment'
import Vue2Editor from 'vue2-editor'
import { dayjsPlugin } from './lib/dayjsPlugin'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { apiSetup } from './api/api'
import permission from './directive/permission'

Vue.config.productionTip = false

Vue.use(Fragment.Plugin)
Vue.use(Vue2Editor)
Vue.use(dayjsPlugin)
Vue.directive('permission', permission)

apiSetup()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
