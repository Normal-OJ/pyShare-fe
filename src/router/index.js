import Vue from 'vue'
import VueRouter from 'vue-router'
import problems from '@/views/problems'
import problem from '@/views/problem'
import tutorial from '@/views/tutorial'
import admin from '@/views/admin'
import profile from '@/views/profile'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/problems',
  },
  {
    path: '/problems',
    component: problems,
  },
  {
    path: '/problem/:id',
    component: problem,
  },
  {
    path: '/tutorial',
    component: tutorial,
  },
  {
    path: '/admin',
    component: admin,
  },
  {
    path: '/profile',
    component: profile,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
