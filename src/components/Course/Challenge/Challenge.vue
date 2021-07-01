<template>
  <div>
    <div class="text-h4 font-weight-bold text-center">{{ prob.title }}</div>
    <div class="d-flex flex-row mt-4">
      <Gravatar class="mr-2" :size="48" :md5="prob.author.md5" />
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'profile', params: { id: prob.author.id } }">
          {{ prob.author.displayName }}
        </router-link>
        <div class="text-body-2">
          {{ $formattedTime(prob.timestamp || Math.floor(new Date() / 1000)) }}
        </div>
      </div>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="!isPreview"
            v-role="[0, 1]"
            outlined
            color="primary darken-2"
            class="rounded mr-2"
            icon
            v-on="on"
            v-bind="attrs"
            @click="dialog = true"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>複製測驗</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="!isPreview && $isSelf(prob.author.username)"
            outlined
            color="primary darken-2"
            class="rounded"
            :to="{
              name: 'courseSetChallenges',
              params: { id: prob.course, operation: 'edit' },
              query: { pid: prob.pid },
            }"
            icon
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
        <span>編輯測驗</span>
      </v-tooltip>
      <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="!isPreview && $isSelf(prob.author.username)"
            outlined
            color="primary darken-2"
            class="align-self-end rounded ml-3"
            :to="{ name: 'courseChallengeStats' }"
            icon
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
        </template>
        <span>作答情形</span>
      </v-tooltip> -->
    </div>
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <div class="text-h6">主題說明</div>
        <div class="text-body-1 ma-1" v-html="prob.description" />
      </v-col>
      <v-col cols="12" md="4">
        <div class="text-h6">分類</div>
        <ColorLabel v-for="tag in prob.tags" :key="tag" :tag="tag" small class="ma-1" />
      </v-col>
    </v-row>

    <CloneProblemModal
      :isOpen="dialog"
      :clonePid="prob.pid"
      label="測驗"
      @success="dialog = false"
      @close="dialog = false"
    />
  </div>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel'
import Gravatar from '@/components/UI/Gravatar'
import CloneProblemModal from '../Problem/CloneProblemModal.vue'

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
  components: { ColorLabel, Gravatar, CloneProblemModal },

  data: () => ({
    dialog: false,
  }),
}
</script>
