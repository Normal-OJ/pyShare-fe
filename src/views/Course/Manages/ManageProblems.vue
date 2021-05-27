<template>
  <ManageProblems
    :problems="problems"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import ManageProblems from '@/components/Course/Manages/ManageProblems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import agent from '@/api/agent'

export default {
  components: { ManageProblems },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS_OF_MINE,
    }),
    courseId() {
      return this.$route.params.id
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
        course: this.courseId,
      }
      await this.getProblems(paramsWithCourse)
      this.isWaiting = false
    },
    ...mapActions({
      getProblems: ActionTypes.GET_PROBLEMS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseId })
    },
    async deleteProblem(pid) {
      try {
        await agent.Problem.delete(pid)
        this.fetchData()
        this.$alertSuccess('刪除題目成功。')
      } catch (error) {
        console.log('[view/Course/Manages/ManageProblems] error', error)
        this.$alertFail('刪除題目失敗。')
        throw error
      }
    },
  },
}
</script>
