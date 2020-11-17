<template>
  <SetProblems
    v-if="prob"
    :prob="prob"
    :tags="courseTags"
    :isEdit="isEdit"
    @submit="handleSubmit"
  />
  <Spinner v-else />
</template>

<script>
import Spinner from '@/components/Spinner'
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapActions, mapState } from 'vuex'
import { GET_PROBLEMS, GET_PROBLEM_INFO, GET_COURSE_TAGS } from '@/store/actions.type'
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
  components: { Spinner, SetProblems },

  computed: {
    ...mapState({
      courseTags: state => state.course.courseTags,
      problemInfo: state => state.problem.problemInfo,
    }),
    isEdit() {
      return this.$route.params.operation === OPERATION.EDIT
    },
    courseName() {
      return this.$route.params.name
    },
    pid() {
      return this.$route.query.pid
    },
    prob() {
      if (this.isEdit) return this.problemInfo
      return { ...initialProb, course: this.courseName }
    },
  },

  async created() {
    this.getCourseTags({ course: this.courseName })
    if (this.isEdit) await this.getProblemInfo(this.pid)
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
      getProblemInfo: GET_PROBLEM_INFO,
      getCourseTags: GET_COURSE_TAGS,
    }),
    async handleSubmit(body, willAddAttachments, willRemoveAttachments) {
      try {
        let result
        if (this.isEdit) {
          result = await agent.Problem.update(this.pid, body)
        } else {
          result = await agent.Problem.create(body)
        }
        // TODO: give feedback for successfully create
        alert('submit problem body success!')
        const pid = this.isEdit ? this.pid : result.data.data.pid
        if (willAddAttachments.length > 0) {
          await Promise.all(
            willAddAttachments.map(file => {
              const formData = new FormData()
              formData.append('attachment', file)
              return agent.Problem.addAttachment(pid, formData)
            }),
          )
          alert('submit problem attachment success!')
        }
        if (willRemoveAttachments.length > 0) {
          await Promise.all(
            willRemoveAttachments.map(filename => {
              const formData = new FormData()
              formData.append('attachmentName', filename)
              return agent.Problem.removeAttachment(pid, formData)
            }),
          )
          alert('remove problem attachment success!')
        }
        this.getProblems()
        if (this.isEdit) this.getProblemInfo(pid)
        else {
          this.$router.push({
            name: 'courseSetProblems',
            params: { operation: 'edit' },
            query: { pid },
          })
        }
        // this.$router.push({ name: 'courseProblems' })
      } catch (error) {
        console.log('[views/SetProblems/handleSubmit] error', error)
        // TODO: setError
      }
    },
    // async removeAttachmentFromProb(filename) {
    //   try {
    //     const formData = new FormData()
    //     formData.append('attachmentName', filename)
    //     await agent.Problem.removeAttachment(this.pid, formData)
    //     alert('success!')
    //     this.getProblemInfo(this.pid)
    //   } catch (error) {
    //     console.log('[views/SetProblems/removeAttachmentFromProb] error', error)
    //   }
    // },
  },
}
</script>
