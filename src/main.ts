import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Rollbar from 'rollbar'
import { dayjsPlugin } from './lib/dayjsPlugin'
import { utilsPlugin } from './lib/utils'
import agent from './api/agent'
// import VueSocketIO from 'vue-socket.io'
import Notifications from 'vue-notification'
import './sass/styles.scss'

Vue.use(VueCompositionAPI)

Vue.use(Notifications)

// *** disable socket connection temporarily, since client version is not compatible with server
// *** js client v2, flask v5, should use js client v3 or v4
// Vue.use(
//   new VueSocketIO({
//     connection: '/notifier',
//     vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_',
//     },
//   }),
// )

Vue.config.productionTip = false

Vue.use(dayjsPlugin)
Vue.use(utilsPlugin)

// setup axios
Vue.prototype.$agent = agent

// expose vuex for cypress
if (window.Cypress) {
  window.__store__ = store
}

// Rollbar for tracking vue app's error
Vue.prototype.$rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: import.meta.env.VITE_APP_ROLLBAR_ENABLED === 'false' ? false : true,
  nodeSourceMaps: true,
  environment: import.meta.env.MODE,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
      },
    },
  },
})

// setup global error handler to catch unexpected error
Vue.config.errorHandler = (err, vm) => {
  vm.$rollbar.error(err)
  throw err
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
