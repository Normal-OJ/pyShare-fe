<template>
  <SetProblems :prob="prob" :tags="courseTags" @submit="handleSubmit" />
</template>

<script>
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GET_PROBLEM_BY_ID } from '@/store/getters.type'
import { GET_PROBLEMS, GET_COURSE_TAGS } from '@/store/actions.type'
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
  isTemplate: false,
  allowMultipleComments: false,
}

export default {
  components: { SetProblems },

  computed: {
    ...mapState({
      courseTags: state => state.course.courseTags,
    }),
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
    courseName() {
      return this.$route.params.name
    },
  },

  created() {
    this.getCourseTags({ course: this.courseName })
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
      getCourseTags: GET_COURSE_TAGS,
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
        alert('success!')
        this.$router.push({ name: 'courseProblems' })
      } catch (error) {
        console.log('[views/SetProblems/handleSubmit] error', error)
        // TODO: setError
      }
    },
  },
}
</script>
