import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.blue.lighten1,
    secondary: colors.green.lighten1,
    accent: colors.indigo.lighten1,
    error: colors.red.lighten1,
    highlight:colors.blue.accent4,
    fab: '#00E676',
  }
})
