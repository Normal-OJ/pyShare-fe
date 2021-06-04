<template>
  <div v-if="!isLoading">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>上傳時間</th>
            <th>評測結果</th>
            <th>程式與運行結果</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="{ timestamp, judge_result, code, stderr, stdout } in submissions"
            :key="timestamp"
          >
            <td>{{ $formattedTime(timestamp) }}</td>
            <td>
              <pre :style="{ color: COLOR[judge_result + 1] }">
                {{ STATUS[judge_result + 1] }}
              </pre>
            </td>
            <td>
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    檢視
                  </v-btn>
                </template>
                <v-card class="px-8 pb-4">
                  <v-card-title>
                    {{ $formattedTime(timestamp) }}
                    <v-spacer />
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                  </v-card-title>
                  <CodeEditor :value="code" readOnly />
                  <ChallengeResult :code="code" :stderr="stderr" :stdout="stdout" />
                </v-card>
              </v-dialog>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import CodeEditor from '@/components/UI/CodeEditor'
import ChallengeResult from './ChallengeResult'
import agent from '@/api/agent'

export default {
  components: { CodeEditor, ChallengeResult },

  props: {
    comment: {
      type: Object,
    },
  },

  data: () => ({
    dialog: false,
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
      '#00C853',
      '#F44336',
      '#DD2C00',
      '#9C27B0',
      '#FF9800',
      '#2196F3',
      '#93282C',
      '#BF360C',
    ],
  }),

  watch: {
    comment: {
      handler() {
        if (this.comment && this.comment.submissions && this.comment.submissions.length > 0) {
          Promise.all(this.comment.submissions.map(sid => agent.Submission.get(sid))).then(resp => {
            this.submissions = resp.map(r => r.data.data)
            this.isLoading = false
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>
