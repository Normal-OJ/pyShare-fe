<template>
  <Fragment>
    <v-tabs fixed-tabs>
      <v-tab>
        <v-icon left>mdi-card-text</v-icon>
        <v-badge color="success" dot :value="result.stdout">標準輸出</v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>mdi-image</v-icon>
        <v-badge :content="`${result.files.length}`">輸出檔案</v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>mdi-alert-circle</v-icon>
        <v-badge color="secondary" dot :value="result.stderr">錯誤訊息</v-badge>
      </v-tab>

      <v-tab-item class="pt-4" style="overflow: scroll">
        <v-card outlined>
          <v-card-text class="text--primary text-body-1">
            <pre style="white-space: pre-wrap">{{ result.stdout }}</pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item class="pt-4">
        <div v-show="result.files.length > 0">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on" small class="text-none">
                {{ browsing === noSelection ? '選擇檔案' : browsing }}
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
            class="ml-4 text--none"
            color="primary"
            :disabled="browsing === noSelection"
            small
            @click="download(browsing)"
          >
            <v-icon>mdi-file-download</v-icon>
            下載
          </v-btn>
          <v-row>
            <v-col cols="12" md="3" v-for="imageUrl in imageUrls" :key="imageUrl">
              <v-img max-height="200" contain :src="imageUrl" @click="displayImage = imageUrl" />
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
      <v-tab-item class="pt-4">
        <v-card outlined>
          <v-card-text class="text--primary text-body-1">
            <pre style="white-space: pre-wrap">{{ result.stderr }}</pre>
          </v-card-text>
        </v-card>
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
    sid: {
      type: String,
      required: true,
    },
    result: {
      type: Object,
      required: true,
    },
  },

  components: { Fragment },

  computed: {
    imageUrls() {
      return this.imageFiles.map(filename => `/api/submission/${this.sid}/file/${filename}`)
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
      browsing: '請選擇',
    }
  },

  methods: {
    isImageFile(extension) {
      const isFound = this.imageFilePossibleExtension.indexOf(extension.toLowerCase()) !== -1
      return isFound
    },
    download(file) {
      const url = `https://pyshare.noj.tw/api/submission/${this.sid}/file/${file}`
      window.open(url, '_blank')
    },
  },
}
</script>
