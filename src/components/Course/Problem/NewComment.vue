<template>
  <div>
    <div class="mt-4 d-flex">
      <div class="text-h5">
        新增創作
      </div>
      <v-spacer />
      <v-btn
        icon
        @click="closeNewComment"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="mt-4 d-flex flex-column">
      <div class="text-body-1">
        創作標題（必填）
      </div>
      <v-text-field
        v-model="newComment.title"
        outlined
        dense
        hide-details
      />
    </div>
    <div class="mt-4 d-flex flex-column">
      <div class="text-body-1">
        創作說明
      </div>
      <TextEditor v-model="newComment.content" />
    </div>
    <div class="mt-4 d-flex flex-column">
      <CodeEditor v-model="newComment.code">
        <div class="d-flex pb-1">
          <div class="text-body-1">
            創作程式
          </div>
          <v-tooltip bottom>
            <template #activator="{ on, attr }">
              <v-btn
                class="ml-2"
                color="primary"
                v-bind="attr"
                small
                icon
                v-on="on"
                @click="setDefaultCode"
              >
                <v-icon>mdi-autorenew</v-icon>
              </v-btn>
            </template>
            <span>恢復為預設程式碼</span>
          </v-tooltip>
        </div>
      </CodeEditor>
    </div>
    <div class="mt-4 d-flex">
      <v-btn
        color="success"
        :disabled="isDisableSubmitTestSubmission"
        :loading="isTestSubmissionPending"
        @click="submitTestSubmission"
      >
        測試程式
      </v-btn>
      <v-tooltip bottom>
        <template #activator="{ on, attr }">
          <v-icon
            class="ml-3"
            color="primary"
            v-bind="attr"
            v-on="on"
          >
            mdi-information
          </v-icon>
        </template>
        <span>在送出創作前運行程式以預覽結果，送出之後也可以再加入新版的程式碼。</span>
      </v-tooltip>
      <v-spacer />
      <v-btn
        color="success"
        :disabled="isDisableSubmitComment"
        :loading="isSubmissionJudging"
        @click="submitNewComment"
      >
        送出創作
      </v-btn>
    </div>
    <div v-if="testResult">
      <div class="text-body-1 font-weight-medium my-4">
        測試執行結果
      </div>
      <Spinner v-if="isTestSubmissionPending" />
      <CommentResult
        v-else
        :sid="''"
        :result="testResult"
        is-test
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultCode: {
      type: String,
      default: '',
    },
    testResult: {
      type: Object,
    },
  },

  data: () => ({
    newComment: {
      title: '',
      content: '',
      code: '',
    },
    isSubmissionJudging: false,
    pollingSubmission: null,
  }),

  computed: {
    isDisableSubmitTestSubmission() {
      return !this.newComment.code
    },
    isDisableSubmitComment() {
      return !this.newComment.title
    },
    isTestSubmissionPending() {
      if (!this.testResult) return false
      return !Object.keys(this.testResult).some((key) => key === 'stdout')
    },
  },

  watch: {
    defaultCode: {
      handler() {
        this.newComment.code = this.defaultCode
      },
      immediate: true,
    },
  },

  created() {
    this.pollingSubmission = setInterval(
      (that) => {
        if (that.isTestSubmissionPending) {
          this.$emit('fetch-test-submission', 'new')
        }
      },
      4000,
      this,
    )
  },

  beforeDestroy() {
    clearInterval(this.pollingSubmission)
  },

  methods: {
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.newComment = { ...this.newComment, code: this.defaultCode }
    },
    closeNewComment() {
      this.$router.replace({ query: null })
    },
    submitTestSubmission() {
      this.$emit('submit-test-submission', this.newComment.code, 'new')
    },
    submitNewComment() {
      this.isSubmissionJudging = true
      this.$emit('submit-new-comment', this.newComment, () => (this.isSubmissionJudging = false))
    },
  },
}
</script>
