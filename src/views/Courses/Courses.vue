<template>
  <Courses :courses="courses" @submitCreateCourse="submitCreateCourse" />
</template>

<script>
import Courses from '@/components/Courses/Courses'
import { mapState } from 'vuex'
import store from '@/store'
import { GET_COURSES } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { Courses },

  beforeRouteEnter(to, from, next) {
    store.dispatch(GET_COURSES).then(() => {
      next()
    })
  },

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
        // TODO: give feedback for successfully create
      } catch (error) {
        // TODO: setError
      }
    },
  },
}
</script>
