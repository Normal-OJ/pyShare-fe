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
        <div v-if="isImg" class="text-h5">
          <v-img :src="displayFile"></v-img>
        </div>
        <Spinner v-else-if="!displayFile" />
        <pre v-else>{{ displayFile.slice(0, 500) }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from '@/components/UI/Spinner'

const imageFilePossibleExtension = ['png', 'jpg', 'gif', 'jpeg', 'webp', 'svg', 'bmp']
const isImageFile = name => {
  const splittedName = name.split('.')
  const extension = splittedName[splittedName.length - 1]
  const isFound = imageFilePossibleExtension.indexOf(extension.toLowerCase()) !== -1
  return isFound
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

  components: { Spinner },

  data: () => ({
    dialog: false,
    isImg: false,
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
      if (isImageFile(this.filename)) {
        this.isImg = true
      }
      const { data } = await this.$agent.Problem.getAttachment(this.pid, this.filename)
      this.displayFile = data
    },
  },
}
</script>
