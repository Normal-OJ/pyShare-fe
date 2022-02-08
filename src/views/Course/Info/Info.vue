<template>
  <Info :info="info" />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  computed: {
    ...mapState({
      info: (state) => state.course.courseInfo,
    }),
  },

  created() {
    this.getCourseInfo(this.$route.params.id)
  },

  methods: {
    ...mapActions({
      getCourseInfo: ActionTypes.GET_COURSE_INFO,
    }),
  },
}
</script>
