<template>
  <ManageProblems
    :problems="problems"
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
import { TAG_CATES } from '@/constants/tag'

export default {
  data: () => ({
    isWaiting: true,
  }),

  computed: {
    ...mapState({
      tags: (state) => state.course.courseTags,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS_OF_MINE,
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
    async fetchData() {
      this.isWaiting = true
      await Promise.all([
        this.getProblems(this.paramsWithCourse),
        this.getTags({ course: this.courseId, category: TAG_CATES.NORMAL_PROBLEM }),
      ])
      this.isWaiting = false
    },
    ...mapActions({
      getProblems: ActionTypes.GET_PROBLEMS,
      getTags: ActionTypes.GET_COURSE_TAGS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseId })
    },
    async deleteProblem(pid) {
      try {
        await this.$agent.Problem.delete(pid)
        this.fetchData()
        this.$alertSuccess('刪除題目成功。')
      } catch (error) {
        this.$alertFail('刪除題目失敗。')
        this.$rollbar.error('[views/ManageProblems/deleteProblem]', error)
      }
    },
  },
}
</script>
