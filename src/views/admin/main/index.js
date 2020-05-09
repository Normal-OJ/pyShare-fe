import Vue from 'vue';
import html from './index.pug';
import { getProfile } from '@/util.js'
// import Vuex file ...

export default Vue.extend({
  template: html,
  
  data () {
    return {
      profile: getProfile(),
    }
  },

  ready () {
  },

  methods: {
  },
});