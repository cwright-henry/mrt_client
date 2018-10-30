import Vue from 'vue'
import Vuex from 'vuex'
import library from '@/stores/library'
import user from '@/stores/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    library
  }
})
