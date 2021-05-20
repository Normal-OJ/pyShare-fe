<template>
  <v-fade-transition>
    <Spinner v-if="isLoading" />
    <div class="pa-4" v-else>
      <Challenge v-if="prob" :prob="prob" />
    </div>
  </v-fade-transition>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import Challenge from '@/components/Course/Challenge/Challenge'
import agent from '@/api/agent'
import { mapState } from 'vuex'
import { GET_COURSE_PROBLEMS } from '@/store/actions.type'

export default {
  components: { Spinner, Challenge },
  data: () => ({
    isLoading: true,
  }),
  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
    pid() {
      return Number(this.$route.params.pid)
    },
  },
  watch: {
    async pid() {
      this.isLoading = true
      this.getProblem(this.pid).then(() => (this.isLoading = false))
    },
  },
  async created() {
    await this.getProblem(this.pid)
    this.$store.dispatch(GET_COURSE_PROBLEMS, this.prob.course)
    this.isLoading = false
  },
  methods: {
    async getProblem(pid) {
      try {
        const { data } = await agent.Problem.get(pid)
        this.prob = data.data
        if (this.prob.extra._cls !== 'OJProblem') {
          throw new Error()
        }
      } catch (error) {
        console.log('[views/Challenge/getProblem] error', error)
        alert('題目不存在')
        this.$router.push({ name: 'courseChallenges' })
        throw error
      }
    },
  },
}
</script>

<style></style>
