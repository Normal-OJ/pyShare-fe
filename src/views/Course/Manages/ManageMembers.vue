<template>
  <ManageMembers
    :stats="parsedStats ? parsedStats : []"
    :loading="!parsedStats"
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
    courseId() {
      return this.$route.params.id
    },
    parsedStats() {
      if (!this.stats) return null
      return this.stats.map(stat => {
        const { username, displayName, id } = stat.info
        const numOfProblems = stat.problems.length
        const numOfComments = stat.comments.length
        const numOfReplies = stat.replies.length
        const numOfLiked = stat.liked.reduce((a, b) => {
          return a + b.starers.length
        }, 0)
        const numOfLikes = stat.likes.length
        const numOfAcceptedComments = stat.comments.filter(c => c.accepted).length
        const [execSuccess, execFail] = stat.execInfo.reduce(
          (a, b) => {
            return [a[0] + b.success, a[1] + b.fail]
          },
          [0, 0],
        )
        return {
          username,
          displayName,
          id,
          numOfProblems,
          numOfComments,
          numOfReplies,
          numOfLiked,
          numOfLikes,
          numOfAcceptedComments,
          execSuccess,
          execFail,
        }
      })
    },
  },

  watch: {
    courseId: {
      handler() {
        this.getStats(this.courseId)
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
      r.onload = async e => {
        const csvString = e.target.result
        try {
          await agent.Auth.batchSignup({ course: this.courseId, csvString })
          this.getStats(this.courseId)
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
        await agent.Auth.batchSignup({ course: this.courseId, csvString })
        this.getStats(this.courseId)
        resolve()
      } catch (error) {
        console.log('[views/ManageMembers/submitAddStudent] error', error)
        reject(error)
        throw error
      }
    },
    async submitDeleteStudent(users, resolve, reject) {
      try {
        await agent.Course.removeStudent(this.courseId, { users })
        this.getStats(this.courseId)
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
