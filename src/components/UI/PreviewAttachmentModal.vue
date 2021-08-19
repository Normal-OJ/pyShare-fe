<template>
  <v-dialog :value="value" scrollable @input="val => $emit('input', val)">
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>預覽附件：{{ filename }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="$agent.Problem.downloadAttachment(pid, filename)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8 text--primary" style="height: 600px">
        <Spinner v-if="!displayFile" />
        <div v-else-if="fileType === 'unsupported'" class="text-h5">
          此檔案類型目前不支援預覽，目前可預覽的檔案類型有文字檔、CSV。
        </div>
        <div v-else-if="fileType === 'csv'">
          <PreviewCSV :data="displayFile" />
        </div>
        <pre v-else>{{ displayFile.slice(0, 500) }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import PreviewCSV from '@/components/UI/PreviewCSV'

const getContentType = headers => {
  const [type, subType] = headers['content-type'].split(';')[0].split('/')
  return { type, subType }
}

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    pid: {
      type: Number,
    },
    filename: {
      type: String,
    },
  },

  components: { Spinner, PreviewCSV },

  data: () => ({
    dialog: false,
    fileType: '',
    displayFile: null,
  }),

  watch: {
    filename: {
      handler() {
        if (!this.filename) return
        this.getFileData()
      },
      immediate: true,
    },
  },

  methods: {
    async getFileData() {
      const result = await this.$agent.Problem.getAttachment(this.pid, this.filename)
      const { type, subType } = getContentType(result.headers)
      if (type !== 'text') {
        this.fileType = 'unsupported'
        this.isUnsupportedType = true
      } else {
        this.fileType = subType
      }
      this.displayFile = result.data
    },
  },
}
</script>
