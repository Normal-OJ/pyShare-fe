<template>
  <v-container fluid class="pb-16">
    <v-row class="mb-4" no-gutters>
      <div class="text-h5">{{ isEdit ? '編輯測驗' : '新增測驗' }}</div>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-text-field label="測驗名稱（必填）" v-model="newProb.title" outlined dense />
      </v-col>
      <v-col cols="12" md="4">
        <v-select label="測驗分類" v-model="newProb.tags" :items="tags" multiple outlined dense>
          <template v-slot:selection="{ item }">
            <ColorLabel :tag="item" small class="mt-2 mr-1" />
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          label="顯示狀態"
          v-model="newProb.status"
          :items="status"
          hint="設為隱藏時，僅老師可見"
          persistent-hint
          outlined
          dense
        />
      </v-col>
    </v-row>

    <div class="text-body-1 mt-4">測驗敘述</div>
    <TextEditor v-model="newProb.description" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor v-model="newProb.defaultCode" />

    <div class="d-flex mt-4">
      <div>
        <div class="d-flex align-center">
          <div class="text-body-1 mt-2 mr-2">上傳輸入檔</div>
          <v-file-input
            v-model="inputFile"
            color="primary"
            hide-input
            prepend-icon="mdi-file-plus"
          />
        </div>
        <v-card outlined @drop.prevent="e => addFile(e, 'i')" @dragover.prevent height="100">
          <v-card-text>
            點擊上方按鈕或拖曳檔案至此
          </v-card-text>
        </v-card>
      </div>
      <div>
        <div class="d-flex align-center">
          <div class="text-body-1 mt-2 mr-2">上傳輸出檔</div>
          <v-file-input
            v-model="outputFile"
            color="primary"
            hide-input
            prepend-icon="mdi-file-plus"
          />
        </div>
        <v-card outlined @drop.prevent="e => addFile(e, 'o')" @dragover.prevent height="100">
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
      <v-btn class="mr-3" color="primary" outlined @click="goBack()">
        取消
      </v-btn>
      <PreviewNewProblem :prob="newProb" />
    </div>
    <v-divider class="my-4" />
    <div class="d-flex" v-if="isEdit">
      <v-spacer />
      <v-btn color="error" @click="deleteProblem">
        <v-icon>mdi-trash-can</v-icon>
        刪除
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import PreviewNewProblem from '@/components/Course/Problems/PreviewNewProblem'
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import ColorLabel from '@/components/UI/ColorLabel'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { ROLE } from '@/store/getters.type'
import { ROLE as _ROLE } from '@/constants/auth'

const { TEACHER } = _ROLE

export default {
  components: { PreviewNewProblem, TextEditor, CodeEditor, ColorLabel },

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

  computed: {
    ...mapGetters({
      role: ROLE,
    }),
    courseId() {
      return this.$route.params.id
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
    canWriteCourse: null,
  }),

  async created() {
    this.canWriteCourse = await this.$hasPermission('course', this.courseId, ['w'])
  },

  mounted() {
    this.inputReader = new FileReader()
    this.inputReader.onload = e => (this.newProb.extra.input = e.target.result)
    this.outputReader = new FileReader()
    this.outputReader.onload = e => (this.newProb.extra.output = e.target.result)
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
    submit() {
      this.$emit('submit', this.newProb, this.willAddAttachments, this.willRemoveAttachments)
      this.willAddAttachments = []
      this.willRemoveAttachments = []
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'courseChallenges' })
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
