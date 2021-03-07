<template>
  <div>
    <v-card class="py-4 px-6 mt-4">
      <div class="d-flex">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="closeSelectedComment" v-on="on" v-bind="attrs">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>關閉創作，回到列表</span>
        </v-tooltip>
        <v-tooltip bottom :disabled="!previousFloor">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-on="on"
              v-bind="attrs"
              class="ml-4"
              :disabled="!previousFloor"
              @click="gotoFloor(previousFloor)"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>上一個創作</span>
        </v-tooltip>
        <v-tooltip bottom :disabled="!nextFloor">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-on="on"
              v-bind="attrs"
              class="ml-1"
              :disabled="!nextFloor"
              @click="gotoFloor(nextFloor)"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </template>
          <span>下一個創作</span>
        </v-tooltip>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="deleteSelectedComment"
              v-on="on"
              v-bind="attrs"
              v-if="$isSelf(comment.author.username)"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
          <span>刪除創作</span>
        </v-tooltip>
      </div>
      <v-divider class="mt-1 mb-4" />
      <div class="d-flex flex-row align-center">
        <v-avatar class="mr-4" size="48" color="primary">
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
                small
                @click="confirmEditComment(COMMENT_KEY.TITLE)"
              >
                儲存
              </v-btn>
              <v-btn color="primary" text small @click="cancelEditComment(COMMENT_KEY.TITLE)">
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
          </div>
          <!-- Second Row -->
          <div class="d-flex flex-row align-center text-body-2">
            <router-link :to="{ name: 'profile', params: { id: comment.author.id } }">
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
          <div class="d-flex mt-2">
            <v-btn
              class="mr-2"
              color="primary"
              small
              @click="confirmEditComment(COMMENT_KEY.CONTENT)"
            >
              儲存
            </v-btn>
            <v-btn color="primary" text small @click="cancelEditComment(COMMENT_KEY.CONTENT)">
              取消
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
                  <SubmissionStatusLabel :status="submission.state" />
                  {{ index === browsingSubmissionIndex ? '（目前顯示）' : '' }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div
            class="d-flex ml-2 align-center"
            v-if="browsingSubmission && isEdit[COMMENT_KEY.CODE]"
          >
            <div class="text-body-1">新增程式版本</div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attr }">
                <v-btn
                  class="ml-2"
                  color="primary"
                  v-on="on"
                  v-bind="attr"
                  small
                  icon
                  @click="setDefaultCode"
                >
                  <v-icon>mdi-autorenew</v-icon>
                </v-btn>
              </template>
              <span>恢復為預設程式碼</span>
            </v-tooltip>
            <v-btn
              class="ml-2"
              color="primary"
              outlined
              small
              @click="cancelEditComment(COMMENT_KEY.CODE)"
            >
              取消
            </v-btn>
          </div>
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
            <SubmissionStatusLabel
              v-permission="[STUDENT, 'MAGIC', 'OUT_OF_COURSE']"
              :status="browsingSubmission.state"
              :small="false"
              class="text-subtitle-2 ml-4"
            />
            <v-menu offset-y rounded="0" v-permission="[TEACHER, 'COURSE']">
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      class="text-subtitle-2 ml-4"
                      :color="SUBMISSION_STATUS[`${browsingSubmission.state}`].color"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      small
                      depressed
                    >
                      {{ SUBMISSION_STATUS[`${browsingSubmission.state}`].text }}
                      <v-icon class="ml-1">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <span>批改創作</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item
                  v-for="status in statusOptions"
                  :key="status"
                  link
                  @click="gradeSubmission(status, browsingSubmission.id)"
                >
                  <v-list-item-title>
                    <SubmissionStatusLabel :status="status" class="text-body-2" />
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
                <v-icon class="ml-3" color="primary" v-on="on" v-bind="attr">
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
      <div class="d-flex mt-2">
        <v-btn class="mr-2" color="primary" small @click="handleSubmitReply">
          送出
        </v-btn>
        <v-btn color="primary" text small @click="isReply = false">
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
  </div>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import Spinner from '@/components/UI/Spinner'
import SubmissionStatusLabel from '@/components/UI/SubmissionStatusLabel'
import { SUBMISSION_STATUS } from '@/constants/submission'
import CommentResult from './CommentResult'
import { ROLE } from '@/constants/auth'
import agent from '@/api/agent'
import CommentReplies from './CommentReplies'

const { TEACHER, STUDENT } = ROLE
const COMMENT_KEY = {
  TITLE: 'title',
  CONTENT: 'content',
  CODE: 'code',
}

export default {
  name: 'Comment',

  components: {
    TextEditor,
    CodeEditor,
    Spinner,
    CommentResult,
    CommentReplies,
    SubmissionStatusLabel,
  },

  props: {
    previousFloor: {
      type: Number,
    },
    nextFloor: {
      type: Number,
    },
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
    submitReply: {
      type: Function,
      required: true,
    },
    deleteReply: {
      type: Function,
      required: true,
    },
    subscribeRefetch: {
      type: Function,
      required: true,
    },
    unsubscribeRefetch: {
      type: Function,
      required: true,
    },
  },

  computed: {
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
          this.$emit('fetch-submission')
        }
        if (that.isTestSubmissionPending) {
          this.$emit('fetch-test-submission', 'detail')
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
        this.$emit('get-submissions', this.comment.id)
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
      statusOptions: Object.keys(SUBMISSION_STATUS).map(s => Number(s)),
      SUBMISSION_STATUS,
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
    gotoFloor(targetFloor) {
      this.$router.push({ query: { floor: targetFloor } })
      this.$emit('refetch-floor')
    },
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.newComment = { ...this.newComment, code: this.defaultCode }
    },
    closeSelectedComment() {
      this.$emit('fetch-submission')
      this.$router.replace({ query: null })
      this.$emit('refetch-floor')
    },
    async deleteSelectedComment() {
      const result = window.confirm('確認要刪除創作嗎？')
      if (!result) return
      try {
        await this.deleteReply(this.comment.id)
        this.$router.replace({ query: null })
        this.$emit('refetch-floor')
      } catch (error) {
        this.$alertFail('刪除失敗。')
      }
    },
    async getReplies() {
      const commentReplies = this.comment.replies.slice()
      await Promise.all(commentReplies.map((cid, index, arr) => this.getReply(cid, index, arr)))
      this.replies = [...commentReplies]
    },
    async getReply(cid, index, arr) {
      try {
        const result = await agent.Comment.get(cid)
        arr[index] = { ...result.data.data, id: cid }
      } catch (error) {
        arr[index] = { status: 0, id: cid }
      }
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
      this.$emit('update-comment', this.comment.id, { ...this.comment, ...this.newComment })
    },
    submitTestSubmission() {
      this.$emit('submit-test-submission', this.newComment[this.COMMENT_KEY.CODE], 'detail')
    },
    submitNewSubmission() {
      this.$emit('submit-new-submission', this.comment.id, this.newComment[this.COMMENT_KEY.CODE])
      this.cancelEditComment(this.COMMENT_KEY.CODE)
    },
    checkIsDisableSubmitSubmission() {
      this.isDisableSubmitSubmission = !this.newComment[COMMENT_KEY.CODE]
    },
    gradeSubmission(value, sid) {
      this.$emit('grade-submission', sid, value, this.comment.id)
    },
    likeComment() {
      this.$emit('like-comment', this.comment.id)
    },
    async handleSubmitReply() {
      try {
        await this.submitReply(this.comment.id, this.newReply)
        this.newReply = ''
        this.isReply = false
      } catch (error) {
        this.$alertFail('新增留言失敗。')
      }
    },
  },

  mounted() {
    this.subscribeRefetch(this.comment.id)
  },

  destroyed() {
    this.unsubscribeRefetch(this.comment.id)
  },
}
</script>
