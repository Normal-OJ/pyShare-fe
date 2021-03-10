<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row class="mb-4">
      <div class="text-h5">課程列表</div>
      <v-spacer />
      <CreateCourseModal v-role="[TEACHER]" @submit="submitCreateCourse" />
    </v-row>
    <CourseList :data="courses" :loading="isWaitingCourseList" />
  </v-container>
</template>

<script>
import CourseList from '@/components/Courses/CourseList'
import CreateCourseModal from '@/components/Courses/CreateCourseModal'
import { mapActions, mapState } from 'vuex'
import { GET_COURSES } from '@/store/actions.type'
import agent from '@/api/agent'
import { ROLE } from '@/constants/auth'

const { TEACHER } = ROLE

export default {
  components: { CourseList, CreateCourseModal },

  computed: {
    ...mapState({
      courses: state => state.course.courses,
    }),
  },

  data: () => ({
    isWaitingCourseList: false,
    TEACHER,
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
      getCourse: GET_COURSES,
    }),
  },
}
</script>
