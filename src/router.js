import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Mrt from '@/views/Mrt'
import store from './store'

// Strategies
import StrategyRouter from '@/views/strategy/Router'
import Strategy from '@/views/strategy/Strategy'

// Fitting
import Fit from '@/views/strategy/fitting/Fit'
import Sim from '@/views/strategy/fitting/Sim'

// SLTP
import Sltp from '@/views/strategy/sltp/Sltp'

// Account
import Account from '@/views/account/Account'

// Guide
import Guide from '@/views/guide/Guide'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    let position = { x: 0, y: 0 };
    if (savedPosition) {
      position = savedPosition
    }
    if(to.name === 'strategy') {
      position = { x: 0, y: to.meta.yPos }
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(position)
      }, 300)
    })
  },
  routes: [
    {
      path: '/',
      name: 'Mrt',
      component: Mrt,
      redirect: '/library',
      beforeEnter (to, from, next) {
        store.commit('user/initialize');
        if (!store.getters['user/isAuthenticated']) {
          next('/login')
        } 
        else {
          next()
        }
      },
      children: [
        {
          path: 'library',
          component: StrategyRouter,
          children: [
            {
              path: '',
              name: 'strategy',
              component: Strategy,
              meta: {
                yPos: 0
              }
            },
            {
              path: ':id/sltp',
              name: 'sltp',
              component: Sltp,
              props: true 
            },
            {
              path: ':id/fit',
              name: 'fit',
              component: Fit,
              props: true,
            },
            {
              path: ':id/fit/sim',
              name: 'sim',
              component: Sim,
              props: true 
            }
          ]
        },
        {
          path: 'account',
          name: 'account',
          component: Account
        },
        {
          path: 'guide',
          name: 'guide',
          component: Guide
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
