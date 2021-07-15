<template>
  <ManageProblems
    :problems="problems"
    :templates="canWriteCourse ? templates : []"
    :tags="tags"
    :loading="isWaiting"
    @get-problems-by-tags="getProblemsByTags"
    @refetch-data="fetchData"
    @delete-problem="deleteProblem"
  />
</template>

<script>
import ManageProblems from '@/components/Course/Manages/ManageProblems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import agent from '@/api/agent'
import { canWriteCourseMixin } from '@/lib/permissionMixin'

export default {
  components: { ManageProblems },

  mixins: [canWriteCourseMixin],

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS_OF_MINE,
      templates: GetterTypes.TEMPLATES,
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
  }),

  async created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.isWaiting = true
      await Promise.all([this.getProblems(this.paramsWithCourse), this.getTags(this.courseId)])
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
