import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Fragment from 'vue-fragment'
import Vue2Editor from 'vue2-editor'
import { dayjsPlugin } from './lib/dayjsPlugin'
import { utilsPlugin } from './lib/utils'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { apiSetup } from './api/api'
import permission from './directive/permission'

var Rollbar = require('vue-rollbar')

Vue.config.productionTip = false

Vue.use(Fragment.Plugin)
Vue.use(Vue2Editor)
Vue.use(dayjsPlugin)
Vue.use(utilsPlugin)
Vue.use(Rollbar, {
  accessToken: process.env.VUE_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: process.env.VUE_APP_ROLLBAR_ENABLED === 'false' ? false : true,
  source_map_enabled: true,
  environment: process.env.NODE_ENV,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
      },
    },
  },
})
Vue.directive('permission', permission)

apiSetup()

Vue.config.errorHandler = err => {
  Vue.rollbar.error(err)
  throw err
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
