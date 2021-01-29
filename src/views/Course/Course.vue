<template>
  <Course :breadcrumbs="breadcrumbs" :courseInfo="courseInfo" />
</template>

<script>
import Course from '@/components/Course/Course'
import { mapGetters } from 'vuex'
import { COURSE_INFO } from '@/store/getters.type.js'

export default {
  components: { Course },

  computed: {
    ...mapGetters({
      courseInfo: COURSE_INFO,
    }),
    courseName() {
      return this.$route.params.name
    },
    breadcrumbs() {
      return [
        {
          text: this.courseName,
          to: { name: 'course' },
        },
        {
          text: '主題列表',
          disabled: false,
          to: { name: 'courseProblems' },
        },
        {
          text: '增修主題',
          disabled: true,
        },
      ]
    },
  },
}
</script>
