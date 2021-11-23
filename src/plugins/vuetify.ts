import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import zhHant from 'vuetify/src/locale/zh-Hant'
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { zhHant },
    current: 'zhHant',
  },
  theme: {
    themes: {
      light: {
        primary: colors.lightBlue.darken3, // #0277BD, LightBlue 800
        secondary: colors.pink.lighten2, // #F06292, Pink 300
        success: colors.teal, // #009688, Teal 500
        lightGreen: colors.teal.accent4, // #1DE9B6, Teal accent-3
        gray: colors.grey, // #9E9E9E, Grey 500
        error: colors.red.darken2, // #D32F2F, Red
      },
    },
    options: { customProperties: true },
  },
})
