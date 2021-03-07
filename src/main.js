import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Vue2Editor from 'vue2-editor'
import { dayjsPlugin } from './lib/dayjsPlugin'
import { utilsPlugin } from './lib/utils'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { apiSetup } from './api/api'
import permission from './directive/permission'
import VueSocketIO from 'vue-socket.io'
import Notifications from 'vue-notification'
import { makeServer } from './server'

if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MIRAGE_ENABLED === 'true') {
  makeServer({ environment: 'development' })
}

Vue.use(Notifications)

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: '/notifier',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  }),
)

Vue.config.productionTip = false

Vue.use(Vue2Editor)
Vue.use(dayjsPlugin)
Vue.use(utilsPlugin)

// Rollbar for tracking vue app's error
var Rollbar = require('vue-rollbar')
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

// use permission directive for handling ui display
Vue.directive('permission', permission)

// setup axios
apiSetup()

// expose vuex for cypress
if (window.Cypress) {
  window.__store__ = store
}

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
