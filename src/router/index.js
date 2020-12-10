import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home'
import store from '@/store'

Vue.use(VueRouter)
// TODO: block users that no permission from the specific route
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
        path: 'problems/:operation',
        name: 'courseSetProblems',
        component: () => import('@/views/Course/Problems/SetProblems'),
      },
      {
        path: 'problem/:id',
        name: 'courseProblem',
        component: () => import('@/views/Course/Problem/Problem'),
      },
      {
        path: 'manages',
        name: 'courseManages',
        component: () => import('@/views/Course/Manages/Manages'),
      },
      {
        path: 'manages/tags',
        name: 'courseManageTags',
        component: () => import('@/views/Course/Manages/ManageTags'),
      },
      {
        path: 'manages/problems',
        name: 'courseManageProblems',
        component: () => import('@/views/Course/Manages/ManageProblems'),
      },
      {
        path: 'info',
        name: 'courseInfo',
        component: () => import('@/views/Course/Info/Info'),
      },
    ],
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: () => import('@/views/Profile/Profile'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/About'),
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
