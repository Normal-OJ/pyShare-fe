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
      <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="!isPreview"
            outlined
            color="primary darken-2"
            class="rounded mr-2"
            :to="{ name: 'courseChallengesStats' }"
            icon
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
        </template>
        <span>作答情形</span>
      </v-tooltip> -->
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
            @click="dialog = true"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>複製測驗</span>
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
              name: 'courseSetChallenges',
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
        <span>編輯測驗</span>
      </v-tooltip>
    </div>
    <v-row class="mt-6">
      <v-col
        cols="12"
        md="8"
      >
        <div class="text-h6">
          測驗說明
        </div>
        <div
          class="text-body-1 ma-1 problem-description"
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
      </v-col>
    </v-row>

    <CloneProblemModal
      :is-open="dialog"
      :clone-pid="prob.pid"
      label="測驗"
      @success="dialog = false"
      @close="dialog = false"
    />
  </div>
</template>

<script>
export default {
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
    dialog: false,
    canCopyProblem: null,
  }),

  async created() {
    this.canCopyProblem = await this.$hasPermission('problem', this.prob.pid, ['c'])
  },
}
</script>
