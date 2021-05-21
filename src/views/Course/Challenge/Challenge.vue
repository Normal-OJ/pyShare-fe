<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div class="pa-4" v-else>
      <Challenge v-if="prob" :prob="prob" />
      <ChallengeCode
        class="mt-16"
        :defaultCode="prob.defaultCode"
        @submit-test-submission="submitTestSubmission"
      />
    </div>
  </v-fade-transition>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import Challenge from '@/components/Course/Challenge/Challenge'
import ChallengeCode from '@/components/Course/Challenge/ChallengeCode'
import agent from '@/api/agent'
import { mapState, mapActions } from 'vuex'
import { GET_COURSE_PROBLEMS, GET_COMMENTS } from '@/store/actions.type'

export default {
  components: { Spinner, Challenge, ChallengeCode },
  data: () => ({
    isLoading: true,
    testSubmissionId: null,
  }),
  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
  },
  watch: {
    async pid() {
      this.isLoading = true
      this.getProblem(this.pid).then(() => (this.isLoading = false))
    },
  },
  async created() {
    await this.getProblem(this.pid)
    this.$store.dispatch(GET_COURSE_PROBLEMS, this.prob.course)
    this.isLoading = false
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
        console.log('[views/Challenge/getProblem] error', error)
        alert('題目不存在')
        this.$router.push({ name: 'courseChallenges' })
        throw error
      }
    },
    ...mapActions({
      getComments: GET_COMMENTS,
    }),
    // fetchSubmission() {
    //   this.getComments(this.prob.comments)
    // },
    // fetchTestSubmission(source) {
    //   agent.Submission.get(this.testSubmissionId).then(res => {
    //     this.testResult[source] = res.data.data
    //   })
    // },
    async submitTestSubmission(code) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testSubmissionId = submissionId
        agent.Submission.get(submissionId).then(res => {
          console.log('res', res)
          // this.testResult[source] = res.data.data
        })
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    async submitNewComment(code) {
      const body = {
        target: 'problem',
        id: `${this.pid}`,
        title: 'submission',
        code,
      }
      try {
        await agent.Comment.create(body)
        await this.getProblem(this.pid)
      } catch (error) {
        console.log('[views/Problem/submitNewComment] error', error)
        throw error
      }
    },
  },
}
</script>

<style></style>
