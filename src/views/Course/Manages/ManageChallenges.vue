<template>
  <ManageChallenges
    :challenges="challenges"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import ManageChallenges from '@/components/Course/Manages/ManageChallenges'
import { mapActions, mapGetters, mapState } from 'vuex'
import agent from '@/api/agent'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { ManageChallenges },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
    }),
    paramsWithCourse() {
      return { course: this.$route.params.id }
    },
  },

  data: () => ({
    isWaiting: true,
  }),

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
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
        await agent.Problem.delete(pid)
        this.fetchData()
        this.$alertSuccess('刪除題目成功。')
      } catch (error) {
        console.log('[view/Course/Manages/ManageChallenges] error', error)
        this.$alertFail('刪除題目失敗。')
        throw error
      }
    },
  },
}
</script>
