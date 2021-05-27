import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home'
import store from '@/store'
import { ActionTypes } from '@/store/action-types'
import { getJwt } from '@/lib/jwt'

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
    props: true,
    meta: {
      isAllowGuest: true,
    },
    beforeEnter: (to, from, next) => {
      const jwt = getJwt()
      if (jwt && jwt.isAuthenticated && jwt.id) {
        next({ name: 'profile', params: { id: jwt.id } })
      } else {
        next()
      }
    },
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
        component: () => import('@/views/Course/Problems/Problems'),
      },
      {
        path: 'problem/:pid',
        name: 'courseProblem',
        component: () => import('@/views/Course/Problem/Problem'),
        beforeEnter: (to, from, next) => {
          store.dispatch(ActionTypes.GET_PROBLEMS, { course: to.params.id })
          next()
        },
      },
      {
        path: 'problems/:operation',
        name: 'courseSetProblems',
        component: () => import('@/views/Course/Problems/SetProblems'),
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
        path: 'manages/members',
        name: 'courseManageMembers',
        component: () => import('@/views/Course/Manages/ManageMembers'),
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
    beforeEnter: (to, from, next) => {
      store.dispatch(ActionTypes.GET_COURSE_INFO, to.params.id)
      next()
    },
  },
  {
    path: '/profile/:id',
    component: () => import('@/views/Profile/ProfileEntry'),
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/Profile/Profile'),
      },
      {
        path: 'stats',
        name: 'profileStats',
        component: () => import('@/views/Profile/Stats'),
      },
    ],
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
  const jwt = getJwt()
  if (!to.meta.isAllowGuest && (!jwt || !jwt.isAuthenticated)) {
    next({ name: 'login', query: { redirectToPath: to.path } })
  } else {
    next()
  }
})

export default router
