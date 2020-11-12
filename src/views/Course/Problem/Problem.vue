<template>
  <v-container fluid>
    <div class="px-4">
      <div>
        <Problem v-if="prob" :prob="prob" />
      </div>
      <v-divider />
      <div>
        <CommentList v-if="!floor" :comments="comments" />
        <CommentDetail v-else :comment="selectedComment" />
      </div>
    </div>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import CommentList from '@/components/Course/Problem/CommentList'
import CommentDetail from '@/components/Course/Problem/CommentDetail'
import agent from '@/api/agent'

const comments = [
  {
    id: '3',
    title: '測試一下',
    floor: 3,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1, 2, 3],
    submission: {
      code: "print('hi')",
    },
    liked: [],
    created: 1605194262531,
    updated: 1605078260111,
    hasAccepted: true,
    replies: [],
  },
  {
    id: '2',
    title: '測試一下',
    floor: 2,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1, 2],
    submission: {
      code:
        "print('hi')\nprint('hi')\nprint('hi')\nprint('hi')\nprint('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')",
    },
    liked: [1, 2, 3],
    created: 1605194489981,
    updated: 1605194469881,
    hasAccepted: false,
    replies: [1, 2, 3, 4, 5, 6],
  },
  {
    id: '1',
    title: '測試一下',
    floor: 1,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1],
    submission: {
      code: "print('hi')",
    },
    liked: [1],
    created: 1603404000,
    updated: 1605078360,
    hasAccepted: true,
    replies: [],
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
    floor() {
      const { floor } = this.$route.query
      if (!floor) return null
      if (!this.comments.find(c => String(c.floor) === String(floor))) {
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
  },
}
</script>
