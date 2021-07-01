<template>
  <v-dialog v-if="data" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <div
        v-on="on"
        v-bind="attrs"
        class="d-flex justify-center align-center"
        :style="{ width: '30px', height: '30px', backgroundColor: cellColor }"
      >
        <pre v-if="data">{{ data.submissions.length }}</pre>
      </div>
    </template>
    <v-card class="pa-8">
      <ChallengeHistory :comment="data" />
    </v-card>
  </v-dialog>
</template>

<script>
import agent from '@/api/agent'
import ChallengeHistory from '../Challenge/ChallengeHistory.vue'

const AC = 0

export default {
  props: ['data'],
  components: { ChallengeHistory },
  data: () => ({
    dialog: false,
    cellColor: '#fff',
  }),
  async created() {
    if (!this.data) return
    const submissions = (
      await Promise.all(this.data.submissions.map(sid => agent.Submission.get(sid)))
    ).map(resp => resp.data.data)
    if (submissions.some(submission => submission.judge_result === AC)) {
      this.cellColor = '#86EFAC'
    } else if (submissions.length > 0) {
      this.cellColor = '#FECACA'
    }
  },
}
</script>
