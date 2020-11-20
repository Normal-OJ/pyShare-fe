<template>
  <Fragment>
    <div class="text-h5 font-weight-bold text-center">{{ prob.title }}</div>
    <div class="d-flex flex-row mt-4">
      <v-avatar class="mr-2" size="48" color="primary">
        <span class="pb-1 white--text headline">{{ prob.author.displayName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'about' }">
          {{ prob.author.displayName }}
        </router-link>
        <div class="text-body-2">
          {{ $formattedTime(prob.timestamp || Math.floor(new Date() / 1000)) }}
        </div>
      </div>
    </div>
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <div class="text-body-1" v-html="prob.description" />
      </v-col>
      <v-col cols="12" md="4">
        <div class="text-body-1">分類</div>
        <v-chip class="text-caption mr-1" v-for="tag in prob.tags" :key="tag" small>
          {{ tag }}
        </v-chip>
        <div class="text-body-1 mt-4">附件</div>
        <v-chip
          v-for="filename in prob.attachments"
          :key="filename"
          class="ma-1"
          outlined
          label
          color="primary"
        >
          {{ filename }}
          <v-btn class="ml-1" icon small>
            <v-icon color="primary" @click="setPreviewAttachment(filename)">mdi-eye</v-icon>
          </v-btn>
          <v-btn icon small>
            <v-icon color="primary" @click="downloadAttachment(filename)">mdi-download</v-icon>
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

export default {
  name: 'Problem',

  props: {
    prob: {
      type: Object,
      required: true,
    },
  },

  components: { Fragment, PreviewAttachmentModal },

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
