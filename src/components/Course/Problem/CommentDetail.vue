<template>
  <Fragment>
    <v-card class="py-4 px-6 mt-4">
      <div class="d-flex flex-row align-center">
        <v-avatar class="mr-2" size="48" color="primary">
          <span class="white--text headline">{{ comment.author.displayName.slice(0, 1) }}</span>
        </v-avatar>
        <div class="d-flex flex-column" style="flex: 1">
          <!-- First Row -->
          <div class="d-flex flex-row align-center">
            <div v-if="!isEdit[COMMENT_KEY.TITLE]" class="d-flex align-center">
              <div class="text-body-1">{{ comment && comment.title }}</div>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="$isSelf(comment.author.username)"
                    class="ml-2 rounded"
                    color="primary darken-3"
                    x-small
                    icon
                    outlined
                    @click.stop="editComment(COMMENT_KEY.TITLE)"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon small>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>編輯創作標題</span>
              </v-tooltip>
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="hasLiked ? 'secondary' : 'default'"
                  @click="likeComment"
                  outlined
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon>{{ hasLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                  （{{ comment.liked && comment.liked.length }}）
                </v-btn>
              </template>
              <span>愛心</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ml-4" icon @click="closeSelectedComment" v-on="on" v-bind="attrs">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>關閉創作，回到列表</span>
            </v-tooltip>
          </div>
          <!-- Second Row -->
          <div class="d-flex flex-row align-center text-body-2">
            <router-link :to="{ name: 'profile', params: { username: comment.author.username } }">
              {{ comment.author.displayName }}
            </router-link>
            <div class="text-body-2" style="white-space: pre">
              &nbsp;·&nbsp;{{ comment.floor }}&nbsp;樓&nbsp;·&nbsp;
            </div>
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
                <div v-show="hasAccepted" style="white-space: pre">
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
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="$isSelf(comment.author.username) && !isEdit[COMMENT_KEY.CONTENT]"
                class="ml-2 rounded"
                color="primary darken-3"
                x-small
                icon
                outlined
                @click.stop="editComment(COMMENT_KEY.CONTENT)"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon small>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
            <span>編輯創作說明</span>
          </v-tooltip>
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
            v-show="$isSelf(comment.author.username) && !isEdit[COMMENT_KEY.CODE]"
            class="ml-2 rounded"
            color="primary darken-2"
            small
            outlined
            @click.stop="editComment(COMMENT_KEY.CODE)"
          >
            <v-icon small>mdi-pencil-plus-outline</v-icon>
            <div class="text-button ml-1">新增程式版本</div>
          </v-btn>

          <v-menu offset-y rounded="0">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip right>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    v-show="!isEdit[COMMENT_KEY.CODE]"
                    class="ml-2 rounded"
                    color="primary darken-2"
                    outlined
                    small
                    v-bind="attrs"
                    v-on="{ ...menu, ...tooltip }"
                  >
                    <v-icon size="20">mdi-history</v-icon>
                    <div class="text-button ml-1">
                      {{ `版本 ${browsingSubmissionIndex + 1}` }}
                      {{
                        browsingSubmissionIndex === historySubmissions.length - 1
                          ? '（最新版）'
                          : ''
                      }}
                    </div>
                  </v-btn>
                </template>
                <span>檢視歷史版本</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item
                v-for="(submission, index) in historySubmissions"
                :key="submission.id"
                link
                @click="browsingSubmissionIndex = index"
              >
                <v-list-item-title class="text-body-1">
                  {{ `版本 ${index + 1}（${$formattedTime(submission.timestamp)}）` }}
                  <v-chip
                    :color="SUBMISSION_COLOR[SUBMISSION_STATE[`${submission.state}`]]"
                    label
                    small
                  >
                    {{ SUBMISSION_STATE[`${submission.state}`] }}
                  </v-chip>
                  {{ index === browsingSubmissionIndex ? '（目前顯示）' : '' }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer />
          <div class="text-body-2" v-if="browsingSubmission">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  {{
                    `版本 ${browsingSubmissionIndex + 1} · ${$timeFromNow(
                      browsingSubmission.timestamp,
                    )}`
                  }}
                </span>
              </template>
              <span>{{ $formattedTime(browsingSubmission.timestamp) }}</span>
            </v-tooltip>
            <v-chip
              v-permission="[STUDENT, 'MAGIC']"
              :color="SUBMISSION_COLOR[SUBMISSION_STATE[`${browsingSubmission.state}`]]"
              class="text-subtitle-2 ml-4"
              label
            >
              {{ SUBMISSION_STATE[`${browsingSubmission.state}`] }}
            </v-chip>
            <v-menu offset-y rounded="0" v-permission="[TEACHER]">
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      class="text-subtitle-2 ml-4"
                      :color="SUBMISSION_COLOR[SUBMISSION_STATE[`${browsingSubmission.state}`]]"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      small
                      depressed
                    >
                      {{ SUBMISSION_STATE[`${browsingSubmission.state}`] }}
                      <v-icon class="ml-1">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <span>批改創作</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item
                  v-for="{ value, label } in submissionStatusOptions"
                  :key="value"
                  link
                  @click="gradeSubmission(value, browsingSubmission.id)"
                >
                  <v-list-item-title class="text-body-2">
                    <v-chip :color="SUBMISSION_COLOR[label]" label small>{{ label }}</v-chip>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <Spinner v-if="!browsingSubmission" />
        <CodeEditor
          v-else-if="!isEdit[COMMENT_KEY.CODE]"
          v-model="browsingSubmission.code"
          readOnly
        />
        <div v-else>
          <div class="d-flex mb-2">
            <div class="text-body-1">新增程式版本</div>
            <v-spacer />
            <v-btn class="mr-2" color="primary" outlined tile small @click="setDefaultCode">
              套用預設程式碼
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
          <Spinner v-if="(isSubmissionPending && !isBrowsingHistory) || !browsingSubmission" />
          <CommentResult v-else :sid="browsingSubmission.id" :result="browsingSubmission" />
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
          <div v-if="testResult">
            <div class="text-body-1 font-weight-bold my-4">測試執行結果</div>
            <Spinner v-if="isTestSubmissionPending" />
            <CommentResult v-else :sid="''" :result="testResult" isTest />
          </div>
        </div>
      </div>
      <v-divider class="mt-10 mb-5" />
      <v-btn text :color="hasLiked ? 'primary' : 'default'" @click="likeComment" width="50%">
        <v-icon class="mr-1" :color="hasLiked ? 'secondary' : 'default'">
          {{ hasLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
        愛心（{{ comment.liked && comment.liked.length }}）
      </v-btn>
      <v-btn text width="50%" @click="isReply = true" v-permission="['ALL', 'COURSE']">
        <v-icon class="mr-1">mdi-comment-outline</v-icon>
        留言（{{ comment.replies && comment.replies.length }}）
      </v-btn>
    </v-card>
    <div v-show="isReply" class="mt-6">
      <TextEditor v-model="newReply" />
      <div class="d-flex mt-1">
        <v-btn class="mr-2" color="primary" small tile @click="submitReply">
          送出
        </v-btn>
        <v-btn color="primary" outlined tile small @click="isReply = false">
          取消
        </v-btn>
      </div>
    </div>
    <Spinner v-if="!replies" />
    <CommentReplies
      v-else
      :replies="replies"
      :setIsEdit="setIsEdit"
      @update-reply="(id, index) => $emit('update-reply', id, index)"
      @delete-reply="id => $emit('delete-reply', id)"
    />
  </Fragment>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import Spinner from '@/components/UI/Spinner'
import { SUBMISSION_STATE, SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submission'
import CommentResult from './CommentResult'
import { ROLE } from '@/constants/auth'
import agent from '@/api/agent'
import { Fragment } from 'vue-fragment'
import CommentReplies from './CommentReplies'

const { TEACHER, STUDENT } = ROLE
const COMMENT_KEY = {
  TITLE: 'title',
  CONTENT: 'content',
  CODE: 'code',
}

export default {
  name: 'Comment',

  components: { TextEditor, CodeEditor, Spinner, CommentResult, Fragment, CommentReplies },

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
    },
    username: {
      type: String,
      required: true,
    },
    historySubmissions: {
      type: Array,
      required: true,
    },
    setIsEdit: {
      type: Function,
      required: true,
    },
  },

  computed: {
    submissionStatusOptions() {
      return Object.entries(SUBMISSION_STATE).map(([value, label]) => ({ value, label }))
    },
    isSubmissionPending() {
      if (!this.comment || !this.comment.submission) return false
      if (!this.browsingSubmission) return true
      return !Object.keys(this.browsingSubmission).some(key => key === 'stdout')
    },
    isTestSubmissionPending() {
      if (!this.testResult) return false
      return !Object.keys(this.testResult).some(key => key === 'stdout')
    },
    isBrowsingHistory() {
      return this.browsingSubmissionIndex !== this.comment.submissions.length - 1
    },
    submissions() {
      return this.comment.submissions
    },
    hasLiked() {
      return this.comment.liked.some(user => user.username === this.username)
    },
    commentReplies() {
      return this.comment.replies
    },
    browsingSubmission() {
      return this.historySubmissions[this.browsingSubmissionIndex]
    },
    hasAccepted() {
      return this.historySubmissions.some(submission => submission.state === 1)
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

  watch: {
    submissions: {
      handler() {
        this.browsingSubmissionIndex = this.submissions.length - 1
        this.$emit('getSubmissions', this.comment.id)
      },
      immediate: true,
    },
    commentReplies: {
      handler() {
        this.getReplies()
      },
      immediate: true,
    },
  },

  beforeDestroy() {
    clearInterval(this.pollingSubmission)
  },

  data() {
    return {
      TEACHER,
      STUDENT,
      pollingSubmission: null,
      SUBMISSION_STATE,
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
      browsingSubmissionIndex: this.comment.submissions.length - 1,
      replies: null,
      isReply: false,
      newReply: '',
    }
  },

  methods: {
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.newComment = { ...this.newComment, code: this.defaultCode }
    },
    closeSelectedComment() {
      this.$emit('fetchSubmission')
      this.$router.replace({ query: null })
      this.$emit('refetchFloor')
    },
    getReplies() {
      Promise.all(this.comment.replies.map(cid => agent.Comment.get(cid))).then(resp => {
        this.replies = resp.map((res, index) => ({
          ...res.data.data,
          id: this.comment.replies[index],
        }))
      })
    },
    editComment(key) {
      if (key !== this.COMMENT_KEY.CODE) this.newComment[key] = this.comment[key]
      else {
        this.newComment[key] = this.comment.submission.code
        this.isDisableSubmitSubmission = !this.newComment[key]
      }
      this.isEdit[key] = true
      this.setIsEdit(true)
    },
    cancelEditComment(key) {
      this.isEdit[key] = false
      if (Object.values(this.isEdit).every(edit => !edit)) {
        this.setIsEdit(false)
      }
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
    gradeSubmission(value, sid) {
      this.$emit('gradeSubmission', sid, value, this.comment.id)
    },
    likeComment() {
      this.$emit('like-comment', this.comment.id)
    },
    submitReply() {
      this.$emit('submitReply', this.comment.id, this.newReply)
      this.isReply = false
    },
  },
}
</script>
