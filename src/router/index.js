import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
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
