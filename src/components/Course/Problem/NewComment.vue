<template>
  <div>
    <div class="mt-4 d-flex">
      <div class="text-h5">新增創作</div>
      <v-spacer />
      <v-btn icon @click="closeNewComment">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="mt-4 d-flex flex-column">
      <div class="text-body-1">創作標題（必填）</div>
      <v-text-field v-model="newComment.title" outlined dense hide-details />
    </div>
    <div class="mt-4 d-flex flex-column">
      <div class="text-body-1">創作說明</div>
      <TextEditor v-model="newComment.content" />
    </div>
    <div class="mt-4 d-flex flex-column">
      <div class="d-flex pb-1">
        <div class="text-body-1">創作程式</div>
        <v-spacer />
        <v-btn class="mr-2" color="primary" outlined tile small @click="setDefaultCode">
          回復預設程式碼
        </v-btn>
      </div>
      <CodeEditor v-model="newComment.code" />
    </div>
    <div class="mt-4 d-flex">
      <v-btn
        color="success"
        :disabled="isDisableSubmitTestSubmission"
        @click="submitTestSubmission"
      >
        測試程式
      </v-btn>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attr }">
          <v-icon class="ml-1" color="primary" v-on="on" v-bind="attr">
            mdi-information
          </v-icon>
        </template>
        <span>在送出創作前運行程式以預覽結果，送出之後也可以再加入新版的程式碼。</span>
      </v-tooltip>
      <v-spacer />
      <v-btn color="success" :disabled="isDisableSubmitComment" @click="submitNewComment">
        送出創作
      </v-btn>
    </div>
    <div v-if="testResult">
      <div class="text-body-1 font-weight-bold my-4">測試執行結果</div>
      <Spinner v-if="isTestSubmissionPending" />
      <CommentResult v-else :sid="''" :result="testResult" isTest />
    </div>
  </div>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import Spinner from '@/components/UI/Spinner'
import CommentResult from './CommentResult'

export default {
  components: { TextEditor, CodeEditor, Spinner, CommentResult },

  props: {
    defaultCode: {
      type: String,
      default: '',
    },
    testResult: {
      type: Object,
    },
  },

  computed: {
    isDisableSubmitTestSubmission() {
      return !this.newComment.code
    },
    isDisableSubmitComment() {
      return !this.newComment.title
    },
    isTestSubmissionPending() {
      if (!this.testResult) return false
      return !Object.keys(this.testResult).some(key => key === 'stdout')
    },
  },

  created() {
    this.pollingSubmission = setInterval(
      that => {
        if (that.isTestSubmissionPending) {
          this.$emit('fetch-test-submission', 'new')
        }
      },
      1000,
      this,
    )
  },

  beforeDestroy() {
    clearInterval(this.pollingSubmission)
  },

  watch: {
    defaultCode: {
      handler() {
        this.newComment.code = this.defaultCode
      },
      immediate: true,
    },
  },

  data: () => ({
    newComment: {
      title: '',
      content: '',
      code: '',
    },
    pollingSubmission: null,
  }),

  methods: {
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.newComment = { ...this.newComment, code: this.defaultCode }
    },
    closeNewComment() {
      this.$router.replace({ query: null })
      this.$emit('refetch-floor')
    },
    submitTestSubmission() {
      this.$emit('submit-test-submission', this.newComment.code, 'new')
    },
    submitNewComment() {
      this.$emit('submit-new-comment', this.newComment)
    },
  },
}
</script>
