<template>
  <v-dialog
    v-if="data.commentId"
    v-model="dialog"
  >
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        class="d-flex justify-center align-center"
        :style="{ height: '100%', backgroundColor: cellColor }"
        v-on="on"
      >
        <pre>{{ data.tryCount }}</pre>
      </div>
    </template>
    <v-card class="px-8 pb-4">
      <v-card-title>
        <div>{{ user.username }}{{ `(${user.displayName})` }} - {{ pid }}</div>
        <v-spacer />
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <ChallengeHistory
          v-if="comment"
          :comment="comment"
        />
        <Spinner v-else />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  /**
   * data: {
   *   commentId: null | Comment.ID
   *   result: 0 | 1 | 2 (PASS | FAIL | NOT TRY)
   *   tryCount: number
   * }
   */
  props: ['user', 'pid', 'data'],
  data: () => ({
    isLoading: true,
    dialog: false,
    comment: null,
  }),
  computed: {
    cellColor() {
      return this.data.commentId ? (this.data.result === 0 ? '#86EFAC' : '#FECACA') : '#fff'
    },
  },
  watch: {
    dialog() {
      if (this.dialog && this.comment === null && this.data.commentId) {
        this.getComment()
      }
    },
  },
  methods: {
    async getComment() {
      if (!this.data.commentId) return
      this.$agent.Comment.get(this.data.commentId)
        .then((resp) => (this.comment = resp.data.data))
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>
