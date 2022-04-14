<template>
  <Problems
    :problems="isManageEnabled ? problemsOfMine : problems"
    :tags="tags"
    :loading="isLoading"
    :error="isError"
    :is-manage-enabled="isManageEnabled"
    :is-toggling="isToggling"
    @update:isManageEnabled="(newVal) => isManageEnabled = newVal"
    @get-problems-by-tags="getProblemsByTags"
    @refetch-problems="fetchData"
    @delete-problem="deleteProblem"
    @toggle-status="toggleStatus"
  />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import { TAG_CATES } from '@/constants/tag'

export default {
  // TODO: prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  name: 'ViewsProblems',

  data: () => ({
    isLoading: true,
    isError: false,
    isManageEnabled: false,
    isToggling: null,
  }),

  computed: {
    ...mapState({
      tags: (state) => state.course.courseTags,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS,
      problemsOfMine: GetterTypes.PROBLEMS_OF_MINE,
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
      this.isLoading = true
      Promise.all([
        this.getProblems(this.paramsWithCourse),
        this.getTags({ course: this.courseId, category: TAG_CATES.NORMAL_PROBLEM }),
      ])
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isLoading = false
        })
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
    async toggleStatus(pid, status) {
      this.isToggling = pid
      try {
        const body = { status }
        await this.$agent.Problem.changeVisibility(pid, body)
        this.fetchData()
        this.$alertSuccess('更新題目狀態成功。')
      } catch (error) {
        this.$alertFail('更新題目狀態失敗。')
      } finally {
        this.isToggling = null
      }
    },
  },
}
</script>
