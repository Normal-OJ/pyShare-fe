<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div class="pa-4" v-else>
      <Problem v-if="prob" :prob="prob" />
      <v-divider />
      <div v-show="!floor">
        <CommentList
          :comments="comments"
          :isAllowMultipleComments="prob && prob.allowMultipleComments"
          @refetch-floor="fetchFloor"
          @change-filtered-comments="comments => (filteredComments = comments)"
        />
      </div>
      <NewComment
        v-if="floor && String(floor) === 'new'"
        :defaultCode="prob && prob.defaultCode"
        :testResult="testResult['new']"
        @refetch-floor="fetchFloor"
        @fetch-test-submission="fetchTestSubmission"
        @submit-test-submission="submitTestSubmission"
        @submit-new-comment="submitNewComment"
      />
      <CommentDetail
        v-else-if="floor && selectedComment.data"
        :previousFloor="previousFloor"
        :nextFloor="nextFloor"
        :comment="selectedComment.data"
        :defaultCode="prob && prob.defaultCode"
        :testResult="testResult['detail']"
        :username="username"
        :historySubmissions="historySubmissions"
        :setIsEdit="setIsEdit"
        :submitReply="submitReply"
        :deleteReply="deleteReply"
        @refetch-floor="fetchFloor"
        @update-comment="updateComment"
        @fetch-submission="fetchSubmission"
        @fetch-test-submission="fetchTestSubmission"
        @submit-test-submission="submitTestSubmission"
        @submit-new-submission="submitNewSubmission"
        @get-submissions="getSubmissions"
        @grade-submission="gradeSubmission"
        @like-comment="likeComment"
        @update-reply="updateReply"
        @delete-reply="deleteReply"
      />
      <div class="spacer" />
    </div>
  </v-fade-transition>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import CommentList from '@/components/Course/Problem/CommentList'
import CommentDetail from '@/components/Course/Problem/CommentDetail'
import NewComment from '@/components/Course/Problem/NewComment'
import { mapActions, mapGetters, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'
import Spinner from '@/components/UI/Spinner'

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail, NewComment, Spinner },

  data: () => ({
    prob: null,
    filteredComments: [],
    isLoading: true,
    isEdit: false,
    floor: null,
    testResult: {
      new: null,
      detail: null,
    },
    testResultSubmissionId: null,
    historySubmissions: [],
    unsubscribeProblem: null,
    unsubscribeComment: null,
  }),

  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
    ...mapGetters({
      comments: GetterTypes.COMMENTS,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
    selectedComment() {
      const idx = this.filteredComments.findIndex(c => String(c.floor) === String(this.floor))
      if (idx === -1) return { data: null, index: null }
      return { data: this.filteredComments[idx], index: idx }
    },
    previousFloor() {
      if (this.selectedComment.index === null) return null
      return this.selectedComment.index === 0
        ? null
        : this.filteredComments[this.selectedComment.index - 1].floor
    },
    nextFloor() {
      if (this.selectedComment.index === null) return null
      return this.selectedComment.index === this.filteredComments.length - 1
        ? null
        : this.filteredComments[this.selectedComment.index + 1].floor
    },
  },

  watch: {
    pid: {
      async handler(newVal) {
        if (this.unsubscribeProblem) {
          this.unsubscribeProblem()
          this.unsubscribeProblem = null
        }
        if (newVal) {
          this.unsubscribeProblem = this.subscribeRefetchComment(newVal)
        }
        this.isLoading = true
        await this.getProblem(this.pid)
        this.fetchFloor()
        this.isLoading = false
        this.$nextTick(() => {
          this.$vuetify.goTo(0)
        })
      },
      immediate: true,
    },
    selectedComment(newVal) {
      if (this.unsubscribeComment) {
        this.unsubscribeComment()
        this.unsubscribeComment = null
      }
      if (newVal.data) {
        this.unsubscribeComment = this.subscribeRefetchReply(newVal.data.id)
      }
    },
  },

  beforeDestroy() {
    if (this.unsubscribeProblem) this.unsubscribeProblem()
    if (this.unsubscribeComment) this.unsubscribeComment()
  },

  methods: {
    ...mapActions({
      getComments: ActionTypes.GET_COMMENTS,
    }),
    fetchFloor() {
      const { floor } = this.$route.query
      if (!floor) {
        this.floor = null
        return
      }
      if (floor !== 'new' && !this.comments.find(c => String(c.floor) === String(floor))) {
        this.$router.replace({ query: null })
        this.floor = null
        return
      }
      this.floor = floor
    },
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
      this.$agent.Submission.get(this.testResultSubmissionId).then(res => {
        this.testResult[source] = res.data.data
      })
    },
    async submitTestSubmission(code, source) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await this.$agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testResultSubmissionId = submissionId
        this.$agent.Submission.get(submissionId).then(res => {
          this.testResult[source] = res.data.data
        })
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    async submitNewComment(newComment) {
      const body = {
        target: 'problem',
        id: `${this.pid}`,
        ...newComment,
      }
      try {
        const { data } = await this.$agent.Comment.create(body)
        await this.getProblem(this.pid)
        this.$nextTick(() => {
          const { floor } = this.comments.find(comment => comment.id === data.data.id)
          this.$router.push({ query: { floor }, params: { submit: true } })
          this.fetchFloor()
        })
      } catch (error) {
        console.log('[views/Problem/submitNewComment] error', error)
        throw error
      }
    },
    async submitReply(id, content) {
      const body = { target: 'comment', id, content, title: '', code: '' }
      try {
        await this.$agent.Comment.create(body)
        await this.getProblem(this.pid)
        return true
      } catch (error) {
        console.log('[views/Problem/submitReply] error', error)
        throw error
      }
    },
    async submitNewSubmission(cid, code) {
      try {
        await this.$agent.Comment.createSubmission(cid, { code })
        await this.getProblem(this.pid)
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    async updateComment(cid, newComment) {
      try {
        await this.$agent.Comment.update(cid, newComment)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/updateComment] error', error)
        throw error
      }
    },
    getSubmissions(cid) {
      const comment = this.comments.find(comment => comment.id === cid)
      Promise.all(comment.submissions.map(sid => this.$agent.Submission.get(sid))).then(resp => {
        this.historySubmissions = resp.map((res, index) => ({
          ...res.data.data,
          id: comment.submissions[index],
        }))
      })
    },
    async gradeSubmission(sid, value, cid) {
      try {
        await this.$agent.Submission.grade(sid, Number(value))
        this.getSubmissions(cid)
      } catch (error) {
        console.log('[views/Problem/gradeSubmission] error', error)
        throw error
      }
    },
    async likeComment(cid) {
      try {
        await this.$agent.Comment.like(cid)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/likeComment] error', error)
        throw error
      }
    },
    async updateReply(cid, content) {
      const body = { title: '', content }
      try {
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
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/deleteReply] error', error)
        throw error
      }
    },
    setIsEdit(value) {
      this.isEdit = value
    },
    subscribeRefetchComment(pid) {
      this.$socket.emit('subscribe', {
        topic: 'COMMENT',
        id: `problem-${pid}`,
      })
      return () => {
        this.$socket.emit('unsubscribe', {
          topic: 'COMMENT',
          id: `problem-${pid}`,
        })
      }
    },
    subscribeRefetchReply(cid) {
      this.$socket.emit('subscribe', {
        topic: 'COMMENT',
        id: `comment-${cid}`,
      })
      return () => {
        this.$socket.emit('unsubscribe', {
          topic: 'COMMENT',
          id: `comment-${cid}`,
        })
      }
    },
    confirmLeave(to, from, next) {
      if (!this.floor) next()
      if ((this.floor === 'new' || this.isEdit) && !to.params.submit) {
        const answer = window.confirm('確定要離開嗎？未完成的編輯將不會儲存。')
        if (!answer) {
          next(false)
        } else {
          next()
        }
      } else {
        next()
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.confirmLeave(to, from, next)
  },
  beforeRouteLeave(to, from, next) {
    this.confirmLeave(to, from, next)
  },

  sockets: {
    refetch: function(data) {
      try {
        const target = data.id.split('-')[0]
        if (target === 'problem') {
          this.getProblem(this.pid)
        } else {
          this.getComments(this.prob.comments)
        }
      } catch (error) {
        console.log('[views/Problem/sockets] error', error)
        throw error
      }
    },
  },
}
</script>

<style scoped>
/* TODO: let Spacer as a component */
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
