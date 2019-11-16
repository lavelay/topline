import Vue from 'vue'
import VueRouter from 'vue-router'

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
  }]
}]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  var token = sessionStorage.getItem('userinfo')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
