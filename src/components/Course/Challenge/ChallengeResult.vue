<template>
  <div>
    <v-card elevation="0">
      <v-tabs fixed-tabs>
        <v-tab>
          <v-icon left>mdi-image</v-icon>
          評測結果
        </v-tab>
        <v-tab>
          <v-icon left>mdi-card-text</v-icon>
          <v-badge color="success" dot :value="stdout">標準輸出</v-badge>
        </v-tab>
        <v-tab>
          <v-icon left>mdi-alert-circle</v-icon>
          <v-badge color="secondary" dot :value="stderr">錯誤訊息</v-badge>
        </v-tab>

        <v-tab-item class="pt-4">
          <v-card outlined>
            <v-card-text class="text--primary text-body-1">
              <pre :style="{ color: COLOR[judgeResult + 1] }">
                  {{ STATUS[judgeResult + 1] }}
                </pre
              >
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item class="pt-4" style="overflow: scroll">
          <v-card outlined>
            <v-card-text class="text--primary text-body-1">
              <pre style="white-space: pre-wrap">{{ stdout }}</pre>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item class="pt-4">
          <v-card outlined>
            <v-card-text class="text--primary text-body-1">
              <pre style="white-space: pre-wrap">{{ stderr }}</pre>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    judgeResult: Number,
    code: String,
    stderr: String,
    stdout: String,
  },
  data: () => ({
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
}
</script>
