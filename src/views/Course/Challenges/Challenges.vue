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
import { CHALLENGES } from '@/store/getters.type'
import { GET_PROBLEMS, GET_COURSE_TAGS } from '@/store/actions.type'

export default {
  components: { Challenges },
  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: CHALLENGES,
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
      getProblems: GET_PROBLEMS,
      getTags: GET_COURSE_TAGS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseId })
    },
  },
}
</script>
