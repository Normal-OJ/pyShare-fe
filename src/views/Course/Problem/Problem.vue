<template>
  <v-container fluid>
    <Spinner v-if="isWaiting" />
    <div class="px-4" v-show="!isWaiting">
      <div>
        <Problem v-if="prob" :prob="prob" />
      </div>
      <v-divider />
      <div>
        <CommentList
          v-if="!floor"
          :comments="comments"
          :isAllowMultipleComments="prob && prob.allowMultipleComments"
          @refetchFloor="fetchFloor"
        />
        <NewComment
          v-else-if="String(floor) === 'new'"
          :defaultCode="prob && prob.defaultCode"
          :testResult="testResult['new']"
          @refetchFloor="fetchFloor"
          @fetchTestSubmission="fetchTestSubmission"
          @submitTestSubmission="submitTestSubmission"
          @submitNewComment="submitNewComment"
        />
        <CommentDetail
          v-else-if="selectedComment"
          :comment="selectedComment"
          :defaultCode="prob && prob.defaultCode"
          :testResult="testResult['detail']"
          :username="username"
          :historySubmissions="historySubmissions"
          :setIsEdit="setIsEdit"
          @refetchFloor="fetchFloor"
          @updateComment="updateComment"
          @fetchSubmission="fetchSubmission"
          @fetchTestSubmission="fetchTestSubmission"
          @submitTestSubmission="submitTestSubmission"
          @submitNewSubmission="submitNewSubmission"
          @getSubmissions="getSubmissions"
          @gradeSubmission="gradeSubmission"
          @like-comment="likeComment"
          @submitReply="submitReply"
          @update-reply="updateReply"
          @delete-reply="deleteReply"
        />
      </div>
      <div class="spacer" />
    </div>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import CommentList from '@/components/Course/Problem/CommentList'
import CommentDetail from '@/components/Course/Problem/CommentDetail'
import NewComment from '@/components/Course/Problem/NewComment'
import agent from '@/api/agent'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GET_COMMENTS } from '@/store/actions.type'
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
      return Number(this.$route.params.id)
    },
    selectedComment() {
      return this.comments.find(c => String(c.floor) === String(this.floor))
    },
  },

  async created() {
    await this.getProblem(this.pid)
    this.fetchFloor()
    this.isWaiting = false
  },

  data: () => ({
    prob: null,
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
}
</script>

<style scoped>
/* TODO: let Spacer as a component */
.spacer {
  padding-bottom: 200px;
}
</style>