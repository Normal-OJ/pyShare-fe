<template>
  <div>
    <div class="text-h6">測驗題（題號 {{ pid }}）學生作答情況</div>
  </div>
</template>

<script>
import agent from '@/api/agent'
import { mapActions, mapGetters, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'

export default {
  data: () => ({
    prob: null,
  }),

  computed: {
    ...mapState({
      courseInfo: state => state.course.courseInfo,
    }),
    ...mapGetters({
      comments: GetterTypes.COMMENTS,
    }),
    pid() {
      return this.$route.params.pid
    },
    student() {
      return this.courseInfo.students
    },
  },

  created() {
    this.getProblem(this.pid)
  },

  methods: {
    async getProblem(pid) {
      try {
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
        if (this.prob.extra._cls !== 'OJProblem') {
          throw new Error()
        }
        await this.getComments(data.data.comments)
      } catch (error) {
        console.log('[views/ChallengeStats/getProblem] error', error)
        alert('題目不存在')
        this.$router.push({ name: 'courseChallenges' })
        throw error
      }
    },
    ...mapActions({
      getComments: ActionTypes.GET_COMMENTS,
    }),
  },
}
</script>

<style></style>
