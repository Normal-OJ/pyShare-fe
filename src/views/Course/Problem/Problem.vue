<template>
  <v-container fluid>
    <v-row class="px-4">
      <v-col cols="12">
        <Problem v-if="prob" :prob="prob" />
      </v-col>
      <v-col cols="12">
        <CommentList v-if="!selectedCommentId" :comments="comments" />
        <CommentDetail v-else :comment="selectedComment" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import CommentList from '@/components/Course/Problem/CommentList'
import CommentDetail from '@/components/Course/Problem/CommentDetail'
import agent from '@/api/agent'

const comments = [
  {
    id: '1',
    title: '測試一下',
    floor: 3,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
  {
    id: '2',
    title: '測試一下',
    floor: 2,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
  {
    id: '3',
    title: '測試一下',
    floor: 1,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
]

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail },

  computed: {
    problem() {
      return this.prob
    },
    pid() {
      return this.$route.params.id
    },
    selectedCommentId() {
      const { selectedCommentId } = this.$route.query
      if (!selectedCommentId || !this.comments.find(c => c.id === selectedCommentId)) return null
      return selectedCommentId
    },
    selectedComment() {
      return this.comments.find(c => c.id === this.selectedCommentId)
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
  },
}
</script>
