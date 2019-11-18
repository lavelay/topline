import Vue from 'vue'
import VueRouter from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/welcome'
}, {
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
}, {
  path: '/home',
  name: 'home',
  redirect: '/welcome',
  component: () => import('@/views/home'),
  children: [{
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/views/welcome')
  }, {
    path: '/article',
    name: 'article',
    component: () => import('@/views/article')
  }, {
    path: '/articleadd',
    name: 'articleadd',
    component: () => import('@/views/articleadd')
  }, {
    path: '/articleedit/:aid',
    name: 'articleedit',
    component: () => import('@/views/articleedit')
  }, {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account')
  }, {
    path: '/material',
    name: 'material',
    component: () => import('@/views/material')
  }, {
    path: '/comment',
    name: 'comment',
    component: () => import('@/views/comment')
  }, {
    path: '/fans',
    name: 'fans',
    component: () => import('@/views/fans')
  }]
}]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  var token = sessionStorage.getItem('userinfo')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
