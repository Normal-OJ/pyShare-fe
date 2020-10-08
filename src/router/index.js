import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/views/Courses/Courses'),
  },
  {
    path: '/course/:id',
    component: () => import('@/views/Course/Course'),
    children: [
      {
        path: '',
        name: 'course',
        redirect: { name: 'courseProblems' },
      },
      {
        path: 'problems',
        name: 'courseProblems',
        component: () => import('@/views/Course/Problems'),
      },
      {
        path: 'members',
        name: 'courseMembers',
        component: () => import('@/views/Course/Members'),
      },
      {
        path: 'info',
        name: 'courseInfo',
        component: () => import('@/views/Course/Info'),
      },
    ],
  },
  {
    path: '/manages',
    name: 'manages',
  },
  {
    path: '/about',
    name: 'about',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
