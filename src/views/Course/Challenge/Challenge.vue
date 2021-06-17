<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div class="pa-4" v-else>
      <Challenge v-if="prob" :prob="prob" />
      <ChallengeCode
        class="mt-16"
        :comment="comment"
        :defaultCode="prob.defaultCode"
        :testResult="testResult"
        :isTestSubmissionPending="isTestSubmissionPending"
        @submit-test-submission="submitTestSubmission"
        @submit-new-submission="submitNewSubmission"
      />
      <div class="mt-8 mb-14">
        <h4>歷史紀錄</h4>
        <ChallengeHistory :comment="comment" />
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import Challenge from '@/components/Course/Challenge/Challenge'
import ChallengeCode from '@/components/Course/Challenge/ChallengeCode'
import ChallengeHistory from '@/components/Course/Challenge/ChallengeHistory'
import agent from '@/api/agent'
import { mapState, mapGetters, mapActions } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'

export default {
  components: { Spinner, Challenge, ChallengeCode, ChallengeHistory },
  data: () => ({
    isLoading: true,
    testSubmissionId: null,
    testResult: null,
    pollingSubmission: null,
  }),
  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
    ...mapGetters({
      comment: GetterTypes.COMMENT_OF_MINE,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
    isTestSubmissionPending() {
      if (!this.testResult) return false
      return this.testResult.judge_result === undefined || this.testResult.judge_result === -1
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
    this.$store.dispatch(ActionTypes.GET_PROBLEMS, { course: this.prob.course })
    this.isLoading = false

    this.pollingSubmission = setInterval(
      that => {
        if (that.isTestSubmissionPending) {
          that.fetchTestSubmission()
        }
      },
      2000,
      this,
    )
  },
  beforeDestroy() {
    clearInterval(this.pollingSubmission)
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
      getComments: ActionTypes.GET_COMMENTS,
    }),
    fetchTestSubmission() {
      agent.Submission.get(this.testSubmissionId).then(res => {
        this.testResult = res.data.data
      })
    },
    async submitTestSubmission(code) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testSubmissionId = submissionId
        agent.Submission.get(submissionId).then(res => {
          this.testResult = res.data.data
        })
      } catch (error) {
        console.log('[views/Challenge/submitTestSubmission] error', error)
        throw error
      }
    },
    async submitNewSubmission(code) {
      if (this.comment) {
        try {
          await agent.Comment.createSubmission(this.comment.id, { code })
          await this.getProblem(this.pid)
        } catch (error) {
          console.log('[views/Challenge/submitNewSubmission] error', error)
          throw error
        }
      } else {
        const body = {
          target: 'problem',
          id: `${this.pid}`,
          title: 'submission',
          content: '',
          code,
        }
        try {
          await agent.Comment.create(body)
          await this.getProblem(this.pid)
        } catch (error) {
          console.log('[views/Challenge/submitNewSubmission(Comment)] error', error)
          throw error
        }
      }
    },
  },
}
</script>
