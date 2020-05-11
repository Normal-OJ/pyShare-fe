import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueHighlightJS from 'vue-highlightjs'
 
Vue.use(VueAxios, axios)
axios.defaults.baseURL = '/api'

Vue.use(VueCookies)
Vue.config.productionTip = false

Vue.use(VueHighlightJS)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
