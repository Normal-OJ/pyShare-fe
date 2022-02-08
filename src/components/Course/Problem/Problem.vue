<template>
  <div>
    <div class="text-h4 font-weight-medium text-center">
      {{ prob.title }}
    </div>
    <div class="d-flex flex-row mt-4">
      <Gravatar
        class="mr-2"
        :size="48"
        :md5="prob.author.md5"
      />
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'profile', params: { id: prob.author.id } }">
          {{ prob.author.displayName }}
        </router-link>
        <div class="text-body-2">
          {{ $formattedTime(prob.timestamp || Math.floor(new Date() / 1000)) }}
        </div>
      </div>
      <v-spacer />
      <v-tooltip
        v-if="!isPreview && canCopyProblem"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-btn
            outlined
            color="primary darken-2"
            class="rounded mr-2"
            icon
            v-bind="attrs"
            v-on="on"
            @click="cloneProblemDialog = true"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>複製主題</span>
      </v-tooltip>
      <v-tooltip
        v-if="!isPreview && $isSelf(prob.author.username)"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-btn
            outlined
            color="primary darken-2"
            class="rounded"
            :to="{
              name: 'courseSetProblems',
              params: { id: prob.course, operation: 'edit' },
              query: { pid: prob.pid },
            }"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
        <span>編輯主題</span>
      </v-tooltip>
    </div>
    <v-row class="my-6">
      <v-col
        cols="12"
        md="8"
      >
        <div class="text-h6">
          主題說明
        </div>
        <div
          class="text-body-1 ma-1"
          v-html="prob.description"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <div class="text-h6">
          分類
        </div>
        <ColorLabel
          v-for="tag in prob.tags"
          :key="tag"
          :tag="tag"
          small
          class="ma-1"
        />
        <div
          v-if="prob.tags.length === 0"
          class="gray--text"
        >
          無
        </div>
        <div class="text-h6 mt-4">
          附件
        </div>
        <AttachmentCard
          v-for="{ filename } in prob.attachments"
          :key="filename"
          class="mr-1 mb-1"
          :name="filename"
          @preview="preview = { dialog: true, filename }"
          @download="$agent.Problem.downloadAttachment(prob.pid, filename)"
        />
        <div
          v-if="prob.attachments.length === 0"
          class="gray--text"
        >
          無
        </div>
      </v-col>
    </v-row>
    <PreviewAttachmentModal
      v-model="preview.dialog"
      :pid="prob.pid"
      :filename="preview.filename"
      @close="preview = { dialog: false, pid: null, filename: null }"
    />
    <CloneProblemModal
      :is-open="cloneProblemDialog"
      :clone-pid="prob.pid"
      label="主題"
      @success="cloneProblemDialog = false"
      @close="cloneProblemDialog = false"
    />
  </div>
</template>

<script>
export default {
  name: 'Problem',

  props: {
    prob: {
      type: Object,
      required: true,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    preview: {
      dialog: false,
      filename: null,
    },
    cloneProblemDialog: false,
    canCopyProblem: null,
  }),

  async created() {
    this.canCopyProblem = await this.$hasPermission('problem', this.prob.pid, ['c'])
  },

  methods: {
    downloadAttachment(filename) {
      this.$agent.Problem.downloadAttachment(this.prob.pid, filename)
    },
  },
}
</script>
