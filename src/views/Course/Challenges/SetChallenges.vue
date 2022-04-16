<template>
  <SetChallenges
    v-if="prob"
    :prob="prob"
    :tags="courseTags"
    :is-edit="isEdit"
    :is-loading="isLoading"
    @submit="handleSubmit"
    @delete-problem="deleteProblem"
  />
  <Spinner v-else />
</template>

<script>
import { mapState } from 'vuex'

const OPERATION = {
  NEW: 'new',
  EDIT: 'edit',
}
const initialProb = {
  title: '',
  description: '',
  tags: [],
  hidden: false,
  attachments: [],
  defaultCode: '',
  isTemplate: false,
  allowMultipleComments: false,
  extra: {
    _cls: 'OJProblem',
    input: '',
    output: '',
  },
}

export default {
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

  data: () => ({
    submitSuccess: false,
    isLoading: false,
    prob: null,
  }),

  computed: {
    ...mapState({
      courseTags: (state) => state.course.courseTags,
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

  created() {
    if (this.isEdit) this.getProblem(this.pid)
    else this.prob = { ...initialProb, course: this.courseId }
  },

  methods: {
    async getProblem(pid) {
      try {
        const { data: probData } = await this.$agent.Problem.get(pid)
        this.prob = probData.data
        if (this.prob.extra._cls !== 'OJProblem') {
          alert('此測驗不存在')
          this.$rollbar.error('[views/SetChallenges/getProblem] not OJProblem:', pid)
          this.$router.push({ name: 'courseManageChallenges' })
        }
        const { data: ioData } = await this.$agent.Problem.getIOFiles(pid)
        this.prob.extra = { ...this.prob.extra, ...ioData.data }
      } catch (error) {
        alert('讀取題目發生錯誤，請重新整理再試一次')
        this.$rollbar.error('[views/SetChallenges/getProblem]', error)
      }
    },
    async handleSubmit(body) {
      try {
        this.isLoading = true
        let result
        if (this.isEdit) {
          result = await this.$agent.Problem.update(this.pid, body)
        } else {
          result = await this.$agent.Problem.create(body)
        }
        this.submitSuccess = true
        this.$alertSuccess(`${this.isEdit ? '更新' : '新增'}測驗內容成功。`)
        const pid = this.isEdit ? this.pid : result.data.data.pid
        this.getProblem(pid)
        this.$router.push(
          !this.isEdit ?
            {
              name: 'courseChallenges',
              params: { id: this.courseId },
            } :
            {
              name: 'courseChallenge',
              params: { pid: pid },
            },
        )
      } catch (error) {
        this.$alertFail(`${this.isEdit ? '更新' : '新增'}測驗內容失敗。`)
        this.$rollbar.error('[views/SetChallenges/handleSubmit]', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteProblem(pid) {
      try {
        await this.$agent.Problem.delete(pid)
        this.submitSuccess = true
        this.$alertSuccess('刪除題目成功。')
        this.$router.push({ name: 'courseChallenges', params: { id: this.courseId } })
      } catch (error) {
        this.$alertFail('刪除題目失敗。')
        this.$rollbar.error('[views/SetChallenges/deleteProblem]', error)
      }
    },
  },
}
</script>
