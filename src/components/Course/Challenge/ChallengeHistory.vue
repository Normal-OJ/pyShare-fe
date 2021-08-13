<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>上傳時間</th>
            <th>評測結果</th>
            <th>程式與運行結果</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr
            v-for="({ timestamp, judge_result, code, stderr, stdout }, index) in submissions"
            :key="timestamp"
          >
            <td>{{ $formattedTime(timestamp) }}</td>
            <td class="text-body-2">
              <pre v-if="judge_result !== undefined" :style="{ color: COLOR[judge_result + 1] }">{{
                STATUS[judge_result + 1]
              }}</pre>
              <Spinner v-else />
            </td>
            <td>
              <v-dialog v-model="dialog[index]">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" text v-bind="attrs" v-on="on">
                    檢視
                  </v-btn>
                </template>
                <v-card class="px-8 pb-4">
                  <v-card-title>
                    <div>{{ $formattedTime(timestamp) }}</div>
                    <v-spacer />
                    <v-btn icon @click="$set(dialog, index, false)"
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </v-card-title>
                  <CodeEditor :value="code" readOnly />
                  <ChallengeResult
                    :judgeResult="judge_result"
                    :code="code"
                    :stderr="stderr"
                    :stdout="stdout"
                  />
                </v-card>
              </v-dialog>
            </td>
          </tr>
          <tr v-if="submissions.length === 0">
            <td colspan="3">尚無繳交紀錄</td>
          </tr>
        </tbody>
        <Spinner v-else />
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import CodeEditor from '@/components/UI/CodeEditor'
import ChallengeResult from './ChallengeResult'
import Spinner from '@/components/UI/Spinner.vue'

export default {
  components: { CodeEditor, ChallengeResult, Spinner },

  props: {
    comment: {
      type: Object,
    },
  },

  data: () => ({
    dialog: [],
    isLoading: true,
    submissions: [],
    STATUS: [
      'Pending',
      'Accepted',
      'Wrong Answer',
      'Compile Error',
      'Time Limit Exceed',
      'Memory Limit Exceed',
      'Runtime Error',
      'Judge Error',
      'Output Limit Exceed',
    ],
    COLOR: [
      '#4E342E',
      '#009624',
      '#F44336',
      '#DD2C00',
      '#9C27B0',
      '#FF9800',
      '#2196F3',
      '#93282C',
      '#BF360C',
    ],
    pollingSubmission: null,
    isSubmissionPending: false,
  }),

  watch: {
    comment: {
      handler() {
        if (this.comment && this.comment.submissions && this.comment.submissions.length > 0) {
          Promise.all(this.comment.submissions.map(sid => this.$agent.Submission.get(sid))).then(
            resp => {
              this.submissions = resp.map((r, idx) => ({
                ...r.data.data,
                id: this.comment.submissions[idx],
              }))
              this.isSubmissionPending = this.submissions.some(s => s.judge_result === undefined)
            },
          )
          this.dialog = new Array(this.comment.submissions.length).fill(false)
        }
        this.isLoading = false
      },
      immediate: true,
      deep: true,
    },
  },

  created() {
    this.pollingSubmission = setInterval(
      that => {
        if (that.isSubmissionPending) {
          that.fetchSubmission()
        }
      },
      2000,
      this,
    )
  },

  methods: {
    fetchSubmission() {
      const fetchIds = this.submissions.filter(s => s.judge_result === undefined).map(s => s.id)
      if (!fetchIds || fetchIds.length === 0) {
        this.isSubmissionPending = false
        return
      }
      Promise.all(fetchIds.map(sid => this.$agent.Submission.get(sid))).then(resp => {
        resp.forEach((r, idx) => {
          const pos = this.submissions.findIndex(s => s.id === fetchIds[idx])
          this.$set(this.submissions, pos, { ...r.data.data, id: fetchIds[idx] })
        })
      })
    },
  },
}
</script>
