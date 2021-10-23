<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row>
      <div class="text-h5">課程列表</div>
      <v-spacer />
      <CreateCourseModal v-if="canCreateCourse" @submit="submitCreateCourse" />
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
import { mapActions, mapGetters, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { ROLE } from '@/constants/auth'
import { COURSE_STATE } from '@/constants/course'
import { GetterTypes } from '@/store/getter-types'

export default {
  components: { CourseList, CreateCourseModal },

  computed: {
    ...mapState({
      role: state => state.auth.role,
    }),
    ...mapGetters({
      teachingCourses: GetterTypes.TEACHING_COURSES,
      enrolledCourses: GetterTypes.ENROLLED_COURSES,
      otherCourses: GetterTypes.OTHER_COURSES,
    }),
    canCreateCourse() {
      return [ROLE.TEACHER, ROLE.ADMIN].includes(this.role)
    },
    joinedCourses() {
      return [
        ...this.teachingCourses.map(course => ({
          ...course,
          permission: 'teacher',
        })),
        ...this.enrolledCourses.map(course => ({
          ...course,
          permission: 'student',
        })),
      ]
    },
    notJoinedCourses() {
      return this.otherCourses.map(course => ({
        ...course,
        permission: course.status === COURSE_STATE.READONLY ? 'read' : 'participate',
      }))
    },
  },

  data: () => ({
    isWaitingCourseList: true,
  }),

  created() {
    this.getCourseList()
  },

  methods: {
    getCourseList() {
      this.isWaitingCourseList = true
      this.getCourse().then(() => (this.isWaitingCourseList = false))
    },
    async submitCreateCourse(body, resolve, reject) {
      try {
        const { data } = await this.$agent.Course.create(body)
        // since the course of user is stored in jwt, we have to refresh jwt
        await this.getJwt()
        resolve(data.data.id)
      } catch (error) {
        console.log('[views/Courses/submitCreateCourse] error', error)
        reject(error)
        throw error
      }
    },
    ...mapActions({
      getCourse: ActionTypes.GET_COURSES,
      getJwt: ActionTypes.GET_JWT,
    }),
  },
}
</script>
