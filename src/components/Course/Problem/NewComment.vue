<template>
  <div>
    <div class="mt-4 d-flex">
      <div class="text-h5">新增創作</div>
      <v-spacer />
      <v-btn icon @click="$router.replace({ query: null })">
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
      <div class="text-body-1">創作程式</div>
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
    <!-- <Spinner v-if="!isSubmittionPending" />
    <CommentResult v-else :cid="comment.id" :result="comment.submission" /> -->
  </div>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'

export default {
  components: { TextEditor, CodeEditor },

  computed: {
    isDisableSubmitTestSubmission() {
      return !this.newComment.code
    },
    isDisableSubmitComment() {
      return !this.newComment.title
    },
  },

  data: () => ({
    newComment: {
      title: '',
      content: '',
      code: '',
    },
  }),

  methods: {
    submitTestSubmission() {
      this.$emit('submitTestSubmission', this.newComment.code)
    },
    submitNewComment() {
      this.$emit('submitNewComment', this.newComment)
    },
    print() {
      console.log(this.newComment.code)
    },
  },
}
</script>
