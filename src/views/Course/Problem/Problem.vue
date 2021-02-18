<template>
  <v-fade-transition>
    <Spinner v-if="isWaiting" />
    <div class="pa-4" v-else>
      <Problem v-if="prob" :prob="prob" />
      <v-divider />
      <CommentList
        v-if="!floor"
        :comments="comments"
        :isAllowMultipleComments="prob && prob.allowMultipleComments"
        :subscribeRefetch="subscribeRefetchComment"
        :unsubscribeRefetch="unsubscribeRefetchComment"
        @refetch-floor="fetchFloor"
      />
      <NewComment
        v-else-if="String(floor) === 'new'"
        :defaultCode="prob && prob.defaultCode"
        :testResult="testResult['new']"
        @refetch-floor="fetchFloor"
        @fetch-test-submission="fetchTestSubmission"
        @submit-test-submission="submitTestSubmission"
        @submit-new-comment="submitNewComment"
      />
      <CommentDetail
        v-else-if="selectedComment"
        :previousFloor="previousFloor"
        :nextFloor="nextFloor"
        :comment="selectedComment"
        :defaultCode="prob && prob.defaultCode"
        :testResult="testResult['detail']"
        :username="username"
        :historySubmissions="historySubmissions"
        :setIsEdit="setIsEdit"
        :submitReply="submitReply"
        :deleteReply="deleteReply"
        :subscribeRefetch="subscribeRefetchReply"
        :unsubscribeRefetch="unsubscribeRefetchReply"
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
import agent from '@/api/agent'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GET_COMMENTS, GET_COURSE_PROBLEMS } from '@/store/actions.type'
import { COMMENTS } from '@/store/getters.type'
import Spinner from '@/components/UI/Spinner'

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail, NewComment, Spinner },

  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
    ...mapGetters({
      comments: COMMENTS,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
    selectedComment() {
      return this.comments.find(c => String(c.floor) === String(this.floor))
    },
    selectedCommentIndex() {
      return this.comments.findIndex(c => String(c.floor) === String(this.floor))
    },
    previousFloor() {
      return this.selectedCommentIndex === 0
        ? null
        : this.comments[this.selectedCommentIndex - 1].floor
    },
    nextFloor() {
      return this.selectedCommentIndex === this.comments.length - 1
        ? null
        : this.comments[this.selectedCommentIndex + 1].floor
    },
  },

  watch: {
    async pid() {
      this.isWaiting = true
      await this.getProblem(this.pid)
      this.fetchFloor()
      this.isWaiting = false
    },
  },

  async created() {
    await this.getProblem(this.pid)
    this.$store.dispatch(GET_COURSE_PROBLEMS, this.prob.course)
    this.fetchFloor()
    this.isWaiting = false
  },

  data: () => ({
    prob: null,
    courseInfo: null,
    isWaiting: true,
    isEdit: false,
    floor: null,
    testResult: {
      new: null,
      detail: null,
    },
    testResultSubmissionId: null,
    historySubmissions: [],
  }),

  methods: {
    ...mapActions({
      getComments: GET_COMMENTS,
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
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
        await this.getComments(data.data.comments)
      } catch (error) {
        console.log('[views/Problem/getProblem] error', error)
        throw error
      }
    },
    fetchSubmission() {
      this.getComments(this.prob.comments)
    },
    fetchTestSubmission(source) {
      agent.Submission.get(this.testResultSubmissionId).then(res => {
        this.testResult[source] = res.data.data
      })
    },
    async submitTestSubmission(code, source) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await agent.Submission.createTest(body)
        const { submissionId } = data.data
        this.testResultSubmissionId = submissionId
        agent.Submission.get(submissionId).then(res => {
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
        const { data } = await agent.Comment.create(body)
        await this.getProblem(this.pid)
        let that = this
        this.$nextTick(() => {
          const { floor } = that.comments.find(comment => comment.id === data.data.id)
          that.$router.push({ query: { floor } })
          that.fetchFloor()
        })
      } catch (error) {
        console.log('[views/Problem/submitNewComment] error', error)
        throw error
      }
    },
    async submitReply(id, content) {
      const body = { target: 'comment', id, content, title: '', code: '' }
      try {
        await agent.Comment.create(body)
        await this.getProblem(this.pid)
        return true
      } catch (error) {
        console.log('[views/Problem/submitReply] error', error)
        throw error
      }
    },
    async submitNewSubmission(cid, code) {
      try {
        await agent.Comment.createSubmission(cid, { code })
        await this.getProblem(this.pid)
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
        throw error
      }
    },
    async updateComment(cid, newComment) {
      try {
        await agent.Comment.update(cid, newComment)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/updateComment] error', error)
        throw error
      }
    },
    getSubmissions(cid) {
      const comment = this.comments.find(comment => comment.id === cid)
      Promise.all(comment.submissions.map(sid => agent.Submission.get(sid))).then(resp => {
        this.historySubmissions = resp.map((res, index) => ({
          ...res.data.data,
          id: comment.submissions[index],
        }))
      })
    },
    async gradeSubmission(sid, value, cid) {
      try {
        await agent.Submission.grade(sid, Number(value))
        this.getSubmissions(cid)
      } catch (error) {
        console.log('[views/Problem/gradeSubmission] error', error)
        throw error
      }
    },
    async likeComment(cid) {
      try {
        await agent.Comment.like(cid)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/likeComment] error', error)
        throw error
      }
    },
    async updateReply(cid, content) {
      const body = { title: '', content }
      try {
        await agent.Comment.update(cid, body)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/updateReply] error', error)
        throw error
      }
    },
    async deleteReply(cid) {
      try {
        await agent.Comment.delete(cid)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/deleteReply] error', error)
        throw error
      }
    },
    setIsEdit(value) {
      this.isEdit = value
    },
    subscribeRefetchComment() {
      this.$socket.emit('subscribe', {
        topic: 'COMMENT',
        id: `problem-${this.pid}`,
      })
    },
    unsubscribeRefetchComment() {
      this.$socket.emit('unsubscribe', {
        topic: 'COMMENT',
        id: `problem-${this.pid}`,
      })
    },
    subscribeRefetchReply(cid) {
      this.$socket.emit('subscribe', {
        topic: 'COMMENT',
        id: `comment-${cid}`,
      })
    },
    unsubscribeRefetchReply(cid) {
      this.$socket.emit('unsubscribe', {
        topic: 'COMMENT',
        id: `comment-${cid}`,
      })
    },
  },

  beforeRouteLeave(to, from, next) {
    if (!this.floor) next()
    if (this.floor === 'new' || this.isEdit) {
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

  sockets: {
    refetch: function(data) {
      try {
        const target = data.id.split('-')[0]
        if (target === 'problem') {
          this.getProblem(this.pid)
          this.$notify({
            group: 'notify',
            type: 'my-info',
            title: '創作列表更新',
            text: '有人新增、修改，或刪除了創作',
          })
        } else {
          this.getComments(this.prob.comments)
          this.$notify({
            group: 'notify',
            type: 'my-info',
            title: '留言列表更新',
            text: '有人新增、修改，或刪除了留言',
          })
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
