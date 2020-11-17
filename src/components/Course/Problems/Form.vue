<template>
  <Fragment>
    <v-text-field label="主題名稱" v-model="prob.title" outlined />
    <v-select label="主題分類" v-model="prob.tags" :items="availableTags" multiple outlined />
    <v-select
      label="顯示狀態"
      v-model="prob.status"
      :items="status"
      hint="隱藏僅老師和創題者可見"
      persistent-hint
      outlined
    />

    <div class="text-body-1 mt-4">主題敘述</div>
    <TextEditor v-model="prob.description" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor v-model="prob.defaultCode" />

    <div class="d-flex align-center mt-4">
      <div class="text-body-1 mt-2 mr-2">上傳附件</div>
      <v-file-input
        v-model="fileUploader"
        color="primary"
        hide-input
        multiple
        prepend-icon="mdi-plus"
      />
    </div>
    <div v-if="prob.attachments.length > 0" class="d-flex align-center flex-wrap mt-1">
      <div class="text-body-2">已上傳：</div>
      <v-chip
        v-for="name in prob.attachments"
        :key="name"
        class="ma-1"
        outlined
        label
        color="primary"
        close
        @click:close="removeAttachmentFromProb(name)"
      >
        {{ name }}
      </v-chip>
    </div>

    <div v-if="willAddAttachments.length > 0" class="d-flex align-center flex-wrap mt-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attr }">
          <v-icon color="primary" small v-on="on" v-bind="attr">
            mdi-information
          </v-icon>
        </template>
        <span>待上傳的附件會在送出新題目或更新題目時才會進行上傳</span>
      </v-tooltip>
      <div class="text-body-2 ml-1">待上傳：</div>
      <v-chip
        v-for="{ name } in willAddAttachments"
        :key="name"
        class="ma-1"
        outlined
        label
        color="primary"
        close
        @click:close="removeFromWillAddAttachments(name)"
      >
        {{ name }}
      </v-chip>
    </div>

    <div v-if="willRemoveAttachments.length > 0" class="d-flex align-center flex-wrap mt-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attr }">
          <v-icon color="primary" small v-on="on" v-bind="attr">
            mdi-information
          </v-icon>
        </template>
        <span>待刪除的附件會在更新題目時才會進行刪除</span>
      </v-tooltip>
      <div class="text-body-2 ml-1">待刪除：</div>
      <v-chip
        v-for="name in willRemoveAttachments"
        :key="name"
        class="ma-1"
        outlined
        label
        color="primary"
        close
        @click:close="undoRemoveAttachmentFromProb(name)"
      >
        {{ name }}
      </v-chip>
    </div>

    <v-btn class="mt-8" block color="primary" @click="submitProblem">
      送出
    </v-btn>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import TextEditor from '@/components/TextEditor'
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'Form',

  components: { Fragment, TextEditor, CodeEditor },

  props: {
    availableTags: {
      type: Array,
      default: () => ['A', 'B', 'C'],
    },
    prob: {
      type: Object,
      required: true,
    },
  },

  watch: {
    prob: {
      deep: true,
      handler(value) {
        console.log('deep prob', value)
        this.$emit('update:prob', value)
      },
    },
    fileUploader() {
      this.willAddAttachments = [...new Set([...this.willAddAttachments, ...this.fileUploader])]
    },
  },

  data() {
    return {
      status: [
        { text: '顯示', value: 1 },
        { text: '隱藏', value: 0 },
      ],
      willAddAttachments: [],
      willRemoveAttachments: [],
      fileUploader: [],
    }
  },

  methods: {
    submitProblem() {
      this.$emit('submit', this.willAddAttachments, this.willRemoveAttachments)
    },
    removeFromWillAddAttachments(removedFilename) {
      this.willAddAttachments = this.willAddAttachments.filter(
        file => file.name !== removedFilename,
      )
    },
    removeAttachmentFromProb(removedFilename) {
      this.willRemoveAttachments.push(removedFilename)
      this.prob.attachments = this.prob.attachments.filter(file => file !== removedFilename)
      // this.$emit('removeAttachmentFromProb', filename)
    },
    undoRemoveAttachmentFromProb(filename) {
      this.willRemoveAttachments = this.willRemoveAttachments.filter(file => file !== filename)
      this.prob.attachments.push(filename)
    },
  },
}
</script>
