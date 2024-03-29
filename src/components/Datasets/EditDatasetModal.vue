<template>
  <v-dialog
    :value="open"
    width="750"
    persistent
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
        dense
      >
        <v-icon class="mr-1">
          mdi-pencil
        </v-icon>
        <v-toolbar-title>修改資料集</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="$emit('close')"
          >
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
              <v-row
                class="mb-2"
                justify="center"
                align="center"
              >
                <v-chip
                  color="primary"
                  dark
                  label
                >
                  {{ newDataset.fileObj ? newDataset.fileObj.name : dataset && dataset.filename }}
                </v-chip>
                <v-btn
                  color="primary"
                  text
                  small
                  @click="openFileExplorer"
                >
                  重新選取
                </v-btn>
                <input
                  ref="invisibleFileInput"
                  class="d-none"
                  type="file"
                  @change="event => handleFileInput(event.target.files)"
                >
              </v-row>
              <div class="mt-6 mb-3">
                <v-icon :size="36">
                  mdi-file-upload-outline
                </v-icon>
              </div>
              <div class="text-body-1">
                從電腦中<a @click="openFileExplorer">選擇檔案</a>或拖曳檔案至此
              </div>
            </v-card-text>
          </v-card>
          <div
            v-if="noUploadFile"
            class="mt-1 error--text"
          >
            請上傳檔案
          </div>

          <v-row class="mt-6">
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="newDataset.filename"
                label="檔案名稱"
                :rules="[
                  v => !!v || '請填寫檔案名稱',
                  v => (!!v && v.length <= 64) || '名稱上限為 64 個字',
                ]"
                counter="64"
                hint="建議包含副檔名"
                persistent-hint
                outlined
                color="primary"
                clearable
                dense
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="selectedTags"
                label="選擇分類"
                outlined
                :items="tags || []"
                :loading="!tags"
                multiple
                dense
              >
                <template #selection="{ item }">
                  <ColorLabel
                    :tag="item"
                    small
                    class="mt-2 mr-1"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-textarea
            v-model="newDataset.description"
            class="mt-2"
            label="說明（選填）"
            hint="您可以在此說明這份資料的內容、備註資料來源"
            persistent-hint
            :rules="[v => !v || v.length <= 1000 || '說明上限為 1000 個字']"
            counter="1000"
            rows="3"
            outlined
            color="primary"
          />

          <v-textarea
            v-model="newDataset.patchNote"
            class="mt-2"
            label="更新備註（選填）"
            hint="您可以在此備註在這次更新後檔案有什麼變化"
            persistent-hint
            rows="1"
            outlined
            color="primary"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :loading="isLoading"
          @click="submit"
        >
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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
