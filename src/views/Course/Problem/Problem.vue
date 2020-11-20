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
          @submitTestSubmission="submitTestSubmission"
          @submitNewComment="submitNewComment"
        />
        <CommentDetail v-else :comment="selectedComment" />
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
import { comments } from './fake'

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail, NewComment },

  computed: {
    problem: () => {
      return this.prob
    },
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
    comments,
    prob: null,
  }),

  methods: {
    async getProblem(pid) {
      try {
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
      } catch (error) {
        console.log('[views/Problem/getProblem] error', error)
      }
    },
    async submitTestSubmission(code) {
      const body = { problemId: this.pid, code }
      try {
        const { data } = await agent.Submission.createTest(body)
        alert(data.data)
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
        alert(data.data)
      } catch (error) {
        console.log('[views/Problem/submitNewComment] error', error)
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
