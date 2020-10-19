<template>
  <Courses :courses="courses" @submitCreateCourse="submitCreateCourse" />
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

  data: () => ({}),

  methods: {
    async submitCreateCourse(body) {
      try {
        const result = await agent.Course.create(body)
        console.log(result)
        this.getCourse()
        // TODO: give feedback for successfully create
      } catch (error) {
        // TODO: setError
      }
    },
    ...mapActions({
      getCourse: GET_COURSES,
    }),
  },
}
</script>
