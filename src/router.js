import Vue from 'vue'
import Router from 'vue-router'
import Library from '@/views/Library'
import Account from '@/views/Account'
import Guide from '@/views/Guide'
import Login from '@/views/Login'
import Mrt from '@/views/Mrt'
import Optimize from '@/views/Optimize'
import Home from '@/views/Home'
import store from './store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
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
          name: 'home',
          component: Home,
          children: [
            {
              path: '',
              name: 'library',
              component: Library
            },
            {
              path: ':id/optimize',
              name: 'optimize',
              component: Optimize,
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
