<template>
  <ProblemsStats
    :stats="parsedStats ? parsedStats : []"
    :loading="!parsedStats"
    @delete-student="submitDeleteStudent"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  computed: {
    ...mapState({
      stats: (state) => state.course.courseStats,
    }),
    courseId() {
      return this.$route.params.id
    },
    parsedStats() {
      if (!this.stats) return null
      return this.stats.map((stat) => {
        const { username, displayName, id } = stat.info
        const numOfProblems = stat.problems.length
        const numOfComments = stat.comments.length
        const numOfReplies = stat.replies.length
        const numOfLiked = stat.liked.reduce((a, b) => {
          return a + b.starers.length
        }, 0)
        const numOfLikes = stat.likes.length
        const numOfAcceptedComments = stat.comments.filter((c) => c.accepted).length
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
        this.getCourseStats(this.courseId)
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      getCourseStats: ActionTypes.GET_COURSE_STATS,
    }),
    async submitDeleteStudent(users, resolve, reject) {
      try {
        await this.$agent.Course.removeStudent(this.courseId, { users })
        this.getCourseStats(this.courseId)
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
