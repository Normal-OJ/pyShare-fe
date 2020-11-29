<template>
  <v-container fluid>
    <div class="px-4">
      <div>
        <Problem v-if="prob" :prob="prob" />
      </div>
      <v-divider />
      <div>
        <CommentList v-if="!floor" :comments="comments" />
        <NewComment
          v-else-if="String(floor) === 'new'"
          :defaultCode="prob && prob.defaultCode"
          @submitTestSubmission="submitTestSubmission"
          @submitNewComment="submitNewComment"
        />
        <CommentDetail
          v-else-if="selectedComment"
          :comment="selectedComment"
          @updateComment="updateComment"
          @fetchSubmission="fetchSubmission"
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
import { mapActions, mapGetters } from 'vuex'
import { GET_COMMENTS } from '@/store/actions.type'
import { COMMENTS } from '@/store/getters.type'

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail, NewComment },

  computed: {
    ...mapGetters({
      comments: COMMENTS,
    }),
    pid() {
      return Number(this.$route.params.id)
    },
    floor() {
      const { floor } = this.$route.query
      if (!floor) return null
      if (floor !== 'new' && !this.comments.find(c => String(c.floor) === String(floor))) {
        this.$router.replace({ query: null })
      }
      return floor
    },
    selectedComment() {
      return this.comments.find(c => String(c.floor) === String(this.floor))
    },
  },

  created() {
    this.getProblem(this.pid)
  },

  data: () => ({
    prob: null,
  }),

  methods: {
    ...mapActions({
      getComments: GET_COMMENTS,
    }),
    async getProblem(pid) {
      try {
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
        await this.getComments(data.data.comments)
      } catch (error) {
        console.log('[views/Problem/getProblem] error', error)
      }
    },
    fetchSubmission() {
      this.getComments(this.prob.comments)
    },
    async submitTestSubmission(code) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await agent.Submission.createTest(body)
        console.log('[test submission]', data)
      } catch (error) {
        console.log('[views/Problem/submitTestSubmission] error', error)
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
        })
      } catch (error) {
        console.log('[views/Problem/submitNewComment] error', error)
      }
    },
    async updateComment(cid, newComment) {
      try {
        await agent.Comment.update(cid, newComment)
        this.getComments(this.prob.comments)
      } catch (error) {
        console.log('[views/Problem/updateComment] error', error)
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
</style>
