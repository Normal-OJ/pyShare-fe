<template>
  <Problems
    :problems="problems"
    :tags="tags"
    :loading="isLoading"
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
    isLoading: true,
  }),

  created() {
    Promise.all([this.getProblems(this.paramsWithCourse), this.getTags(this.courseId)]).then(
      () => (this.isLoading = false),
    )
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
}
</script>
