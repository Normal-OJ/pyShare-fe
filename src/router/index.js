import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      isAllowGuest: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login'),
    meta: {
      isAllowGuest: true,
    },
    beforeEnter: (to, from, next) => {
      const { isAuthenticated, username } = store.state.auth
      if (isAuthenticated) {
        next({ name: 'profile', params: { username } })
      }
      next()
    },
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/views/Courses/Courses'),
  },
  {
    path: '/course/:name',
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
        component: () => import('@/views/Course/Problems/Problems'),
      },
      {
        path: 'problem/:id',
        name: 'courseProblem',
        component: () => import('@/views/Course/Problem/Problem'),
      },
      {
        path: 'members',
        name: 'courseMembers',
        component: () => import('@/views/Course/Members/Members'),
      },
      {
        path: 'info',
        name: 'courseInfo',
        component: () => import('@/views/Course/Info/Info'),
      },
    ],
  },
  {
    path: '/manages',
    name: 'manages',
    children: [
      {
        path: '/problem/new',
        name: 'problemSettings',
        component: () => import('@/views/Manages/Problem/ProblemSettings'),
      },
    ],
  },
  {
    path: '/profile/:username',
    name: 'profile',
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      isAllowGuest: true,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (!to.meta.isAllowGuest && !store.state.auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.path } })
  }
  next()
})

export default router
