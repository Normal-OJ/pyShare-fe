<template>
  <SetProblems
    v-if="prob"
    :prob="prob"
    :tags="courseTags"
    :isEdit="isEdit"
    @submit="handleSubmit"
    @delete-problem="deleteProblem"
  />
  <Spinner v-else />
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { GET_PROBLEMS, GET_PROBLEM_INFO, GET_COURSE_TAGS } from '@/store/actions.type'
import { USER } from '@/store/getters.type'
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
  attachments: [],
  defaultCode: '',
  isTemplate: false,
  allowMultipleComments: true,
}

export default {
  components: { Spinner, SetProblems },

  computed: {
    ...mapState({
      courseTags: state => state.course.courseTags,
      problemInfo: state => state.problem.problemInfo,
    }),
    ...mapGetters({
      user: USER,
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
      return { ...initialProb, course: this.courseName, author: this.user }
    },
  },

  async created() {
    this.getCourseTags({ course: this.courseName })
    if (this.isEdit) await this.getProblemInfo(this.pid)
  },

  data: () => ({
    submitSuccess: false,
  }),

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
        this.submitSuccess = true
        alert(`${this.isEdit ? '更新' : '新增'}主題內容成功。`)
        const pid = this.isEdit ? this.pid : result.data.data.pid
        if (willAddAttachments.length > 0) {
          try {
            await Promise.all(
              willAddAttachments.map(file => {
                const formData = new FormData()
                formData.append('attachment', file)
                formData.append('attachmentName', file.name)
                return agent.Problem.addAttachment(pid, formData)
              }),
            )
            alert('新增主題附件成功。')
          } catch (error) {
            console.log('[views/SetProblems/handleSubmit - add attachments] error', error)
            alert('新增主題附件失敗。')
            this.submitSuccess = false
            throw error
          }
        }
        if (willRemoveAttachments.length > 0) {
          try {
            await Promise.all(
              willRemoveAttachments.map(filename => {
                const formData = new FormData()
                formData.append('attachmentName', filename)
                return agent.Problem.removeAttachment(pid, formData)
              }),
            )
            alert('移除主題附件成功。')
          } catch (error) {
            console.log('[views/SetProblems/handleSubmit - remove attachments] error', error)
            alert('移除主題附件失敗。')
            this.submitSuccess = false
            throw error
          }
        }
        this.getProblemInfo(pid)
        if (this.submitSuccess) {
          if (!this.isEdit) {
            this.$router.push({
              name: 'courseProblems',
              params: { name: this.$route.params.name },
            })
          } else {
            this.$router.push({
              name: 'courseProblem',
              params: { name: this.$route.params.name, id: pid },
            })
          }
        }
      } catch (error) {
        console.log('[views/SetProblems/handleSubmit] error', error)
        alert(`${this.isEdit ? '更新' : '新增'}主題內容失敗。`)
        throw error
      }
    },
    async deleteProblem(pid) {
      try {
        await agent.Problem.delete(pid)
        this.submitSuccess = true
        alert('刪除題目成功。')
        this.$router.push({ name: 'courseProblems' })
      } catch (error) {
        console.log('[view/Course/Manages/ManageProblems] error', error)
        alert('刪除題目失敗。')
        throw error
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.submitSuccess) next()
    else {
      const answer = window.confirm('確定要離開嗎？未完成的編輯將不會儲存。')
      if (answer) {
        next()
      } else {
        next(false)
      }
    }
  },
}
</script>
