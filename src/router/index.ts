import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import Home from '@/views/Home/Home.vue'
import store from '@/store'
import { ActionTypes } from '@/store/action-types'
import { getJwt } from '@/lib/jwt'
import { GetterTypes } from '@/store/getter-types'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: () => '首頁',
      isAllowGuest: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login.vue'),
    props: true,
    meta: {
      title: () => '登入',
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
    meta: { title: () => '課程列表' },
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
        meta: { title: () => `主題 - ${store.getters[GetterTypes.COURSE_NAME]}` },
      },
      {
        path: 'problem/:pid',
        name: 'courseProblem',
        component: () => import('@/views/Course/Problem/Problem.vue'),
        meta: {
          title: (route: Route) =>
            `主題 ${route.params.pid} - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
        beforeEnter: (to, from, next) => {
          store.dispatch(ActionTypes.GET_PROBLEMS, { course: to.params.id })
          next()
        },
      },
      {
        path: 'problems/:operation',
        name: 'courseSetProblems',
        meta: {
          title: (route: Route) =>
            `${route.params.operation === 'new' ? '新增' : '編輯'}主題 - ${
              store.getters[GetterTypes.COURSE_NAME]
            }`,
        },
        component: () => import('@/views/Course/Problems/SetProblems.vue'),
      },
      {
        path: 'challenges',
        name: 'courseChallenges',
        component: () => import('@/views/Course/Challenges/Challenges.vue'),
        meta: { title: () => `測驗 - ${store.getters[GetterTypes.COURSE_NAME]}` },
      },
      {
        path: 'challenge/:pid',
        name: 'courseChallenge',
        component: () => import('@/views/Course/Challenge/Challenge.vue'),
        meta: {
          title: (route: Route) =>
            `測驗 ${route.params.pid} - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'challenge/:pid/stats',
        name: 'courseChallengeStats',
        meta: {
          title: (route: Route) =>
            `測驗 ${route.params.pid} 統計  - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
        component: () => import('@/views/Course/Challenge/ChallengeStats.vue'),
      },
      {
        path: 'challenges/:operation',
        name: 'courseSetChallenges',
        meta: {
          title: (route: Route) =>
            `${route.params.operation === 'new' ? '新增' : '編輯'}測驗 - ${
              store.getters[GetterTypes.COURSE_NAME]
            }`,
        },
        component: () => import('@/views/Course/Challenges/SetChallenges.vue'),
      },
      {
        path: 'manages',
        name: 'courseManages',
        component: () => import('@/views/Course/Manages/Manages.vue'),
        meta: { title: () => `管理 - ${store.getters[GetterTypes.COURSE_NAME]}` },
      },
      {
        path: 'manages/tags',
        name: 'courseManageTags',
        component: () => import('@/views/Course/Manages/ManageTags.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `管理分類 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'manages/members',
        name: 'courseManageMembers',
        component: () => import('@/views/Course/Manages/ManageMembers.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `管理成員 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'manages/problems',
        name: 'courseManageProblems',
        component: () => import('@/views/Course/Manages/ManageProblems.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `管理主體 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'manages/challenges',
        name: 'courseManageChallenges',
        component: () => import('@/views/Course/Manages/ManageChallenges.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `管理測驗 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'manages/problems_stats',
        name: 'courseProblemsStats',
        component: () => import('@/views/Course/Manages/ProblemsStats.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `主題統計 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'manages/challenges_stats',
        name: 'courseChallengesStats',
        component: () => import('@/views/Course/Manages/ChallengesStats.vue'),
        meta: {
          detailedSideNav: true,
          title: () => `測驗統計 - ${store.getters[GetterTypes.COURSE_NAME]}`,
        },
      },
      {
        path: 'info',
        name: 'courseInfo',
        component: () => import('@/views/Course/Info/Info.vue'),
        meta: { title: () => `總覽 - ${store.getters[GetterTypes.COURSE_NAME]}` },
      },
    ],
    beforeEnter: (to, from, next) => {
      store
        .dispatch(ActionTypes.GET_COURSE_INFO, to.params.id)
        .then(() => {
          document.title = `${to.meta.title(to)} | pyShare`
        })
        .then(next)
    },
  },
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/Datasets/Datasets.vue'),
    meta: { title: () => '共享資料集' },
  },
  {
    path: '/dataset/:id',
    name: 'dataset',
    component: () => import('@/views/Datasets/Dataset.vue'),
    meta: { title: () => '共享資料集' },
  },
  {
    path: '/profile/:id',
    component: () => import('@/views/Profile/ProfileEntry.vue'),
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/Profile/Profile.vue'),
        meta: { title: () => '個人頁面' },
      },
      {
        path: 'stats',
        name: 'profileStats',
        component: () => import('@/views/Profile/Stats.vue'),
        meta: { title: () => '個人統計' },
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin/Admin.vue'),
    meta: { title: () => '管理員介面' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/About.vue'),
    meta: {
      isAllowGuest: true,
      title: () => '關於平台',
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title(to)} | pyShare`
  const jwt = getJwt()
  if (!to.meta.isAllowGuest && (!jwt || !jwt.isAuthenticated)) {
    next({ name: 'login', query: { redirectToPath: to.path } })
  } else {
    next()
  }
})

export default router