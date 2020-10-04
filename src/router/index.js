import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'lome',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/Login'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
