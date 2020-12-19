<template>
  <Problems
    :problems="problems"
    :tags="tags"
    :loading="isWaiting"
    @getProblemsByTags="getProblemsByTags"
  />
</template>

<script>
import Problems from '@/components/Course/Problems/Problems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { PROBLEMS } from '@/store/getters.type'
import { GET_PROBLEMS, GET_COURSE_TAGS } from '@/store/actions.type'

export default {
  // TODO: prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  name: 'ProblemsController',

  components: { Problems },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: PROBLEMS,
    }),
    courseName() {
      return this.$route.params.name
    },
  },

  data: () => ({
    isWaiting: true,
  }),

  async created() {
    const paramsWithCourse = {
      course: this.courseName,
    }
    await Promise.all([this.getProblems(paramsWithCourse), this.getTags(paramsWithCourse)])
    this.isWaiting = false
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
      getTags: GET_COURSE_TAGS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseName })
    },
  },

  mounted() {
    this.$socket.emit('subscribe', {
      topic: 'PROBLEM',
      id: this.courseName,
    })
  },

  sockets: {
    connect: function() {
      console.log('socket connected')
      // this.$socket.emit('subscribe', {
      //   topic: 'PROBLEM',
      //   id: this.courseName,
      // })
    },
    refetch: function(data) {
      console.log('on refetch:', data)
    },
  },
}
</script>
