<template>
  <Courses
    :courses="courses"
    :isWaitingCourseList="isWaitingCourseList"
    @submitCreateCourse="submitCreateCourse"
  />
</template>

<script>
import Courses from '@/components/Courses/Courses'
import { mapActions, mapState } from 'vuex'
import { GET_COURSES } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { Courses },

  computed: {
    ...mapState({
      courses: state => state.course.courses,
    }),
  },

  data: () => ({
    isWaitingCourseList: false,
  }),

  created() {
    this.getCourseList()
  },

  methods: {
    async getCourseList() {
      this.isWaitingCourseList = true
      await this.getCourse()
      this.isWaitingCourseList = false
    },
    async submitCreateCourse(body) {
      try {
        await agent.Course.create(body)
        this.getCourse()
      } catch (error) {
        console.log('[views/Courses/submitCreateCourse] error', error)
        // TODO: setError
      }
    },
    ...mapActions({
      getCourse: GET_COURSES,
    }),
  },
}
</script>
