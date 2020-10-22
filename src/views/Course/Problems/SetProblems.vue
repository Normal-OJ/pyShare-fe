<template>
  <SetProblems :prob="prob" />
</template>

<script>
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapGetters } from 'vuex'
import { GET_PROBLEM_BY_ID } from '@/store/getters.type'
import agent from '@/api/agent'

const OPERATION = {
  NEW: 'new',
  EDIT: 'edit',
}
const initialProb = {
  title: '',
  description: '',
  tags: [],
  status: 1,
  author: {
    username: '',
    displayName: '',
  },
  content: '',
  attachments: [],
  defaultCode: '',
}

export default {
  components: { SetProblems },

  computed: {
    ...mapGetters({
      getProblemById: GET_PROBLEM_BY_ID,
    }),
    prob() {
      if (this.$route.params.operation === OPERATION.NEW) {
        return initialProb
      }
      return this.getProblemById(this.$route.query.pid)
    },
  },

  methods: {
    async submitCreateProblem(body) {
      try {
        const result = await agent.Problem.create(body)
        console.log(result)
        this.getCourse()
        // TODO: give feedback for successfully create
      } catch (error) {
        // TODO: setError
      }
    },
    // TODO: update Problem API call
  },
}
</script>
