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
            v-show="!isPreview && $isSelf(prob.author.username)"
            outlined
            color="primary darken-2"
            class="align-self-end rounded"
            :to="{
              name: 'courseSetProblems',
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
        <span>編輯主題</span>
      </v-tooltip>
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
          v-for="name in prob.attachments"
          :key="name"
          class="ma-1"
          outlined
          label
          color="primary"
        >
          {{
            name.length > 15
              ? `${name.substring(0, 10)}...${name.substring(name.length - 6)}`
              : name
          }}
          <v-btn class="ml-1" icon small @click="setPreviewAttachment(name)">
            <v-icon color="primary">mdi-eye</v-icon>
          </v-btn>
          <v-btn icon small @click="downloadAttachment(name)">
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
  </div>
</template>

<script>
import PreviewAttachmentModal from './PreviewAttachmentModal'
import ColorLabel from '@/components/UI/ColorLabel'
import Gravatar from '@/components/UI/Gravatar'

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

  components: { PreviewAttachmentModal, ColorLabel, Gravatar },

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
