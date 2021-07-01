<template>
  <ManageChallenges
    :challenges="challenges"
    :templates="canWriteCourse ? templates : []"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
    @refetch-data="fetchData"
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
      templates: GetterTypes.CHALLENGES_TEMPLATES,
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
    canWriteCourse: null,
  }),

  async created() {
    this.fetchData()
    this.canWriteCourse = await this.$hasPermission('course', this.courseId, ['w'])
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
