<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row>
      <div class="text-h5">課程列表</div>
      <v-spacer />
      <CreateCourseModal v-role="[ROLE.ADMIN, ROLE.TEACHER]" @submit="submitCreateCourse" />
    </v-row>

    <div class="text-h6 mt-8">已加入的課程</div>
    <CourseList :data="joinedCourses" :loading="isWaitingCourseList" permissionHeader="角色" />

    <div class="text-h6 mt-8">其他公開的課程</div>
    <CourseList :data="notJoinedCourses" :loading="isWaitingCourseList" permissionHeader="權限" />
  </v-container>
</template>

<script>
import CourseList from '@/components/Courses/CourseList'
import CreateCourseModal from '@/components/Courses/CreateCourseModal'
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import agent from '@/api/agent'
import { ROLE } from '@/constants/auth'
import { COURSE_STATE } from '@/constants/course'

export default {
  components: { CourseList, CreateCourseModal },

  computed: {
    ...mapState({
      courses: state => state.course.courses,
      userId: state => state.auth.id,
      myCourses: state => state.auth.courses,
    }),
    joinedCourses() {
      const isInMyCourses = course => this.myCourses.indexOf(course.id) !== -1
      const courses = this.courses.filter(isInMyCourses).map(course => ({
        ...course,
        permission: this.userID === course.teacher.id ? 'teacher' : 'student',
      }))
      return courses
    },
    notJoinedCourses() {
      const isNotInMyCourses = course => this.myCourses.indexOf(course.id) === -1
      const courses = this.courses.filter(isNotInMyCourses).map(course => ({
        ...course,
        permission: course.status === COURSE_STATE.READONLY ? 'read' : 'participate',
      }))
      return courses
    },
  },

  data: () => ({
    isWaitingCourseList: true,
    courses: [],
    ROLE,
  }),

  mounted() {
    agent.Course.getList()
      .then(resp => (this.courses = resp.data.data))
      .finally(() => (this.isWaitingCourseList = false))
  },

  methods: {
    async submitCreateCourse(body, resolve, reject) {
      try {
        await agent.Course.create(body)
        resolve()
        this.getCourse()
      } catch (error) {
        console.log('[views/Courses/submitCreateCourse] error', error)
        reject(error)
        throw error
      }
    },
    ...mapActions({
      getCourse: ActionTypes.GET_COURSES,
    }),
  },
}
</script>
