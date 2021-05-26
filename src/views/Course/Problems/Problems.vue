<template>
  <Problems
    :problems="problems"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
  />
</template>

<script>
import Problems from '@/components/Course/Problems/Problems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'

export default {
  // TODO: prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  name: 'viewsProblems',

  components: { Problems },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS,
    }),
    courseId() {
      return this.$route.params.id
    },
    paramsWithCourse() {
      return { course: this.courseId }
    },
  },

  data: () => ({
    isWaiting: true,
  }),

  async created() {
    await Promise.all([this.getProblems(this.paramsWithCourse), this.getTags(this.courseId)])
    this.isWaiting = false
  },

  methods: {
    ...mapActions({
      getProblems: ActionTypes.GET_PROBLEMS,
      getTags: ActionTypes.GET_COURSE_TAGS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseId })
    },
  },

  // mounted() {
  //   this.$socket.emit('subscribe', {
  //     topic: 'PROBLEM',
  //     id: this.courseName,
  //   })
  // },

  // destroyed() {
  //   this.$socket.emit('unsubscribe', {
  //     topic: 'PROBLEM',
  //     id: this.courseName,
  //   })
  // },

  // sockets: {
  //   refetch: function() {
  //     this.getProblems(this.paramsWithCourse)
  //     this.$notify({
  //       group: 'notify',
  //       type: 'my-info',
  //       title: '主題列表更新',
  //       text: '有人新增、修改，或刪除了主題',
  //     })
  //   },
  // },
}
</script>
