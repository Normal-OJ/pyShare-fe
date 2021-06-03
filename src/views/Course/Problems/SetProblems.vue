<template>
  <SetProblems
    v-if="prob"
    :prob="prob"
    :tags="courseTags"
    :isEdit="isEdit"
    :isLoading="isLoading"
    @submit="handleSubmit"
    @delete-problem="deleteProblem"
  />
  <Spinner v-else />
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import SetProblems from '@/components/Course/Problems/SetProblems'
import { mapState } from 'vuex'
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
    }),
    isEdit() {
      return this.$route.params.operation === OPERATION.EDIT
    },
    courseId() {
      return this.$route.params.id
    },
    pid() {
      return this.$route.query.pid
    },
  },

  async created() {
    if (this.isEdit) await this.getProblem(this.pid)
    else {
      this.prob = { ...initialProb, course: this.courseId }
    }
  },

  data: () => ({
    submitSuccess: false,
    isLoading: false,
    prob: null,
  }),

  methods: {
    async getProblem(pid) {
      try {
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
      } catch (error) {
        console.log('[views/SetProblems/getProblem] error', error)
        throw error
      }
    },
    async handleSubmit(body, willAddAttachments, willRemoveAttachments) {
      try {
        this.isLoading = true
        let result
        if (this.isEdit) {
          result = await agent.Problem.update(this.pid, body)
        } else {
          result = await agent.Problem.create(body)
        }
        this.submitSuccess = true
        this.$alertSuccess(`${this.isEdit ? '更新' : '新增'}主題內容成功。`)
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
            this.$alertSuccess('新增主題附件成功。')
          } catch (error) {
            console.log('[views/SetProblems/handleSubmit - add attachments] error', error)
            this.$alertFail('新增主題附件失敗。')
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
            this.$alertSuccess('移除主題附件成功。')
          } catch (error) {
            console.log('[views/SetProblems/handleSubmit - remove attachments] error', error)
            this.$alertFail('移除主題附件失敗。')
            this.submitSuccess = false
            throw error
          }
        }
        this.getProblem(pid)
        if (this.submitSuccess) {
          if (!this.isEdit) {
            this.$router.push({
              name: 'courseProblems',
              params: { id: this.courseId },
            })
          } else {
            this.$router.push({
              name: 'courseProblem',
              params: { pid: pid },
            })
          }
        }
      } catch (error) {
        console.log('[views/SetProblems/handleSubmit] error', error)
        this.$alertFail(`${this.isEdit ? '更新' : '新增'}主題內容失敗。`)
        throw error
      }
      this.isLoading = false
    },
    async deleteProblem(pid) {
      try {
        await agent.Problem.delete(pid)
        this.submitSuccess = true
        this.$alertSuccess('刪除題目成功。')
        this.$router.push({ name: 'courseProblems', params: { id: this.courseId } })
      } catch (error) {
        console.log('[view/Course/Manages/ManageProblems] error', error)
        this.$alertFail('刪除題目失敗。')
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
