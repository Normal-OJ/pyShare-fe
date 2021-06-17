import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home.vue'
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
    component: () => import('@/views/Login/Login.vue'),
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
    component: () => import('@/views/Courses/Courses.vue'),
  },
  {
    path: '/course/:id',
    component: () => import('@/views/Course/Course.vue'),
    children: [
      {
        path: '',
        name: 'course',
        redirect: { name: 'courseProblems' },
      },
      {
        path: 'problems',
        name: 'courseProblems',
        component: () => import('@/views/Course/Problems/Problems.vue'),
      },
      {
        path: 'problem/:pid',
        name: 'courseProblem',
        component: () => import('@/views/Course/Problem/Problem.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch(ActionTypes.GET_PROBLEMS, { course: to.params.id })
          next()
        },
      },
      {
        path: 'problems/:operation',
        name: 'courseSetProblems',
        component: () => import('@/views/Course/Problems/SetProblems.vue'),
      },
      {
        path: 'challenges',
        name: 'courseChallenges',
        component: () => import('@/views/Course/Challenges/Challenges.vue'),
      },
      {
        path: 'challenge/:pid',
        name: 'courseChallenge',
        component: () => import('@/views/Course/Challenge/Challenge.vue'),
      },
      {
        path: 'challenge/:pid/stats',
        name: 'courseChallengeStats',
        component: () => import('@/views/Course/Challenge/ChallengeStats.vue'),
      },
      {
        path: 'challenges/:operation',
        name: 'courseSetChallenges',
        component: () => import('@/views/Course/Challenges/SetChallenges.vue'),
      },
      {
        path: 'manages',
        name: 'courseManages',
        component: () => import('@/views/Course/Manages/Manages.vue'),
      },
      {
        path: 'manages/tags',
        name: 'courseManageTags',
        component: () => import('@/views/Course/Manages/ManageTags.vue'),
      },
      {
        path: 'manages/members',
        name: 'courseManageMembers',
        component: () => import('@/views/Course/Manages/ManageMembers.vue'),
      },
      {
        path: 'manages/problems',
        name: 'courseManageProblems',
        component: () => import('@/views/Course/Manages/ManageProblems.vue'),
      },
      {
        path: 'manages/challenges',
        name: 'courseManageChallenges',
        component: () => import('@/views/Course/Manages/ManageChallenges.vue'),
      },
      {
        path: 'info',
        name: 'courseInfo',
        component: () => import('@/views/Course/Info/Info.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      store.dispatch(ActionTypes.GET_COURSE_INFO, to.params.id)
      next()
    },
  },
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/Datasets/Datasets.vue'),
  },
  {
    path: '/dataset/:id',
    name: 'dataset',
    component: () => import('@/views/Datasets/Dataset.vue'),
  },
  {
    path: '/profile/:id',
    component: () => import('@/views/Profile/ProfileEntry.vue'),
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/Profile/Profile.vue'),
      },
      {
        path: 'stats',
        name: 'profileStats',
        component: () => import('@/views/Profile/Stats.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin/Admin.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/About.vue'),
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
