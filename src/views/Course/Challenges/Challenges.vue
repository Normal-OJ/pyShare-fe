<template>
  <Challenges
    :challenges="challenges"
    :tags="tags"
    :loading="isLoading"
    @get-problems-by-tags="getProblemsByTags"
  />
</template>

<script>
import Challenges from '@/components/Course/Challenges/Challenges'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { Challenges },
  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
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
