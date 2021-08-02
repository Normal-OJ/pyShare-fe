<template>
  <v-container fluid>
    <div class="d-flex">
      <div class="text-h5">測驗統計</div>
      <v-spacer />
      <v-btn color="primary" class="mr-3" @click="downloadStats">
        <v-icon class="mr-1">mdi-download</v-icon>
        匯出統計資料
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="Number(-1)"
      :customSort="customSort"
      :search="search"
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr :data-id="item.info.id">
          <v-tooltip left>
            <template v-slot:activator="{ on, attr }">
              <td v-on="on" v-bind="attr">
                <router-link :to="{ name: 'profile', params: { id: item.info.id } }">
                  {{ item.info.displayName }}
                </router-link>
              </td>
            </template>
            <span>{{ item.info.username }}</span>
          </v-tooltip>

          <td v-for="pid in pids" :key="pid" class="pa-0">
            <ChallengesStats :user="item.info" :pid="pid" :data="item[pid]" />
          </td>

          <td>
            {{ item.overview.acCount }}<span class="caption">{{ `/${pids.length}` }}</span>
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
import ChallengesStats from '@/components/Course/Manages/ChallengesStats.vue'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { ChallengesStats },
  data: () => ({
    stats: null,
    search: '',
  }),
  computed: {
    ...mapState({
      courseName: state => state.course.courseInfo.name,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
    }),
    pids() {
      return this.challenges.map(c => c.pid)
    },
    paramsWithCourse() {
      return { course: this.$route.params.id }
    },
    headers() {
      return [
        { text: '成員 \\ 題號', value: 'username' },
        ...this.pids.map(pid => ({ text: pid, value: pid })),
        { text: '完成題數', value: 'acCount' },
        { text: '繳交次數', value: 'tryCount' },
      ]
    },
    items() {
      if (!this.stats) return []
      return this.stats.users
    },
  },
  async created() {
    await this.getProblem(this.paramsWithCourse)
    this.stats = (
      await this.$agent.Course.getOJStats(this.$route.params.id, this.pids.join())
    ).data.data
  },
  methods: {
    ...mapActions({
      getProblem: ActionTypes.GET_PROBLEMS,
    }),
    downloadData() {
      const csvHeader = this.headers.map(h => h.text).join(',')
      const csvBody = this.items
        .map(item => {
          const row = []
          this.pids.forEach(pid => {
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
      const link = document.createElement('a')
      link.download = `${this.courseName}_測驗統計.csv`
      link.href = csvContent
      link.click()
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
