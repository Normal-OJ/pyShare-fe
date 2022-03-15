<template>
  <Challenges
    :challenges="challenges"
    :tags="tags"
    :loading="isLoading"
    :error="isError"
    @get-problems-by-tags="getProblemsByTags"
    @refetch-problems="fetchData"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import { TAG_CATES } from '@/constants/tag'

export default {
  data: () => ({
    isLoading: true,
    isError: false,
  }),

  computed: {
    ...mapState({
      tags: (state) => state.course.courseTags,
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

  created() {
    this.fetchData()
  },

  methods: {
    ...mapActions({
      getProblems: ActionTypes.GET_PROBLEMS,
      getTags: ActionTypes.GET_COURSE_TAGS,
    }),
    fetchData() {
      this.isLoading = true
      Promise.all([
        this.getProblems(this.paramsWithCourse),
        this.getTags({ course: this.courseId, category: TAG_CATES.OJ_PROBLEM }),
      ])
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, ...this.paramsWithCourse })
    },
    async deleteProblem(pid) {
      try {
        await this.$agent.Problem.delete(pid)
        this.fetchData()
        this.$alertSuccess('刪除題目成功。')
      } catch (error) {
        this.$alertFail('刪除題目失敗。')
        this.$rollbar.error('[views/ManageChallenges/deleteProblem]', error)
      }
    },
  },
}
</script>
