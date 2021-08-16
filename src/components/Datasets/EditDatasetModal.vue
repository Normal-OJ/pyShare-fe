<template>
  <v-dialog v-model="open" width="750" persistent>
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-icon class="mr-1">mdi-pencil</v-icon>
        <v-toolbar-title>修改資料集</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <v-form ref="form">
          <v-card
            class="mt-2 px-2 py-6"
            outlined
            :elevation="elevation"
            @drop.prevent="event => handleFileInput(event.dataTransfer.files)"
            @dragover.prevent
            @dragenter="dragenter"
            @dragleave="dragleave"
          >
            <v-card-text class="text-center">
              <v-row class="mb-2" justify="center" align="center">
                <template>
                  <v-chip color="primary" dark label>
                    {{ newDataset.fileObj ? newDataset.fileObj.name : dataset && dataset.filename }}
                  </v-chip>
                  <v-btn color="primary" text small @click="openFileExplorer">
                    重新選取
                  </v-btn>
                </template>
                <input
                  class="d-none"
                  ref="invisibleFileInput"
                  type="file"
                  @change="event => handleFileInput(event.target.files)"
                />
              </v-row>
              <div class="mt-8 mb-1">
                <v-icon :size="36">mdi-file-upload-outline</v-icon>
              </div>
              從電腦中選擇檔案或拖曳檔案至此
            </v-card-text>
          </v-card>
          <div v-if="noUploadFile" class="mt-1 error--text">請上傳檔案</div>

          <v-row class="mt-6">
            <v-col cols="12" sm="6">
              <v-text-field
                label="資料名稱"
                v-model="newDataset.filename"
                :rules="[v => !!v || '請填寫資料名稱']"
                outlined
                color="primary"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="selectedTags"
                label="選擇分類"
                outlined
                :items="tags || []"
                :loading="!tags"
                multiple
                dense
              >
                <template v-slot:selection="{ item }">
                  <ColorLabel :tag="item" small class="mt-2 mr-1" />
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-textarea
            class="mt-2"
            label="資料說明（選填）"
            v-model="newDataset.description"
            placeholder="您可以在此說明這份資料的內容、備註資料來源"
            rows="3"
            outlined
            color="primary"
          />

          <v-textarea
            class="mt-2"
            label="更新備註（選填）"
            v-model="newDataset.patchNote"
            placeholder="您可以在此備註在這次更新後檔案有什麼變化"
            rows="1"
            outlined
            color="primary"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :loading="isLoading" @click="submit">
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel'

export default {
  components: { ColorLabel },

  props: {
    open: {
      type: Boolean,
      required: true,
    },
    tags: {
      type: Array,
    },
    dataset: {
      type: Object,
    },
  },

  data: () => ({
    isLoading: false,
    elevation: 0,
    dragCounter: 0,
    selectedTags: [],
    newDataset: {
      filename: '',
      description: '',
      tags: '',
      patchNote: '',
      fileObj: null,
    },
    noUploadFile: false,
  }),

  watch: {
    selectedTags() {
      this.newDataset.tags = this.selectedTags.join(',')
    },
    dataset() {
      if (!this.dataset) return
      for (const key of ['filename', 'description']) {
        this.newDataset[key] = this.dataset[key]
      }
      this.selectedTags = this.dataset.tags
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const body = new FormData()
        for (const key in this.newDataset) {
          if (key === 'fileObj' && !this.newDataset.fileObj) continue
          body.append(key, this.newDataset[key])
        }
        new Promise((resolve, reject) =>
          this.$emit('submit', this.dataset.id, body, resolve, reject),
        )
          .then(() => {
            this.$emit('close')
            this.$alertSuccess('編輯資料集成功。')
          })
          .catch(() => {
            this.$alertFail('編輯資料集失敗')
          })
          .finally(() => (this.isLoading = false))
      }
    },
    openFileExplorer() {
      this.$refs['invisibleFileInput'].click()
    },
    handleFileInput(files) {
      this.noUploadFile = false
      this.elevation = 0
      if (!files || files.length > 1) {
        alert('只能上傳單個檔案')
        return
      }
      this.newDataset.fileObj = files[0]
      if (!this.newDataset.filename) {
        this.newDataset.filename = this.newDataset.fileObj.name
      }
    },
    dragenter() {
      this.dragCounter += 1
      this.elevation = 6
    },
    dragleave() {
      this.dragCounter -= 1
      if (this.dragCounter === 0) {
        this.elevation = 0
      }
    },
  },
}
</script>

<style></style>
