<template>
  <ManageChallenges
    :challenges="challenges"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
    @refetch-data="fetchData"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'

export default {
  data: () => ({
    isWaiting: true,
  }),

  computed: {
    ...mapState({
      tags: (state) => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
    }),
    paramsWithCourse() {
      return { course: this.$route.params.id }
    },
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.isWaiting = true
      await this.getProblems(this.paramsWithCourse)
      this.isWaiting = false
    },
    ...mapActions({
      getProblems: ActionTypes.GET_PROBLEMS,
    }),
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
