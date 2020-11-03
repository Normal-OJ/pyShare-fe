<template>
  <Course :breadcrumbs="breadcrumbs" />
</template>

<script>
import Course from '@/components/Course/Course'

export default {
  components: { Course },

  computed: {
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
