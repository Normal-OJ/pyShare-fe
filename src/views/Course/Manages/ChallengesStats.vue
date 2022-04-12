<template>
  <v-container fluid>
    <div class="d-flex mb-4">
      <div class="text-h5">
        測驗統計
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        @click="downloadStats"
      >
        <v-icon class="mr-1">
          mdi-download
        </v-icon>
        匯出統計資料
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="Number(-1)"
      :custom-sort="customSort"
      :search="search"
      :loading="loading"
      hide-default-footer
    >
      <template #item="{ item }">
        <tr :data-id="item.info.id">
          <v-tooltip left>
            <template #activator="{ on, attr }">
              <td
                v-bind="attr"
                v-on="on"
              >
                <router-link :to="{ name: 'profile', params: { id: item.info.id } }">
                  {{ item.info.displayName }}
                </router-link>
              </td>
            </template>
            <span>{{ item.info.username }}</span>
          </v-tooltip>

          <td
            v-for="pid in pids"
            :key="pid"
            class="pa-0"
          >
            <ChallengesStats
              :user="item.info"
              :pid="pid"
              :data="item[pid]"
            />
          </td>

          <td>
            {{ item.overview.acCount }}<span class="text-caption">{{ `/${pids.length}` }}</span>
          </td>
          <td>
            {{ item.overview.tryCount }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { GetterTypes } from '@/store/getter-types'
import { mapActions, mapGetters, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { downloadFile } from '@/lib/utils'

export default {
  data: () => ({
    stats: null,
    search: '',
    loading: true,
  }),
  computed: {
    ...mapState({
      courseName: (state) => state.course.courseInfo.name,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
    }),
    pids() {
      return this.challenges.map((c) => c.pid)
    },
    paramsWithCourse() {
      return { course: this.$route.params.id }
    },
    headers() {
      return [
        { text: '成員 \\ 題號', value: 'username', width: '120px' },
        ...this.pids.map((pid) => ({ text: pid, value: pid, width: '75px' })),
        { text: '完成題數', value: 'acCount', width: '120px' },
        { text: '繳交次數', value: 'tryCount', width: '120px' },
      ]
    },
    items() {
      if (!this.stats) return []
      return this.stats.users
    },
  },
  async created() {
    await this.getProblem(this.paramsWithCourse)
    if (Array.isArray(this.pids) && this.pids.length > 0) {
      this.stats = (
        await this.$agent.Course.getOJStats(this.$route.params.id, this.pids.join())
      ).data.data
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      getProblem: ActionTypes.GET_PROBLEMS,
    }),
    downloadData() {
      const csvHeader = this.headers.map((h) => h.text).join(',')
      const csvBody = this.items
        .map((item) => {
          const row = []
          this.pids.forEach((pid) => {
            row.push(`${item[pid].result === 0 ? '通過' : '未通過'}(${item[pid].tryCount})`)
          })
          return [
            `${item.info.displayName}(${item.info.username})`,
            ...row,
            `${item.overview.acCount}/${this.pids.length}`,
            `${item.overview.tryCount}`,
          ].join(',')
        })
        .join('\n')
      return `${csvHeader}\n${csvBody}`
    },
    downloadStats() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.downloadData()
      downloadFile(`${this.courseName}_測驗統計.csv`, csvContent)
    },
    customSort(items, index, isDesc) {
      if (index && index.length < 1) return items
      items.sort((a, b) => {
        if (index[0] === 'username') {
          a = a['info'][index[0]]
          b = b['info'][index[0]]
        } else if (typeof index[0] === 'number') {
          a = a[index[0]]['result']
          b = b[index[0]]['result']
        } else {
          a = a['overview'][index[0]]
          b = b['overview'][index[0]]
        }
        if (!isDesc[0]) {
          return a < b ? -1 : 1
        } else {
          return b < a ? -1 : 1
        }
      })
      return items
    },
  },
}
</script>

<style scoped>
table > tbody > tr > td:nth-child(1),
table > thead > tr > th:nth-child(1) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 9998;
  background: white;
}
table > thead > tr > th:nth-child(1) {
  z-index: 9999;
}
</style>
