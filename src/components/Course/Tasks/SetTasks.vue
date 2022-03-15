<template>
  <v-container
    fluid
    class="pb-16"
  >
    <v-row
      class="mb-4"
      no-gutters
    >
      <div class="text-h5">
        {{ isEdit ? '編輯任務' : '新增任務' }}
      </div>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="newTask.title"
          label="任務名稱（必填）"
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-row align="start">
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-menu
          ref="startsAtDateMenu"
          v-model="startsAtDateMenu"
          :close-on-content-click="false"
          :return-value.sync="newTask.startsAtDate"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="newTask.startsAtDate"
              label="選擇開始日期"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="newTask.startsAtDate"
            no-title
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="startsAtDateMenu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.startsAtDateMenu.save(newTask.startsAtDate)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-menu
          ref="startsAtTimeMenu"
          v-model="startsAtTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="newTask.startsAtTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="newTask.startsAtTime"
              label="選擇開始時間"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            v-if="startsAtTimeMenu"
            v-model="newTask.startsAtTime"
            full-width
            @click:minute="$refs.startsAtTimeMenu.save(newTask.startsAtTime)"
          />
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-menu
          ref="endsAtDateMenu"
          v-model="endsAtDateMenu"
          :close-on-content-click="false"
          :return-value.sync="newTask.endsAtDate"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="newTask.endsAtDate"
              label="選擇結束日期"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="newTask.endsAtDate"
            no-title
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="endsAtDateMenu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.endsAtDateMenu.save(newTask.endsAtDate)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-menu
          ref="endsAtTimeMenu"
          v-model="endsAtTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="newTask.endsAtTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="newTask.endsAtTime"
              label="選擇結束時間"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            v-if="endsAtTimeMenu"
            v-model="newTask.endsAtTime"
            full-width
            @click:minute="$refs.endsAtTimeMenu.save(newTask.endsAtTime)"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      align="center"
      class="my-2"
    >
      <div class="text-h6 mr-4">
        子任務
      </div>
      <v-btn
        color="primary"
        outlined
        x-small
        icon
        @click="createReq"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <v-row
      v-for="(req, index) in newTask.requirements"
      :key="req.key"
      no-gutters
      align="baseline"
    >
      <v-col
        v-if="req.willDelete"
        cols="auto"
      >
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="primary"
              small
              v-bind="attrs"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span>刪除的子任務會在使用者按下「更新任務」時執行刪除動作。</span>
        </v-tooltip>
        待刪除
      </v-col>
      <v-col
        cols="3"
        class="px-1"
      >
        <v-select
          v-model="newTask.requirements[index].type"
          label="類型"
          outlined
          dense
          :readonly="newTask.requirements[index].readonly"
          :items="requirementTypes"
        />
      </v-col>
      <v-col
        v-if="newTask.requirements[index].type === REQ_TYPE.SOLVE_OJ_PROBLEM"
        cols="3"
        class="px-1"
      >
        <v-select
          v-model="newTask.requirements[index].problems"
          label="指定測驗"
          :items="challenges"
          outlined
          dense
          :item-text="item => `${item.pid} - ${item.title}`"
          item-value="pid"
          :readonly="newTask.requirements[index].readonly"
        />
      </v-col>
      <v-col
        v-if="newTask.requirements[index].type === REQ_TYPE.LEAVE_COMMENT"
        cols="3"
        class="px-1"
      >
        <v-select
          v-model="newTask.requirements[index].problem"
          label="指定主題"
          :items="problems"
          outlined
          dense
          :item-text="item => `${item.pid} - ${item.title}`"
          item-value="pid"
          :readonly="newTask.requirements[index].readonly"
        />
      </v-col>
      <v-col
        v-if="newTask.requirements[index].type !== REQ_TYPE.SOLVE_OJ_PROBLEM"
        cols="1"
        class="px-1"
      >
        <v-text-field
          v-model.number="newTask.requirements[index].requiredNumber"
          label="指定數量"
          outlined
          dense
          placeholder="填入數字"
          :readonly="newTask.requirements[index].readonly"
        />
      </v-col>
      <v-col
        v-if="newTask.requirements[index].sync != null"
        cols="auto"
        class="px-1"
      >
        <v-checkbox
          v-model="newTask.requirements[index].sync"
          class="pt-0 mt-0"
          hide-details
          v-on="on"
        >
          <template #label>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small>
                    mdi-help-circle
                  </v-icon>
                  溯及既往
                </div>
              </template>
              <span>若勾選，將會連開始時間前的繳交紀錄一併計算</span>
            </v-tooltip>
          </template>
        </v-checkbox>
      </v-col>
      <v-col
        cols="auto"
        class="px-1"
      >
        <v-btn
          small
          text
          color="error"
          @click="deleteReq(index)"
        >
          {{ req.willDelete ? '復原' : '移除' }}
        </v-btn>
        <v-tooltip
          right
          :disabled="!newTask.requirements[index].readonly"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              v-if="newTask.requirements[index].readonly"
              color="gray"
              v-bind="attrs"
              v-on="on"
            >
              mdi-alert-circle
            </v-icon>
          </template>
          <span>已建立的子任務無法編輯，但可以刪除後另新增新子任務</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <div class="mt-8 d-flex">
      <v-btn
        class="mr-3"
        color="success"
        :loading="isLoading"
        :disabled="newTask.title === '' || newTask.requirements.length === 0"
        @click="submit"
      >
        {{ isEdit ? '更新' : '上傳' }}任務
      </v-btn>
      <v-spacer />
      <v-btn
        class="mr-3"
        color="primary"
        outlined
        @click="goBack()"
      >
        取消
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import _ from 'lodash'
import { REQ_TYPE, INIT_REQUIREMENT } from '@/constants/task'

export default {
  name: 'SetTasks',

  props: {
    task: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    problems: {
      type: Array,
      required: true,
    },
    challenges: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    REQ_TYPE,
    status: [
      { text: '顯示', value: 1 },
      { text: '隱藏', value: 0 },
    ],
    requirementTypes: [
      { text: '完成指定測驗', value: REQ_TYPE.SOLVE_OJ_PROBLEM },
      { text: '建立創作', value: REQ_TYPE.LEAVE_COMMENT },
      { text: '於創作下留言', value: REQ_TYPE.REPLY_TO_COMMENT },
      { text: '於創作按愛心', value: REQ_TYPE.LIKE_OTHERS_COMMENT },
    ],
    cnt: 2,
    newTask: {},
    startsAtDateMenu: false,
    startsAtTimeMenu: false,
    endsAtDateMenu: false,
    endsAtTimeMenu: false,
  }),

  watch: {
    task: {
      handler() {
        this.newTask = _.cloneDeep(this.task)
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    submit() {
      this.$emit('submit', this.newTask)
    },
    goBack() {
      this.$router.push({ name: 'courseTasks' })
    },
    createReq() {
      this.newTask.requirements.push({
        key: this.cnt,
        ...INIT_REQUIREMENT,
      })
      this.cnt += 1
    },
    deleteReq(index) {
      if (this.isEdit) {
        this.$set(this.newTask.requirements, index, {
          ...this.newTask.requirements[index],
          willDelete: !this.newTask.requirements[index].willDelete,
        })
      } else {
        this.newTask.requirements.splice(index, 1)
      }
    },
    deleteTask() {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-task', this.task.tid)
      }
    },
  },
}
</script>
