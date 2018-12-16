import Vue from 'vue'
import Vuex from 'vuex'
import strategies from '@/stores/strategies'
import user from '@/stores/user'
import fit from '@/stores/fit'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    strategies,
    fit
  }
})
