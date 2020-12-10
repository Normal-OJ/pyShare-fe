<template>
  <Fragment>
    <div class="text-h4 font-weight-bold text-center">{{ prob.title }}</div>
    <div class="d-flex flex-row mt-4">
      <v-avatar class="mr-2" size="48" color="primary">
        <span class="white--text headline">{{ prob.author.displayName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'profile', params: { username: prob.author.username } }">
          {{ prob.author.displayName }}
        </router-link>
        <div class="text-body-2">
          {{ $formattedTime(prob.timestamp || Math.floor(new Date() / 1000)) }}
        </div>
      </div>
      <v-spacer />
      <v-btn
        v-if="$isSelf(prob.author.username)"
        outlined
        color="default"
        class="align-self-end rounded"
        :to="{
          name: 'courseSetProblems',
          params: { operation: 'edit' },
          query: { pid: prob.pid },
        }"
        icon
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </div>
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <div class="text-h6">主題說明</div>
        <div class="text-body-1 ma-1" v-html="prob.description" />
      </v-col>
      <v-col cols="12" md="4">
        <div class="text-h6">分類</div>
        <ColorLabel v-for="tag in prob.tags" :key="tag" :tag="tag" small class="ma-1" />
        <div class="text-h6 mt-4">附件</div>
        <v-chip
          v-for="filename in prob.attachments"
          :key="filename"
          class="ma-1"
          outlined
          label
          color="primary"
        >
          {{ filename }}
          <v-btn class="ml-1" icon small @click="setPreviewAttachment(filename)">
            <v-icon color="primary">mdi-eye</v-icon>
          </v-btn>
          <v-btn icon small @click="downloadAttachment(filename)">
            <v-icon color="primary">mdi-download</v-icon>
          </v-btn>
        </v-chip>
      </v-col>
    </v-row>
    <PreviewAttachmentModal
      v-if="isPreviewAttachment"
      :filename="previewAttachment"
      @close="isPreviewAttachment = false"
      @download="downloadAttachment(previewAttachment)"
    />
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import PreviewAttachmentModal from './PreviewAttachmentModal'
import ColorLabel from '@/components/UI/ColorLabel'

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

  components: { Fragment, PreviewAttachmentModal, ColorLabel },

  data: () => ({
    isPreviewAttachment: false,
    previewAttachment: '',
  }),

  methods: {
    setPreviewAttachment(filename) {
      this.previewAttachment = filename
      this.isPreviewAttachment = true
    },
    downloadAttachment(filename) {
      const url = `https://pyshare.noj.tw/api/problem/${this.prob.pid}/attachment/${filename}`
      window.open(url, '_blank')
    },
  },
}
</script>
