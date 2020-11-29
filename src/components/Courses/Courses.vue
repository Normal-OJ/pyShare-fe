<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row class="mb-4">
      <div class="text-h5">課程列表</div>
      <!-- <div class="text-h5">我的課程</div> -->

      <v-spacer />

      <CreateCourseModal v-permission="[TEACHER]" @submit="submitCreateCourse" />
    </v-row>

    <CourseList :data="courses" :loading="isWaitingCourseList" />

    <!-- <v-row class="mt-15">
      <div class="text-h5">其他公開課程</div>
    </v-row>

    <CourseList :data="courses" /> -->
  </v-container>
</template>

<script>
import CourseList from '@/components/Courses/CourseList'
import CreateCourseModal from '@/components/Courses/CreateCourseModal'
import { ROLE } from '@/constants/auth'

const { TEACHER } = ROLE

export default {
  name: 'Courses',

  props: {
    courses: {
      type: Array,
      required: true,
    },
    isWaitingCourseList: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    TEACHER,
  }),

  components: { CourseList, CreateCourseModal },

  methods: {
    submitCreateCourse(body) {
      this.$emit('submitCreateCourse', body)
    },
  },
}
</script>

<style></style>
