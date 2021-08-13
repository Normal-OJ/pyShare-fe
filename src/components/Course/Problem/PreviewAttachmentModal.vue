<template>
  <v-dialog :value="true" persistent>
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>預覽附件：{{ filename }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="$emit('download')">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8 text--primary" style="overflow: scroll">
        <div v-if="isImg" class="text-h5">目前無法預覽圖片附件</div>
        <Spinner v-else-if="!displayFile" />
        <pre v-else>{{ displayFile }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from '@/components/UI/Spinner'

const imageFilePossibleExtension = ['png', 'jpg', 'gif', 'jpeg', 'webp', 'svg', 'bmp']

export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
  },

  components: { Spinner },

  data: () => ({
    imageFilePossibleExtension,
    isImg: false,
    displayFile: null,
  }),

  created() {
    this.getFileData()
  },

  methods: {
    isImageFile(name) {
      const splittedName = name.split('.')
      const extension = splittedName[splittedName.length - 1]
      const isFound = this.imageFilePossibleExtension.indexOf(extension.toLowerCase()) !== -1
      return isFound
    },
    async getFileData() {
      if (this.isImageFile(this.filename)) {
        this.isImg = true
      } else {
        const { data } = await this.$agent.Problem.getAttachment(
          this.$route.params.pid,
          this.filename,
        )
        this.displayFile = data
      }
    },
  },
}
</script>
