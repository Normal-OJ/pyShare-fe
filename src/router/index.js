import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home'
import store from '@/store'
import { GET_COURSE_INFO } from '@/store/actions.type'

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
      store.dispatch(GET_COURSE_INFO, to.params.name)
      next()
    },
  },
  {
    path: '/profile/:username',
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
  if (!to.meta.isAllowGuest && !store.state.auth.isAuthenticated) {
    next({ name: 'login', query: { redirectToPath: to.path } })
  } else {
    next()
  }
})

export default router
