import Vue from 'vue'
import VueRouter from 'vue-router'
import problems from '@/views/problems'
import problem from '@/views/problem'
import tutorial from '@/views/tutorial'
import adminMain from '@/views/admin/main'
import adminProblem from '@/views/admin/problem'
import adminCourse from '@/views/admin/course'
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
    path: '/admin/main',
    component: adminMain,
  },
  {
    path: '/admin/problem',
    component: adminProblem,
  },
  {
    path: '/admin/course',
    component: adminCourse,
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
