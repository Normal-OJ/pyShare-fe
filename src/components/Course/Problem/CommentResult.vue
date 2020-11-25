<template>
  <Fragment>
    <v-tabs vertical>
      <v-tab>
        <v-icon left>mdi-card-text</v-icon>
        標準輸出
      </v-tab>
      <v-tab>
        <v-icon left>mdi-alert-circle</v-icon>
        錯誤訊息
      </v-tab>
      <v-tab>
        <v-icon left>mdi-image</v-icon>
        輸出檔案
      </v-tab>

      <v-tab-item>
        <v-card outlined>
          <v-card-text>
            <pre>{{ result.stdout }}</pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card outlined>
          <v-card-text>
            <pre>{{ result.stderr }}</pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn outlined v-on="on" small>
              選擇檔案
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="file in miscFiles" :key="file" @click="browsing = file">
              <v-list-item-title>{{ file }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          class="ml-4"
          color="primary"
          :disabled="browsing === noSelection"
          small
          @click="download(this.browsing)"
        >
          <v-icon>mdi-file-download</v-icon>
          下載
        </v-btn>
        <v-row>
          <v-col cols="12" md="3" v-for="imageUrl in imageUrls" :key="imageUrl">
            <v-img max-height="200" contain :src="imageUrl" @click="displayImage = imageUrl" />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>
    <v-dialog :value="displayImage">
      <div class="d-flex flex-column align-center justify-center">
        <v-btn icon @click="displayImage = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-img max-width="60vw" contain :src="displayImage" />
      </div>
    </v-dialog>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

const imageFilePossibleExtension = ['png', 'jpg', 'gif', 'jpeg', 'webp', 'svg', 'bmp']

export default {
  props: {
    cid: {
      type: String,
      required: true,
    },
    result: {
      type: Object,
      default: () => ({
        stdout: '',
        stderr: '',
        files: [],
      }),
      // required: true,
    },
  },

  components: { Fragment },

  computed: {
    imageUrls() {
      return this.imageFiles.map(filename => `/api/comment/${this.cid}/file/${filename}`)
    },
    imageFiles() {
      return this.result.files.filter(filename => {
        const splittedName = filename.split('.')
        const extension = splittedName[splittedName.length - 1]
        return this.isImageFile(extension)
      })
    },
    miscFiles() {
      return this.result.files.filter(filename => {
        const splittedName = filename.split('.')
        const extension = splittedName[splittedName.length - 1]
        return !this.isImageFile(extension)
      })
    },
  },

  data() {
    return {
      imageFilePossibleExtension,
      displayImage: null,
      noSelection: '請選擇',
      browsing: this.noSelection,
    }
  },

  methods: {
    isImageFile(extension) {
      const isFound = this.imageFilePossibleExtension.indexOf(extension.toLowerCase()) !== -1
      return isFound
    },
    download(file) {
      const url = `/api/comment/${this.cid}/file/${file}`
      const routeData = this.$router.resolve({ path: url })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>
