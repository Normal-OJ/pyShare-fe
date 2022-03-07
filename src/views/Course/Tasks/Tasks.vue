<template>
  <v-container fluid>
    <div class="d-flex align-center">
      <div class="text-h5">
        任務
      </div>
      <v-spacer />
      <template v-if="canWriteCourse">
        <!-- <v-btn
          color="primary"
          :to="{ name: 'courseManageTasks' }"
          class="mr-3"
          outlined
        >
          管理任務
        </v-btn> -->
        <v-btn
          color="success"
          :to="{ name: 'courseSetTasks', params: { operation: 'new' } }"
        >
          <v-icon class="mr-1">
            mdi-playlist-plus
          </v-icon>
          新增任務
        </v-btn>
      </template>
    </div>

    <template v-if="tasks">
      <v-card
        v-for="task in tasks"
        :key="task.id"
        class="mt-6"
        outlined
      >
        <v-list-item two-line>
          <v-list-item-content>
            <div class="mb-2 d-flex align-center">
              <v-chip
                class="text-overline text-no-wrap mr-4"
                small
                :color="task.color"
              >
                {{ task.status }}
              </v-chip>
              <span class="text-body-2">
                {{ $formattedTime(task.startsAt) }}
                {{ ' - ' }}
                {{ $formattedTime(task.endsAt) }}
              </span>
            </div>
            <v-list-item-title class="text-h6 mb-1">
              {{ task.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <task-detail-teacher-view
          v-if="canWriteCourse"
          :task="task"
        />
        <task-detail-student-view
          v-else
          :task="task"
        />
      </v-card>
    </template>
    <spinner v-else />
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import { canWriteCourseMixin } from '@/lib/permissionMixin'
import { REQ_TYPE } from '@/constants/task'

const REQ_LABEL = {
  [REQ_TYPE.SOLVE_OJ_PROBLEM]: (num) => `在測驗 ${num} 獲得 AC`,
  [REQ_TYPE.LEAVE_COMMENT]: (num, p, q, t) => {
    return `在主題 ${num} 下建立 ${q} 個創作` + (t ? '' : `（完成 ${p}/${q}）`)
  },
  [REQ_TYPE.REPLY_TO_COMMENT]: (num, p, q, t) => {
    return `在 ${num} 個創作下留言` + (t ? '' : `（完成 ${p}/${q}）`)
  },
  [REQ_TYPE.LIKE_OTHERS_COMMENT]: (num, p, q, t) => {
    return `給 ${num} 個創作按愛心` + (t ? '' : `（完成 ${p}/${q}）`)
  },
}

export default {
  mixins: [canWriteCourseMixin],

  data: () => ({
    tasks: null,
  }),

  watch: {
    canWriteCourse: {
      handler() {
        if (this.canWriteCourse != null) this.getTasks()
      },
      immediate: true,
    },
  },

  methods: {
    async getTasks() {
      try {
        let rawTasks = null
        if (this.canWriteCourse) {
          const resp = await this.$agent.Task.getProgressList(this.$route.params.id)
          rawTasks = resp.data.data
        } else {
          const resp = await this.$agent.Task.getList(this.$route.params.id)
          const tids = resp.data.data
          const resps = await Promise.all(tids.map(this.$agent.Task.get))
          rawTasks = resps.map((r) => r.data.data)
        }
        this.tasks = rawTasks.map((task) => {
          const { status, color } = this.getStatusLabelAndColor(
            task.startsAt,
            task.endsAt,
          )
          return { ...task, status, color }
        })
        Promise.all(this.tasks.map(this.getRequirement))
      } catch (error) {
        this.$alertFail('載入任務失敗')
        this.$rollbar.error('[views/CourseTasks/getTasks]', error)
      }
    },
    async getRequirement(task, index) {
      const resps = await Promise.all(
        task.requirements.map(this.$agent.Task.getReq),
      )
      const requirements = resps.map((resp) => ({
        ...resp.data.data,
        description: this.getRequirementDescription(resp.data.data),
      }))
      this.$set(this.tasks, index, { ...task, requirements })
    },
    getStatusLabelAndColor(startTime, endTime) {
      return dayjs().isAfter(dayjs(endTime)) ?
        { status: '已結束', color: 'gray' } :
        dayjs().isAfter(dayjs(startTime)) ?
          { status: '進行中', color: 'primary' } :
          { status: '未開始', color: 'gray' }
    },
    getRequirementDescription(req) {
      if (req._cls === REQ_TYPE.SOLVE_OJ_PROBLEM) {
        return REQ_LABEL[req._cls](req.problems[0])
      } else if (req._cls === REQ_TYPE.LEAVE_COMMENT) {
        return REQ_LABEL[req._cls](
          req.problem, req.progress[0], req.progress[1], this.canWriteCourse,
        )
      } else {
        return REQ_LABEL[req._cls](
          req.required_number, req.progress[0], req.progress[1], this.canWriteCourse,
        )
      }
    },
  },
}
</script>
