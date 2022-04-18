<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div
      v-else
      class="pa-4"
    >
      <Problem
        v-if="prob"
        :prob="prob"
      />
      <v-divider />
      <div v-show="!floor">
        <CommentList
          :comments="comments"
          :is-allow-multiple-comments="prob && prob.allowMultipleComments"
          @change-filtered-comments="comments => (filteredComments = comments)"
        />
      </div>
      <NewComment
        v-if="floor && String(floor) === 'new'"
        :default-code="prob && prob.defaultCode"
        :test-result="testResult['new']"
        @fetch-test-submission="fetchTestSubmission"
        @submit-test-submission="submitTestSubmission"
        @submit-new-comment="submitNewComment"
      />
      <CommentDetail
        v-else-if="floor && selectedComment.data"
        :previous-floor="previousFloor"
        :next-floor="nextFloor"
        :comment="selectedComment.data"
        :default-code="prob && prob.defaultCode"
        :test-result="testResult['detail']"
        :history-submissions="historySubmissions"
        :is-editing.sync="isEditing"
        @fetch-submission="fetchSubmission"
        @fetch-test-submission="fetchTestSubmission"
        @submit-test-submission="submitTestSubmission"
        @submit-new-submission="submitNewSubmission"
        @get-submissions="getSubmissions"
        @grade-submission="gradeSubmission"
        @like-comment="likeComment"
        @update-comment="updateComment"
        @delete-comment="deleteComment"
        @submit-reply="submitReply"
        @update-reply="updateReply"
        @delete-reply="deleteReply"
      />
      <div class="spacer" />
    </div>
  </v-fade-transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'

export default {
  name: 'CourseProblem',

  beforeRouteUpdate(to, from, next) {
    this.confirmLeave(to, from, next)
  },
  beforeRouteLeave(to, from, next) {
    this.confirmLeave(to, from, next)
  },

  data: () => ({
    prob: null,
    filteredComments: [],
    isLoading: true,
    isEditing: false,
    testResult: {
      new: null,
      detail: null,
    },
    testResultSubmissionId: null,
    historySubmissions: [],
    // unsubscribeProblem: null,
    // unsubscribeComment: null,
  }),

  computed: {
    ...mapGetters({
      comments: GetterTypes.COMMENTS,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
    selectedComment() {
      const idx = this.filteredComments.findIndex((c) => String(c.floor) === String(this.floor))
      if (idx === -1) return { data: null, index: null }
      return { data: this.filteredComments[idx], index: idx }
    },
    previousFloor() {
      if (this.selectedComment.index === null) return null
      return this.selectedComment.index === 0 ?
        null :
        this.filteredComments[this.selectedComment.index - 1].floor
    },
    nextFloor() {
      if (this.selectedComment.index === null) return null
      return this.selectedComment.index === this.filteredComments.length - 1 ?
        null :
        this.filteredComments[this.selectedComment.index + 1].floor
    },
    floor() {
      return this.$route.query.floor
    },
  },

  watch: {
    pid: {
      async handler(newVal) {
        // if (this.unsubscribeProblem) {
        //   this.unsubscribeProblem()
        //   this.unsubscribeProblem = null
        // }
        // if (newVal) {
        //   this.unsubscribeProblem = this.subscribeRefetchComment(newVal)
        // }
        this.isLoading = true
        await this.getProblem(this.pid)
        this.isLoading = false
        this.$nextTick(() => {
          this.$vuetify.goTo(0)
        })
      },
      immediate: true,
    },
    selectedComment(newVal) {
      // if (this.unsubscribeComment) {
      //   this.unsubscribeComment()
      //   this.unsubscribeComment = null
      // }
      // if (newVal.data) {
      //   this.unsubscribeComment = this.subscribeRefetchReply(newVal.data.id)
      // }
    },
  },

  beforeDestroy() {
    // if (this.unsubscribeProblem) this.unsubscribeProblem()
    // if (this.unsubscribeComment) this.unsubscribeComment()
  },

  methods: {
    ...mapActions({
      getComments: ActionTypes.GET_COMMENTS,
    }),
    async getProblem(pid) {
      try {
        const { data } = await this.$agent.Problem.get(pid)
        this.prob = data.data
        if (this.prob.extra._cls === 'OJProblem') {
          throw new Error()
        }
        await this.getComments(data.data.comments)
      } catch (error) {
        console.log('[views/Problem/getProblem] error', error)
        alert('主題不存在')
        this.$router.push({ name: 'courseProblems' })
        throw error
      }
    },
    fetchSubmission() {
      this.getComments(this.prob.comments)
    },
    fetchTestSubmission(source) {
      this.$agent.Submission.get(this.testResultSubmissionId).then((res) => {
        this.testResult[source] = res.data.data
      })
    },
    async submitTestSubmission(code, source) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await this.$agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testResultSubmissionId = submissionId
        this.$agent.Submission.get(submissionId).then((res) => {
          this.testResult[source] = res.data.data
        })
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    async submitNewSubmission(cid, code) {
      try {
        await this.$agent.Comment.createSubmission(cid, { code })
        this.$alertSuccess('新增程式版本成功。')
        this.getComments(this.prob.comments)
      } catch (error) {
        this.$alertFail('新增程式版本失敗。')
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    getSubmissions(cid) {
      const comment = this.comments.find((comment) => comment.id === cid)
      Promise.all(
        comment.submissions.map((sid) => this.$agent.Submission.get(sid)))
        .then((resp) => {
          this.historySubmissions = resp.map((res, index) => ({
            ...res.data.data,
            id: comment.submissions[index],
          }))
        },
        )
    },
    async gradeSubmission(sid, value, cid) {
      try {
        await this.$agent.Submission.grade(sid, Number(value))
        this.$alertSuccess('批改程式成功。')
        this.getSubmissions(cid)
      } catch (error) {
        this.$alertFail('批改程式失敗。')
        console.log('[views/Problem/gradeSubmission] error', error)
        throw error
      }
    },
    async submitNewComment(newComment, cb) {
      try {
        const body = { target: 'problem', id: `${this.pid}`, ...newComment }
        const { data } = await this.$agent.Comment.create(body)
        this.$alertSuccess('新增創作成功。')
        await this.getProblem(this.pid)
        this.$nextTick(() => {
          const { floor } = this.comments.find((comment) => comment.id === data.data.id)
          this.$router.push({ query: { floor }, params: { noconfirm: true } })
        })
      } catch (error) {
        this.$alertFail('新增創作失敗。')
        console.log('[views/Problem/submitNewComment] error', error)
        throw error
      } finally {
        cb()
      }
    },
    async likeComment(cid) {
      try {
        await this.$agent.Comment.like(cid)
        this.getComments(this.prob.comments)
      } catch (error) {
        this.$alertFail('給予愛心失敗。')
        console.log('[views/Problem/likeComment] error', error)
        throw error
      }
    },
    async updateComment(cid, newComment) {
      try {
        await this.$agent.Comment.update(cid, newComment)
        this.$alertSuccess('編輯創作成功。')
        this.getComments(this.prob.comments)
      } catch (error) {
        this.$alertFail('編輯創作失敗。')
        console.log('[views/Problem/updateComment] error', error)
        throw error
      }
    },
    async deleteComment(cid) {
      try {
        await this.$agent.Comment.delete(cid)
        this.$alertSuccess('刪除創作成功。')
        this.$router.replace({ query: null })
        this.getComments(this.prob.comments)
      } catch (error) {
        this.$alertFail('刪除創作失敗。')
        console.log('[views/Problem/deleteComment] error', error)
        throw error
      }
    },
    async submitReply(id, content, callback) {
      try {
        const body = { target: 'comment', id, content, title: '', code: '' }
        await this.$agent.Comment.create(body)
        this.$alertSuccess('新增留言成功。')
        callback()
        this.getProblem(this.pid)
      } catch (error) {
        this.$alertFail('新增留言失敗。')
        console.log('[views/Problem/submitReply] error', error)
        throw error
      }
    },
    async updateReply(cid, content) {
      try {
        const body = { title: '', content }
        await this.$agent.Comment.update(cid, body)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/updateReply] error', error)
        throw error
      }
    },
    async deleteReply(cid) {
      try {
        await this.$agent.Comment.delete(cid)
        this.$alertSuccess('刪除留言成功。')
        this.getComments(this.prob.comments)
      } catch (error) {
        this.$alertFail('刪除留言失敗。')
        console.log('[views/Problem/deleteReply] error', error)
        throw error
      }
    },
    /**
     * return a Function that is to unsubscribe same event
     */
    subscribeRefetchComment(pid) {
      // this.$socket.emit('subscribe', {
      //   topic: 'COMMENT',
      //   id: `problem-${pid}`,
      // })
      // return () => {
      //   this.$socket.emit('unsubscribe', {
      //     topic: 'COMMENT',
      //     id: `problem-${pid}`,
      //   })
      // }
    },
    subscribeRefetchReply(cid) {
      // this.$socket.emit('subscribe', {
      //   topic: 'COMMENT',
      //   id: `comment-${cid}`,
      // })
      // return () => {
      //   this.$socket.emit('unsubscribe', {
      //     topic: 'COMMENT',
      //     id: `comment-${cid}`,
      //   })
      // }
    },
    confirmLeave(to, from, next) {
      // 1. 新增創作/留言時，離開要詢問
      // 2. 編輯創作/留言時，離開要詢問
      // 3. 提交新創作時，離開不詢問
      if ((from.query.floor === 'new' || this.isEditing) && !to.params.noconfirm) {
        if (window.confirm('確定要離開嗎？未完成的編輯將不會儲存。')) next()
      } else {
        next()
      }
    },
  },

  // sockets: {
  //   refetch: function(data) {
  //     try {
  //       const target = data.id.split('-')[0]
  //       if (target === 'problem') {
  //         this.getProblem(this.pid)
  //       } else {
  //         this.getComments(this.prob.comments)
  //       }
  //     } catch (error) {
  //       console.log('[views/Problem/sockets] error', error)
  //       throw error
  //     }
  //   },
  // },
}
</script>

<style scoped>
.spacer {
  padding-bottom: 200px;
}
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: calc(100vh - 56px);
  position: fixed;
}
.container {
  flex: 1;
  overflow: scroll;
}
</style>
