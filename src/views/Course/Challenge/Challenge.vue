<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div
      v-else
      class="pa-4"
    >
      <Challenge
        v-if="prob"
        :prob="prob"
      />
      <template v-if="canParticipateCourse">
        <ChallengeCode
          class="mt-16"
          :comment="comment"
          :default-code="prob.defaultCode"
          :test-result="testResult"
          :is-test-submission-pending="isTestSubmissionPending"
          @submit-test-submission="submitTestSubmission"
          @submit-new-submission="submitNewSubmission"
        />
        <div class="mt-8 mb-14">
          <h4>歷史紀錄</h4>
          <ChallengeHistory :comment="comment" />
        </div>
      </template>
      <template v-else>
        <div
          :key="slotName"
          class="d-flex flex-column align-center"
        >
          <div class="text-subtitle-1 gray--text my-8">
            由於您不在這堂課程內，且此課程並非公開課程，您僅能檢視題目而無法提交程式。
          </div>
          <v-img
            :src="require('@/assets/images/warning.svg')"
            max-width="400"
            contain
          />
        </div>
      </template>
    </div>
  </v-fade-transition>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'
import { canParticipateCourseMixin } from '@/lib/permissionMixin'

export default {
  mixins: [canParticipateCourseMixin],
  data: () => ({
    isLoading: true,
    testSubmissionId: null,
    testResult: null,
    pollingSubmission: null,
  }),
  computed: {
    ...mapState({
      username: (state) => state.auth.username,
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
      // clear test results
      this.testSubmissionId = null
      this.testResult = null
      // fetch new problem
      this.isLoading = true
      this.getProblem(this.pid).then(() => (this.isLoading = false))
    },
  },
  async created() {
    await this.getProblem(this.pid)
    if (!this.prob) return
    this.$store.dispatch(ActionTypes.GET_PROBLEMS, { course: this.prob.course })
    this.isLoading = false

    this.pollingSubmission = setInterval(
      (that) => {
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
        const { data } = await this.$agent.Problem.get(pid)
        this.prob = data.data
        if (this.prob.extra._cls !== 'OJProblem') {
          this.$router.replace({ name: 'courseProblem', params: { pid } })
        } else {
          await this.getComments(data.data.comments)
        }
      } catch (error) {
        alert('測驗不存在')
        if (error.message === `problem [${pid}] not found!`) {
          this.$rollbar.info('[views/Challenge/getProblem]', error)
        } else {
          this.$rollbar.error('[views/Challenge/getProblem]', error)
        }
        this.$router.push({ name: 'courseChallenges' })
      }
    },
    ...mapActions({
      getComments: ActionTypes.GET_COMMENTS,
    }),
    fetchTestSubmission() {
      this.$agent.Submission.get(this.testSubmissionId).then((res) => {
        this.testResult = res.data.data
      })
    },
    async submitTestSubmission(code) {
      this.testResult = null
      const body = { problemId: this.pid, code }
      try {
        const { data } = await this.$agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testSubmissionId = submissionId
        this.$agent.Submission.get(submissionId).then((res) => {
          this.testResult = res.data.data
        })
      } catch (error) {
        console.log('[views/Challenge/submitTestSubmission] error', error)
        throw error
      }
    },
    async submitNewSubmission(code, cb) {
      if (this.comment) {
        try {
          await this.$agent.Comment.createSubmission(this.comment.id, { code })
          this.$alertSuccess('提交程式成功。')
          await this.getProblem(this.pid)
        } catch (error) {
          this.$alertFail('提交程式失敗。')
          console.log('[views/Challenge/submitNewSubmission] error', error)
          throw error
        } finally {
          cb()
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
          await this.$agent.Comment.create(body)
          this.$alertSuccess('提交程式成功。')
          await this.getProblem(this.pid)
        } catch (error) {
          this.$alertFail('提交程式失敗。')
          console.log('[views/Challenge/submitNewSubmission (Create Comment First)] error', error)
          throw error
        } finally {
          cb()
        }
      }
    },
  },
}
</script>
