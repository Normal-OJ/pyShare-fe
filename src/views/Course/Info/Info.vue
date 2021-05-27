<template>
  <Info :info="info" />
</template>

<script>
import Info from '@/components/Course/Info/Info'
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { Info },

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
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
