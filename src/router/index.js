import Vue from 'vue'
import VueRouter from 'vue-router'
import problems from '@/views/problems'
import problem from '@/views/problem'
import adminMain from '@/views/admin/main'
import adminProblem from '@/views/admin/problem'
import adminCourse from '@/views/admin/course'
import adminTag from '@/views/admin/tag'
import adminEdit from '@/views/admin/problem/edit'
import profile from '@/views/profile'
import statistic from '@/views/statistic'

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
    path: '/admin/main',
    component: adminMain,
  },
  {
    path: '/admin/problems',
    component: adminProblem,
  },
  {
    path: '/admin/problem/:id',
    component: adminEdit,
  },
  {
    path: '/admin/courses',
    component: adminCourse,
  },
  {
    path: '/admin/tags',
    component: adminTag,
  },
  {
    path: '/profile',
    component: profile,
  },
  {
    path: '/stat/:name',
    component: statistic,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
