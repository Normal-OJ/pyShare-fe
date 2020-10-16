import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Fragment from 'vue-fragment'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(Fragment.Plugin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
