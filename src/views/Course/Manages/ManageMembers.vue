<template>
  <ManageMembers
    :stats="stats ? stats : []"
    :loading="!stats"
    @submit-add-multiple-students="submitAddMultipleStudents"
    @submit-add-student="submitAddStudent"
    @delete-student="submitDeleteStudent"
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
    submitAddMultipleStudents(file, resolve, reject) {
      const r = new FileReader()
      const course = this.$route.params.name
      r.onload = async e => {
        const csvString = e.target.result
        try {
          await agent.Auth.batchSignup({ course, csvString })
          this.getStats(course)
          resolve()
        } catch (error) {
          console.log('[views/ManageMembers/submitAddMultipleStudents] error', error)
          reject(error)
          throw error
        }
      }
      r.readAsText(file)
    },
    async submitAddStudent(csvString, resolve, reject) {
      try {
        const course = this.$route.params.name
        await agent.Auth.batchSignup({ course, csvString })
        this.getStats(course)
        resolve()
      } catch (error) {
        console.log('[views/ManageMembers/submitAddStudent] error', error)
        reject(error)
        throw error
      }
    },
    async submitDeleteStudent(users, resolve, reject) {
      try {
        await agent.Course.removeStudent(this.courseName, { users })
        this.getStats(this.courseName)
        resolve()
      } catch (error) {
        console.log('[views/ManageMembers/submitDeleteStudent] error', error)
        reject(error)
        throw error
      }
    },
  },
}
</script>
