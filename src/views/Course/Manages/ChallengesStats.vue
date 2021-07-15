<template>
  <v-container fluid>
    <div class="text-h5">測驗統計</div>
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
import { mapActions, mapGetters } from 'vuex'
import agent from '@/api/agent'
import ChallengesStats from '@/components/Course/Manages/ChallengesStats.vue'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { ChallengesStats },
  data: () => ({
    stats: null,
    search: '',
  }),
  computed: {
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
    this.stats = (await agent.Course.getOJStats(this.$route.params.id, this.pids.join())).data.data
  },
  methods: {
    ...mapActions({
      getProblem: ActionTypes.GET_PROBLEMS,
    }),
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
        console.log(a, b)
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
