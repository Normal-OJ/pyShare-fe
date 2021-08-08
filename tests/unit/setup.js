import Vue from 'vue'
import Vuetify from 'vuetify'
import { config } from '@vue/test-utils'

const fn = () => {}

// Set global mock up
config.mocks['$rollbar'] = {
  info: fn,
  error: fn,
}
config.mocks['$alertSuccess'] = fn

// Default to use Vuetify
Vue.use(Vuetify)
