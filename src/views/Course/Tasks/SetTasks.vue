<template>
  <SetTasks
    v-if="task"
    :task="task"
    :is-edit="isEdit"
    :is-loading="isLoading"
    :problems="problems"
    :challenges="challenges"
    @submit="handleSubmit"
    @delete-task="deleteTask"
  />
  <Spinner v-else />
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { GetterTypes } from '@/store/getter-types'
import { INIT_REQUIREMENT } from '@/constants/task'

const OPERATION = {
  NEW: 'new',
  EDIT: 'edit',
}
const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm'
const initialTask = {
  title: `Task ${dayjs().format(dateFormat)}`,
  content: '',
  startsAtDate: dayjs().format(dateFormat),
  startsAtTime: dayjs().format(timeFormat),
  endsAtDate: dayjs()
    .add(7, 'day')
    .format(dateFormat),
  endsAtTime: dayjs().format(timeFormat),
  requirements: [
    {
      key: 1,
      ...INIT_REQUIREMENT,
    },
  ],
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
    task: null,
  }),

  computed: {
    ...mapGetters({
      problems: GetterTypes.PROBLEMS,
      challenges: GetterTypes.CHALLENGES,
    }),
    isEdit() {
      return this.$route.params.operation === OPERATION.EDIT
    },
    courseId() {
      return this.$route.params.id
    },
    tid() {
      return this.$route.query.tid
    },
  },

  created() {
    if (this.isEdit) this.getTask(this.tid)
    else this.task = { ...initialTask, course: this.courseId }
    this.$store.dispatch(ActionTypes.GET_PROBLEMS, { course: this.courseId })
  },

  methods: {
    async getTask(tid) {
      try {
        const { data } = await this.$agent.Task.get(tid)
        const requirements = await this.getRequirement(data.data)
        this.task = {
          ...data.data,
          requirements,
          startsAtDate: dayjs(data.data.startsAt).format(dateFormat),
          startsAtTime: dayjs(data.data.startsAt).format(timeFormat),
          endsAtDate: dayjs(data.data.endsAt).format(dateFormat),
          endsAtTime: dayjs(data.data.endsAt).format(timeFormat),
        }
      } catch (error) {
        console.log(error)
        this.$rollbar.error('[views/SetTasks/getTask]', error)
      }
    },
    async getRequirement(task) {
      const resps = await Promise.all(task.requirements.map(this.$agent.Task.getReq))
      const requirements = resps.map((resp) => {
        const req = resp.data.data
        if (req.problems != null) {
          req.problems = typeof req.problems === 'number' ? req.problems : req.problems[0]
        }
        return {
          ...req,
          type: req._cls,
          requiredNumber: req.required_number,
          readonly: true,
        }
      })
      return requirements
    },
    async handleSubmit(newTask) {
      try {
        this.isLoading = true
        const body = {
          ...newTask,
          startsAt: dayjs(newTask.startsAtDate + newTask.startsAtTime).toISOString(),
          endsAt: dayjs(newTask.endsAtDate + newTask.endsAtTime).toISOString(),
        }
        const result = await this.$agent.Task.create(body)
        const newId = result.data.data.id
        const requirementRequests = newTask.requirements.map((r) => ({
          type: r.type,
          body: {
            problems: typeof r.problems === 'number' ? [r.problems] : r.problems,
            problem: r.problem,
            requiredNumber: r.requiredNumber,
          },
        }))
        this.submitSuccess = true
        try {
          await Promise.all(
            requirementRequests.map(
              (r) => this.$agent.Task.createRequirement(newId, r.type, r.body),
            ),
          )
          this.$alertSuccess(`${this.isEdit ? '更新' : '新增'}任務內容成功。`)
          this.$router.push({
            name: 'courseTasks',
            params: { id: this.courseId },
          })
        } catch (error) {
          this.$alertFail(`${this.isEdit ? '更新' : '新增'}任務要求失敗。`)
          this.$rollbar.error('[views/SetTasks/handleSubmit/requirement]', error)
          this.$router.push({
            name: 'courseTasks',
            params: { id: this.courseId },
          })
          // this.$router.push({
          //   name: 'courseSetTasks',
          //   params: { id: this.courseId, operation: 'edit' },
          //   query: { tid: this.tid || newId },
          // })
        }
      } catch (error) {
        this.$alertFail(`${this.isEdit ? '更新' : '新增'}任務內容失敗。`)
        this.$rollbar.error('[views/SetTasks/handleSubmit]', error)
      } finally {
        this.isLoading = false
      }
    },
    deleteTask() {},
  },
}
</script>
