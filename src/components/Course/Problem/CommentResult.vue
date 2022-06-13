<template>
  <div>
    <v-tabs fixed-tabs>
      <v-tab>
        <v-icon left>
          mdi-card-text
        </v-icon>
        <v-badge
          color="success"
          dot
          :value="result.stdout"
        >
          標準輸出
        </v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-image
        </v-icon>
        <v-badge :content="`${result.files.length}`">
          輸出檔案
        </v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-alert-circle
        </v-icon>
        <v-badge
          color="secondary"
          dot
          :value="result.stderr"
        >
          錯誤訊息
        </v-badge>
      </v-tab>

      <v-tab-item
        class="pt-4"
        style="overflow: scroll"
      >
        <v-card outlined>
          <v-card-text class="text--primary text-body-1">
            <pre style="white-space: pre-wrap">{{ result.stdout }}</pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item class="pt-4">
        <v-card
          v-show="result.files.length > 0"
          outlined
          min-height="200"
        >
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn
                outlined
                small
                class="text-none"
                v-on="on"
              >
                {{ browsing === noSelection ? '選擇檔案' : isTest ? browsing.filename : browsing }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list v-if="isTest">
              <v-list-item
                v-for="file in [...miscFiles, ...images]"
                :key="file.filename"
                @click="browsing = file"
              >
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item
                v-for="file in [...miscFiles, ...images]"
                :key="file"
                @click="browsing = file"
              >
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
            <v-col
              v-for="(image, index) in imagesWithUrl"
              :key="image.filename"
              cols="12"
              md="3"
            >
              <v-img
                max-height="200"
                contain
                :src="image.url"
                @click="openLightbox(index)"
              />
            </v-col>
          </v-row>
          <vue-easy-lightbox
            :visible="lightboxToggler"
            :imgs="imagesForLightbox"
            :index="lightboxIndex"
            @hide="closeLightbox"
          />
        </v-card>
      </v-tab-item>
      <v-tab-item class="pt-4">
        <v-card outlined>
          <v-card-text class="text--primary text-body-1">
            <pre style="white-space: pre-wrap">{{ result.stderr }}</pre>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox'
import { downloadFile } from '@/lib/utils'

const imageFilePossibleExtension = ['png', 'jpg', 'gif', 'jpeg', 'webp', 'svg', 'bmp']

export default {
  components: {
    VueEasyLightbox,
  },
  props: {
    sid: {
      type: String,
      required: true,
    },
    result: {
      type: Object,
      required: true,
    },
    isTest: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      imageFilePossibleExtension,
      displayImage: null,
      noSelection: '請選擇',
      browsing: '請選擇',
      lightboxToggler: false,
      lightboxIndex: 0,
    }
  },

  computed: {
    imagesForLightbox() {
      if (this.isTest) {
        return this.images.map((file) => ({
          src: `data:image/png;base64,${file.content}`,
          title: file.filename,
        }))
      }
      return this.images.map((filename) => ({
        src: this.$agent.Submission.getImageUrl(this.sid, filename),
        title: filename,
      }))
    },
    imagesWithUrl() {
      if (this.isTest) {
        return this.images.map((file) => ({
          url: `data:image/png;base64,${file.content}`,
          filename: file.filename,
        }))
      }
      return this.images.map((filename) => ({
        url: this.$agent.Submission.getImageUrl(this.sid, filename),
        filename,
      }))
    },
    images() {
      return this.result.files
        .filter((filename) => {
          const splittedName = this.isTest ? filename.filename.split('.') : filename.split('.')
          const extension = splittedName[splittedName.length - 1]
          return this.isImageFile(extension)
        })
        .sort((a, b) => {
          if (this.isTest) {
            if (a.filename < b.filename) return -1
            if (a.filename > b.filename) return 1
            return 0
          } else {
            if (a < b) return -1
            if (a > b) return 1
            return 0
          }
        })
    },
    miscFiles() {
      return this.result.files
        .filter((filename) => {
          const splittedName = this.isTest ? filename.filename.split('.') : filename.split('.')
          const extension = splittedName[splittedName.length - 1]
          return !this.isImageFile(extension)
        })
        .sort((a, b) => {
          if (this.isTest) {
            if (a.filename < b.filename) return -1
            if (a.filename > b.filename) return 1
            return 0
          } else {
            if (a < b) return -1
            if (a > b) return 1
            return 0
          }
        })
    },
  },

  methods: {
    isImageFile(extension) {
      const isFound = this.imageFilePossibleExtension.indexOf(extension.toLowerCase()) !== -1
      return isFound
    },
    download(file) {
      if (this.isTest) {
        downloadFile(file.filename, `data:application/octet-stream;base64,${file.content}`)
      } else {
        this.$agent.Submission.downloadFile(this.sid, file)
      }
    },
    openLightbox(index) {
      this.lightboxIndex = index
      this.lightboxToggler = true
    },
    closeLightbox() {
      this.lightboxToggler = false
    },
  },
}
</script>

<style scoped>
/deep/ .vel-img-title {
  font-size: 24px !important;
  color: #ddd !important;
  overflow: visible !important;
  bottom: 80px !important;
}
</style>
