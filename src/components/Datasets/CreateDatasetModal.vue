<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-plus</v-icon>
        新增資料集
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-icon class="mr-1">mdi-plus</v-icon>
        <v-toolbar-title>新增資料集</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <div class="mb-4 text-body-1">
          資料集內容可在日後修改。
        </div>
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
                <template v-if="dataset.fileObj">
                  <v-chip color="primary" dark label>{{ dataset.fileObj.name }}</v-chip>
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
              <div class="mt-6 mb-3">
                <v-icon :size="36">mdi-file-upload-outline</v-icon>
              </div>
              <div class="text-body-1">
                從電腦中<a @click="openFileExplorer">選擇檔案</a>或拖曳檔案至此
              </div>
            </v-card-text>
          </v-card>
          <div v-if="noUploadFile" class="mt-1 error--text">請上傳檔案</div>

          <v-row class="mt-6">
            <v-col cols="12" sm="6">
              <v-text-field
                label="檔案名稱"
                v-model="dataset.filename"
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
            label="說明（選填）"
            v-model="dataset.description"
            hint="您可以在此說明這份資料的內容、備註資料來源"
            persistent-hint
            :rules="[v => !v || v.length <= 1000 || '說明上限為 1000 個字']"
            counter="1000"
            rows="3"
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

const initialDataset = {
  filename: '',
  description: '',
  tags: '',
  patchNote: '',
  fileObj: null,
}

export default {
  components: { ColorLabel },

  props: {
    tags: {
      type: Array,
    },
  },

  data: () => ({
    dialog: false,
    isLoading: false,
    elevation: 0,
    dragCounter: 0,
    selectedTags: [],
    dataset: { ...initialDataset },
    noUploadFile: false,
  }),

  watch: {
    selectedTags() {
      this.dataset.tags = this.selectedTags.join(',')
    },
  },

  methods: {
    submit() {
      if (!this.dataset.fileObj) {
        this.noUploadFile = true
        return
      }
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const body = new FormData()
        for (const key in this.dataset) {
          body.append(key, this.dataset[key])
        }
        new Promise((resolve, reject) => this.$emit('submit', body, resolve, reject))
          .then(() => {
            this.dialog = false
            this.$alertSuccess('新增資料集成功。')
            this.dataset = { ...initialDataset }
            this.selectedTags = []
          })
          .catch(() => {
            this.$alertFail('新增資料集失敗')
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
      if (!files) {
        alert('選取檔案失敗')
      } else if (files.length > 1) {
        alert('只能上傳單個檔案')
      } else if (files.length === 1) {
        this.dataset.fileObj = files[0]
        if (!this.dataset.filename) {
          this.dataset.filename = this.dataset.fileObj.name
        }
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
