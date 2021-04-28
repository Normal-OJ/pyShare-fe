<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row class="mb-4" no-gutters>
      <div class="text-h5">課程列表</div>
      <v-spacer />
      <CreateCourseModal v-role="[ROLE.ADMIN, ROLE.TEACHER]" @submit="submitCreateCourse" />
    </v-row>
    <CourseList :data="courses" :loading="isWaitingCourseList" />
  </v-container>
</template>

<script>
import CourseList from '@/components/Courses/CourseList'
import CreateCourseModal from '@/components/Courses/CreateCourseModal'
import agent from '@/api/agent'
import { ROLE } from '@/constants/auth'

export default {
  components: { CourseList, CreateCourseModal },

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
  },
}
</script>
