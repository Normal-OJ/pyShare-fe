<template>
  <v-container fluid>
    <div class="text-h5">測驗統計</div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="Number(-1)"
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr :data-id="item.id">
          <v-tooltip left>
            <template v-slot:activator="{ on, attr }">
              <td v-on="on" v-bind="attr">
                <router-link :to="{ name: 'profile', params: { id: item.id } }">
                  {{ item.displayName }}
                </router-link>
              </td>
            </template>
            <span>{{ item.username }}</span>
          </v-tooltip>

          <td v-for="pid in pids" :key="pid" class="pa-0">
            <ChallengesStats :data="data[item.id] && data[item.id][pid]" />
          </td>
        </tr>
      </template>
    </v-data-table>

    <table class="mt-4">
      <thead>
        <tr>
          <th>
            成員 \ 題號
          </th>
          <template v-for="chal in challenges">
            <v-tooltip top :key="chal.pid">
              <template v-slot:activator="{ on, attr }">
                <th v-on="on" v-bind="attr">
                  <router-link :to="{ name: 'courseChallenge', params: { pid: chal.pid } }">
                    {{ chal.pid }}
                  </router-link>
                </th>
              </template>
              <span>{{ chal.title }}</span>
            </v-tooltip>
          </template>
        </tr>
      </thead>
      <tbody v-if="data">
        <tr v-for="member in members" :key="member.id">
          <v-tooltip left>
            <template v-slot:activator="{ on, attr }">
              <td v-on="on" v-bind="attr">
                <router-link :to="{ name: 'profile', params: { id: member.id } }">
                  {{ member.displayName }}
                </router-link>
              </td>
            </template>
            <span>{{ member.username }}</span>
          </v-tooltip>
          <td v-for="pid in pids" :key="pid" style="height: 20px">
            <ChallengesStats :data="data[member.id] && data[member.id][pid]" />
          </td>
        </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
import { GetterTypes } from '@/store/getter-types'
import { mapGetters, mapState } from 'vuex'
import agent from '@/api/agent'
import { ActionTypes } from '@/store/action-types'
import ChallengesStats from '@/components/Course/Manages/ChallengesStats.vue'
export default {
  components: { ChallengesStats },
  data: () => ({
    data: null,
  }),
  computed: {
    ...mapState({
      courseInfo: state => state.course.courseInfo,
    }),
    ...mapGetters({
      challenges: GetterTypes.CHALLENGES,
    }),
    pids() {
      return this.challenges.map(c => c.pid)
    },
    members() {
      if (!this.courseInfo) return []
      return this.courseInfo.students
    },
    paramsWithCourse() {
      return { course: this.$route.params.id }
    },
    headers() {
      return [
        { text: '成員 \\ 題號', value: 'username' },
        ...this.pids.map(pid => ({ text: pid, value: pid })),
      ]
    },
    items() {
      if (!this.data) return []
      return this.members.map(member => ({
        ...member,
        ...Object.fromEntries(
          this.pids.map(pid => [pid, this.data[member.id] ? this.data[member.id][pid] : null]),
        ),
      }))
    },
  },
  async created() {
    await this.$store.dispatch(ActionTypes.GET_PROBLEMS, this.paramsWithCourse)
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const data = {}
      const chalComments = await Promise.all(
        this.challenges.map(chal => this.getComments(chal.pid, chal.comments)),
      )
      chalComments.forEach(chal => {
        const { pid, comments } = chal
        comments.forEach(comment => {
          if (!data[comment.author.id]) data[comment.author.id] = {}
          data[comment.author.id][pid] = comment
        })
      })
      this.data = data
    },
    async getComments(pid, comments) {
      const reqs = comments.map(cid => agent.Comment.get(cid))
      const resps = await Promise.all(reqs)
      return { pid, comments: resps.map(resp => resp.data.data) }
    },
  },
}
</script>

<style scoped></style>
