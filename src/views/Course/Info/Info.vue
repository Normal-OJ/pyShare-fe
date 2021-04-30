<template>
  <Info :info="info" />
</template>

<script>
import Info from '@/components/Course/Info/Info'
import { mapState } from 'vuex'

export default {
  components: { Info },

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
  },
}
</script>
