<template>
  <v-container
    fluid
    class="pb-16"
  >
    <v-row
      class="mb-4"
      no-gutters
    >
      <div class="text-h5">
        {{ isEdit ? '編輯測驗' : '新增測驗' }}
      </div>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="newProb.title"
          label="測驗名稱（必填）"
          outlined
          dense
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="newProb.tags"
          label="測驗分類"
          :items="tags"
          multiple
          outlined
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

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="newProb.status"
          label="顯示狀態"
          :items="status"
          hint="設為「隱藏」則只有老師和主題作者可見"
          persistent-hint
          outlined
          dense
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-if="canWriteCourse"
          v-model="newProb.isTemplate"
          class="pt-0 mt-0"
          label="發布至共享資源"
          hide-details
        />
      </v-col>
    </v-row>

    <div class="text-body-1 mt-4">
      測驗敘述
    </div>
    <TextEditor v-model="newProb.description" />

    <div class="text-body-1 mt-4">
      預設程式碼
    </div>
    <CodeEditor v-model="newProb.defaultCode" />

    <div class="d-flex mt-4 justify-space-around">
      <div v-if="newProb.extra.input">
        <div class="text-body-1 mb-2">
          <v-icon
            class="mr-1"
            color="success"
          >
            mdi-check
          </v-icon>已上傳輸入檔
        </div>
        <v-btn
          color="primary"
          class="mr-3"
          @click="downloadFile('i')"
        >
          <v-icon class="mr-1">
            mdi-file-download
          </v-icon>下載輸入檔
        </v-btn>
        <v-btn
          color="error"
          text
          small
          @click="newProb.extra.input = ''"
        >
          移除
        </v-btn>
      </div>
      <div v-else>
        <span class="text-body-1">請上傳輸入檔：</span>
        <v-card
          outlined
          height="150"
          @drop.prevent="e => addFile(e, 'i')"
          @dragover.prevent
        >
          <v-card-actions>
            <v-spacer />
            <v-file-input
              v-model="inputFile"
              color="primary"
              hide-input
              prepend-icon="mdi-file-plus"
            />
          </v-card-actions>
          <v-card-text>
            點擊上方按鈕或拖曳檔案至此
          </v-card-text>
        </v-card>
      </div>
      <div v-if="newProb.extra.output">
        <div class="text-body-1 mb-2">
          <v-icon
            class="mr-1"
            color="success"
          >
            mdi-check
          </v-icon>已上傳輸出檔
        </div>
        <v-btn
          color="primary"
          class="mr-3"
          @click="downloadFile('o')"
        >
          <v-icon>mdi-file-download</v-icon>下載輸出檔
        </v-btn>
        <v-btn
          color="error"
          text
          small
          @click="newProb.extra.output = ''"
        >
          移除
        </v-btn>
      </div>
      <div v-else>
        <span class="text-body-1">請上傳輸出檔：</span>
        <v-card
          outlined
          height="150"
          @drop.prevent="e => addFile(e, 'o')"
          @dragover.prevent
        >
          <v-card-actions>
            <v-spacer />
            <v-file-input
              v-model="outputFile"
              color="primary"
              hide-input
              prepend-icon="mdi-file-plus"
            />
          </v-card-actions>
          <v-card-text>
            點擊上方按鈕或拖曳檔案至此
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="mt-8 d-flex">
      <v-btn
        class="mr-3"
        color="success"
        :loading="isLoading"
        :disabled="newProb.title === ''"
        @click="submit"
      >
        {{ isEdit ? '更新' : '上傳' }}測驗
      </v-btn>
      <v-spacer />
      <v-btn
        class="mr-3"
        color="primary"
        outlined
        @click="goBack()"
      >
        取消
      </v-btn>
      <PreviewNewChallenge :prob="newProb" />
    </div>
    <template v-if="isEdit">
      <v-divider class="my-4" />
      <div class="d-flex">
        <v-spacer />
        <v-btn
          color="error"
          @click="deleteProblem"
        >
          <v-icon>mdi-trash-can</v-icon>
          刪除
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { ROLE as _ROLE } from '@/constants/auth'
import { canWriteCourseMixin } from '@/lib/permissionMixin'
import { downloadFile } from '@/lib/utils'

const { TEACHER } = _ROLE

export default {
  mixins: [canWriteCourseMixin],
  props: {
    prob: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    status: [
      { text: '顯示', value: 1 },
      { text: '隱藏', value: 0 },
    ],
    newProb: {},
    inputFile: null,
    outputFile: null,
    inputReader: null,
    outputReader: null,
    TEACHER,
  }),

  computed: {
    ...mapState({
      role: (state) => state.auth.role,
    }),
  },

  watch: {
    prob: {
      handler() {
        this.newProb = _.cloneDeep(this.prob)
        if (!this.isEdit && this.role <= this.TEACHER) {
          this.newProb.allowMultipleComments = false
        }
      },
      immediate: true,
      deep: true,
    },
    inputFile() {
      this.inputReader.readAsText(this.inputFile)
    },
    outputFile() {
      this.outputReader.readAsText(this.outputFile)
    },
  },

  mounted() {
    this.inputReader = new FileReader()
    this.inputReader.onload = (e) => {
      this.newProb.extra.input = e.target.result
    }
    this.outputReader = new FileReader()
    this.outputReader.onload = (e) => {
      this.newProb.extra.output = e.target.result
    }
  },

  methods: {
    addFile(e, type) {
      const droppedFiles = e.dataTransfer.files
      if (!droppedFiles || droppedFiles.length > 1) {
        alert('只能上傳單個檔案')
        return
      }
      if (type === 'i') {
        this.inputFile = droppedFiles[0]
      } else {
        this.outputFile = droppedFiles[0]
      }
    },
    downloadFile(type) {
      const content = type === 'i' ? this.newProb.extra.input : this.newProb.extra.output
      const fileContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      downloadFile(type === 'i' ? 'input.txt' : 'output.txt', fileContent)
    },
    submit() {
      this.$emit('submit', this.newProb)
    },
    goBack() {
      window.history.length > 1 ?
        this.$router.go(-1) :
        this.$router.push({ name: 'courseChallenges' })
    },
    deleteProblem() {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-problem', this.prob.pid)
      }
    },
  },
}
</script>
