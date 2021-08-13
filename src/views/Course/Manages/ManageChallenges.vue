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
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import { canWriteCourseMixin } from '@/lib/permissionMixin'

export default {
  components: { ManageChallenges },

  mixins: [canWriteCourseMixin],

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
      templates: GetterTypes.CHALLENGES_TEMPLATES,
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
