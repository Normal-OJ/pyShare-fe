import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import Fragment from 'vue-fragment'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { apiSetup } from './api/api'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(Fragment.Plugin)

apiSetup()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
