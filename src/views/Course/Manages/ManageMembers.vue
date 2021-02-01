<template>
  <ManageMembers
    :stats="stats ? stats : []"
    :loading="!stats"
    @submitAddMultipleStudents="submitAddMultipleStudents"
    @submitAddStudent="submitAddStudent"
  />
</template>

<script>
import ManageMembers from '@/components/Course/Manages/ManageMembers'
import { mapActions, mapState } from 'vuex'
import { GET_COURSE_STATS } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { ManageMembers },

  computed: {
    ...mapState({
      stats: state => state.course.courseStats,
    }),
    courseName() {
      return this.$route.params.name
    },
  },

  watch: {
    courseName: {
      handler() {
        this.getStats(this.courseName)
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      getStats: GET_COURSE_STATS,
    }),
    submitAddMultipleStudents(file) {
      const r = new FileReader()
      const course = this.$route.params.name
      r.onload = async e => {
        const csvString = e.target.result
        try {
          await agent.Auth.batchSignup({ course, csvString })
          this.getStats(course)
          this.$alertSuccess('新增學生成功。')
        } catch (error) {
          console.log('[views/ManageMembers/submitAddMultipleStudents error]', error)
          this.$alertFail('新增學生失敗。')
          throw error
        }
      }
      r.readAsText(file)
    },
    async submitAddStudent(csvString) {
      try {
        const course = this.$route.params.name
        await agent.Auth.batchSignup({ course, csvString })
        this.getStats(course)
        this.$alertSuccess('新增學生成功。')
      } catch (error) {
        console.log('[views/ManageMembers/submitAddStudent error]', error)
        this.$alertFail('新增學生失敗。')
        throw error
      }
    },
  },
}
</script>
