<template>
  <ManageProblems
    :problems="problems"
    :tags="tags"
    :loading="isWaiting"
    @getProblemsByTags="getProblemsByTags"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import ManageProblems from '@/components/Course/Manages/ManageProblems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { PROBLEMS_OF_MINE } from '@/store/getters.type'
import { GET_PROBLEMS, GET_COURSE_TAGS } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { ManageProblems },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: PROBLEMS_OF_MINE,
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
      await Promise.all([this.getProblems(paramsWithCourse), this.getTags(paramsWithCourse)])
      this.isWaiting = false
    },
    ...mapActions({
      getProblems: GET_PROBLEMS,
      getTags: GET_COURSE_TAGS,
    }),
    getProblemsByTags(paramsWithTags) {
      this.getProblems({ ...paramsWithTags, course: this.courseName })
    },
    async deleteProblem(pid) {
      try {
        await agent.Problem.delete(pid)
        this.fetchData()
        alert('刪除題目成功。')
      } catch (error) {
        console.log('[view/Course/Manages/ManageProblems] error', error)
        alert('刪除題目失敗。')
        throw error
      }
    },
  },
}
</script>
