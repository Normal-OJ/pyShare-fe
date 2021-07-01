<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>
              成員 \ 題號
            </th>
            <th v-for="chal in challenges" :key="chal.pid">
              {{ chal.pid }}
            </th>
          </tr>
        </thead>
        <tbody v-if="data">
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.displayName }}</td>
            <td v-for="pid in pids" :key="pid">
              <ChallengesStats :data="data[member.id][pid]" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
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
