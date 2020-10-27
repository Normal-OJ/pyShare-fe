<template>
  <Info :info="info" />
</template>

<script>
import Info from '@/components/Course/Info/Info'
import { mapActions, mapState } from 'vuex'
import { GET_COURSE_INFO } from '@/store/actions.type'

export default {
  components: { Info },

  data: () => ({}),

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
  },

  created() {
    this.getCourseInfo(this.$route.params.name)
  },

  methods: {
    ...mapActions({
      getCourseInfo: GET_COURSE_INFO,
    }),
  },
}
</script>
