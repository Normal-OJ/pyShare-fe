<template>
  <v-card class="pa-4 mt-4">
    <div class="d-flex flex-row align-center">
      <v-avatar class="mr-2" size="48" color="primary">
        <span class="white--text headline">{{ comment.author.displayName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="d-flex flex-column" style="flex: 1">
        <!-- First Row -->
        <div class="d-flex flex-row align-center">
          <div v-if="!isEdit[COMMENT_KEY.TITLE]" class="d-flex align-center">
            <div class="text-body-1">{{ comment && comment.title }}</div>
            <v-btn
              v-if="$isSelf(comment.author.username)"
              class="ml-2"
              small
              icon
              @click.stop="editComment(COMMENT_KEY.TITLE)"
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </div>
          <div v-else class="d-flex align-center">
            <v-text-field v-model="newComment[COMMENT_KEY.TITLE]" outlined dense hide-details />
            <v-btn
              class="mx-2"
              color="primary"
              tile
              small
              @click="confirmEditComment(COMMENT_KEY.TITLE)"
            >
              儲存
            </v-btn>
            <v-btn
              color="primary"
              outlined
              tile
              small
              @click="cancelEditComment(COMMENT_KEY.TITLE)"
            >
              取消
            </v-btn>
          </div>
          <v-spacer />
          <!-- <v-chip v-permission="[STUDENT]" :color="SUBMISSION_COLOR[comment.state]]" label small>{{ comment.state }}</v-chip> -->
          <v-menu offset-y rounded="0" v-permission="[TEACHER]">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on" small depressed>PENDING</v-btn>
              <!-- TODO: add chevron down for teacher -->
            </template>
            <v-list>
              <v-list-item v-for="option in submissionStatusOptions" :key="option" link>
                <v-list-item-title class="text-body-2">
                  <v-chip :color="SUBMISSION_COLOR[option]" label small>{{ option }}</v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn class="ml-4" icon @click="closeSelectedComment">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <!-- Second Row -->
        <div class="d-flex flex-row align-center text-body-2">
          <router-link :to="{ name: 'profile', params: { username: comment.author.username } }">
            {{ comment.author.displayName }}
          </router-link>
          <div class="text-body-2">&nbsp;·&nbsp;{{ comment.floor }}&nbsp;樓&nbsp;·&nbsp;</div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <div class="text-body-2" v-on="on" v-bind="attr">
                {{ `發布於 ${$timeFromNow(comment.created)}` }}
              </div>
            </template>
            <span>{{ `發布於 ${$formattedTime(comment.created)}` }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <div v-if="comment.hasAccepted">
                &nbsp;·&nbsp;
                <v-icon color="primary" small v-on="on" v-bind="attr">
                  mdi-check-circle
                </v-icon>
              </div>
            </template>
            <span>此創作已有其中一個版本 AC </span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <!-- Creation Content -->
      <div class="text-body-1 font-weight-bold d-flex align-center my-4">
        創作說明
        <v-btn
          v-if="$isSelf(comment.author.username)"
          class="ml-2"
          small
          icon
          @click.stop="editComment(COMMENT_KEY.CONTENT)"
        >
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <div v-if="!isEdit[COMMENT_KEY.CONTENT]" v-html="comment.content" />
      <div v-else>
        <TextEditor v-model="newComment[COMMENT_KEY.CONTENT]" />
        <div class="d-flex mt-1">
          <v-btn
            class="mr-2"
            color="primary"
            small
            tile
            @click="confirmEditComment(COMMENT_KEY.CONTENT)"
          >
            儲存
            <!-- <v-icon>mdi-check</v-icon> -->
          </v-btn>
          <v-btn
            color="primary"
            outlined
            tile
            small
            @click="cancelEditComment(COMMENT_KEY.CONTENT)"
          >
            取消
            <!-- <v-icon>mdi-close</v-icon> -->
          </v-btn>
        </div>
      </div>
      <!-- Creation Code -->
      <div class="text-body-1 font-weight-bold d-flex align-center my-4">
        創作程式
        <v-btn
          v-if="$isSelf(comment.author.username)"
          class="ml-2"
          small
          icon
          @click.stop="editComment(COMMENT_KEY.CODE)"
        >
          <v-icon small>mdi-pencil-plus</v-icon>
        </v-btn>
      </div>
      <CodeEditor v-if="!isEdit[COMMENT_KEY.CODE]" v-model="comment.submission.code" readOnly />
      <div v-else>
        <div class="d-flex mb-2">
          <div class="text-body-1">新增程式版本</div>
          <v-spacer />
          <v-btn class="mr-2" color="primary" outlined tile small @click="setDefaultCode">
            回復預設程式碼
          </v-btn>
          <v-btn color="primary" outlined tile small @click="cancelEditComment(COMMENT_KEY.CODE)">
            取消
          </v-btn>
        </div>
        <CodeEditor
          v-model="newComment[COMMENT_KEY.CODE]"
          @input="checkIsDisableSubmitSubmission"
        />
      </div>
      <!-- Creation Result -->
      <div v-if="!isEdit[COMMENT_KEY.CODE]">
        <div class="text-body-1 font-weight-bold my-4">執行結果</div>
        <Spinner v-if="isSubmissionPending" />
        <CommentResult
          v-else
          :sid="comment.submissions[comment.submissions.length - 1]"
          :result="comment.submission"
        />
      </div>
      <div v-else>
        <div class="mt-4 d-flex">
          <v-btn
            color="success"
            :disabled="isDisableSubmitSubmission"
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
          <v-btn color="success" @click="submitNewSubmission">
            送出創作
          </v-btn>
        </div>
        <div v-if="testResult !== null">
          <div class="text-body-1 font-weight-bold my-4">測試執行結果</div>
          <Spinner v-if="isTestSubmissionPending" />
          <CommentResult v-else :sid="''" :result="testResult" isTest />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import Spinner from '@/components/UI/Spinner'
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submission'
import CommentResult from './CommentResult'
import { ROLE } from '@/constants/auth'

const { TEACHER, STUDENT } = ROLE
const COMMENT_KEY = {
  TITLE: 'title',
  CONTENT: 'content',
  CODE: 'code',
}

export default {
  name: 'Comment',

  components: { TextEditor, CodeEditor, Spinner, CommentResult },

  props: {
    comment: {
      type: Object,
      required: true,
    },
    defaultCode: {
      type: String,
      default: '',
    },
    testResult: {
      type: Object,
      required: true,
    },
  },

  computed: {
    submissionStatusOptions() {
      return Object.keys(SUBMISSION_STATUS)
    },
    isSubmissionPending() {
      if (!this.comment || !this.comment.submission) return false
      return !Object.keys(this.comment.submission).some(key => key === 'stdout')
    },
    isTestSubmissionPending() {
      if (!this.testResult) return false
      return !Object.keys(this.testResult).some(key => key === 'stdout')
    },
  },

  created() {
    this.pollingSubmission = setInterval(
      that => {
        if (that.isSubmissionPending) {
          this.$emit('fetchSubmission')
        }
        if (that.isTestSubmissionPending) {
          this.$emit('fetchTestSubmission', 'detail')
        }
      },
      1000,
      this,
    )
  },

  beforeDestroy() {
    clearInterval(this.pollingSubmission)
  },

  data: () => ({
    TEACHER,
    STUDENT,
    pollingSubmission: null,
    SUBMISSION_STATUS,
    SUBMISSION_COLOR,
    COMMENT_KEY,
    newComment: {},
    isEdit: {
      [COMMENT_KEY.TITLE]: false,
      [COMMENT_KEY.CONTENT]: false,
      [COMMENT_KEY.CODE]: false,
    },
    isDisableSubmitSubmission: false,
  }),

  methods: {
    setDefaultCode() {
      this.newComment = { ...this.newComment, code: this.defaultCode }
    },
    closeSelectedComment() {
      this.$router.replace({ query: null })
      this.$emit('refetchFloor')
    },
    editComment(key) {
      if (key !== this.COMMENT_KEY.CODE) this.newComment[key] = this.comment[key]
      else {
        this.newComment[key] = this.comment.submission.code
        this.isDisableSubmitSubmission = !this.newComment[key]
      }
      this.isEdit[key] = true
      this.$emit('setIsEdit', true)
    },
    cancelEditComment(key) {
      this.isEdit[key] = false
      this.$emit('setIsEdit', false)
    },
    confirmEditComment(key) {
      this.updateComment()
      this.cancelEditComment(key)
    },
    updateComment() {
      this.$emit('updateComment', this.comment.id, { ...this.comment, ...this.newComment })
    },
    submitTestSubmission() {
      this.$emit('submitTestSubmission', this.newComment[this.COMMENT_KEY.CODE], 'detail')
    },
    submitNewSubmission() {
      this.$emit('submitNewSubmission', this.comment.id, this.newComment[this.COMMENT_KEY.CODE])
      this.cancelEditComment(this.COMMENT_KEY.CODE)
    },
    checkIsDisableSubmitSubmission() {
      this.isDisableSubmitSubmission = !this.newComment[COMMENT_KEY.CODE]
    },
  },
}
</script>
