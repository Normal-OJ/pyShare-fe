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
import { CHALLENGES } from '@/store/getters.type'
import { GET_PROBLEMS } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { ManageChallenges },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: CHALLENGES,
    }),
    courseName() {
      return this.$route.params.name
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
      const paramsWithCourse = {
        course: this.courseName,
      }
      await this.getProblems(paramsWithCourse)
      this.isWaiting = false
    },
    ...mapActions({
      getProblems: GET_PROBLEMS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseName })
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
