<template>
  <SetProblems :prob="prob" @submit="handleSubmit" />
</template>

<script>
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapActions, mapGetters } from 'vuex'
import { GET_PROBLEM_BY_ID } from '@/store/getters.type'
import { GET_PROBLEMS } from '@/store/actions.type'
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
  attachments: [],
  defaultCode: '',
  isTemplace: true,
  allowMultipleComments: true,
}

export default {
  components: { SetProblems },

  computed: {
    ...mapGetters({
      getProblemById: GET_PROBLEM_BY_ID,
    }),
    isEdit() {
      return this.$route.params.operation === OPERATION.EDIT
    },
    prob() {
      if (this.isEdit) {
        return this.getProblemById(this.$route.query.pid)
      }
      return { ...initialProb, course: this.$route.params.name }
    },
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
    }),
    async handleSubmit(body) {
      try {
        let result
        if (this.isEdit) {
          result = await agent.Problem.update(body.pid, body)
        } else {
          result = await agent.Problem.create(body)
        }
        console.log(result)
        this.getProblems()
        // TODO: give feedback for successfully create
      } catch (error) {
        // TODO: setError
      }
    },
  },
}
</script>
