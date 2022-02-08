<template>
  <div>
    <div class="mt-4 d-flex flex-column">
      <CodeEditor
        v-model="code"
        :height="200"
      >
        <div class="d-flex pb-1">
          <v-tooltip bottom>
            <template #activator="{ on, attr }">
              <v-btn
                class="ml-2"
                color="primary"
                v-bind="attr"
                small
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
      <v-spacer />
      <v-btn
        color="success"
        class="mr-6"
        @click="submitTest"
      >
        測試
      </v-btn>
      <v-btn
        color="success"
        @click="submitCode"
      >
        送出
      </v-btn>
    </div>
    <div v-if="testResult">
      <div class="text-body-1 font-weight-medium my-4">
        測試執行結果
      </div>
      <Spinner v-if="isTestSubmissionPending" />
      <ChallengeResult
        v-else
        :judge-result="testResult.judge_result"
        :code="testResult.code"
        :stdout="testResult.stdout"
        :stderr="testResult.stderr"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
    },
    defaultCode: {
      type: String,
      default: '',
    },
    isTestSubmissionPending: {
      type: Boolean,
      require: true,
    },
    testResult: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      isPending: false,
      code: this.defaultCode,
    }
  },

  watch: {
    comment: {
      handler() {
        if (this.comment && this.comment.submission) {
          this.code = this.comment.submission.code
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.code = this.defaultCode
    },
    submitTest() {
      this.$emit('submit-test-submission', this.code)
    },
    submitCode() {
      this.$emit('submit-new-submission', this.code)
    },
  },
}
</script>
