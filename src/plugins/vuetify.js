import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#4B8BBE',
        info: '#8098F7',
        warning: '#FFD43B',
        danger: '#FF7D4F',
      }
    }
  }
}

export default new Vuetify(opts)