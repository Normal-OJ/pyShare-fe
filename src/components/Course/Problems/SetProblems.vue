<template>
  <v-container fluid class="pb-16">
    <v-row class="mb-4" no-gutters>
      <div class="text-h5">{{ isEdit ? '編輯主題' : '新增主題' }}</div>
      <v-spacer />
      <PreviewNewProblem :prob="newProb" />
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="主題名稱（必填）" v-model="newProb.title" outlined dense />
      </v-col>
      <v-col cols="12" md="6">
        <v-select label="主題分類" v-model="newProb.tags" :items="tags" multiple outlined dense>
          <template v-slot:selection="{ item }">
            <ColorLabel :tag="item" small class="mt-2 mr-1" />
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row align="start">
      <v-col cols="12" md="6">
        <v-select
          label="顯示狀態"
          v-model="newProb.status"
          :items="status"
          hint="隱藏僅老師和創題者可見"
          persistent-hint
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-permission="[TEACHER]"
          class="pt-0 mt-0"
          v-model="newProb.allowMultipleComments"
          label="允許主題下可以發表多個創作"
          hide-details
        />
      </v-col>
    </v-row>

    <div class="text-body-1 mt-4">主題敘述</div>
    <TextEditor v-model="newProb.description" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor v-model="newProb.defaultCode" />

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
    <div
      v-if="newProb.attachments && newProb.attachments.length > 0"
      class="d-flex align-center flex-wrap mt-1"
    >
      <div class="text-body-2">已上傳：</div>
      <!-- TODO: take out three chip attachment component -->
      <v-chip
        v-for="name in newProb.attachments"
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

    <v-btn class="mt-8" block color="success" :disabled="newProb.title === ''" @click="submit">
      送出
    </v-btn>
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
  name: 'SetProblems',

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
  },

  watch: {
    prob: {
      handler() {
        this.newProb = _.cloneDeep(this.prob)
        if (this.role <= this.TEACHER) {
          this.newProb.allowMultipleComments = false
        }
      },
      immediate: true,
      deep: true,
    },
    fileUploader() {
      this.willAddAttachments = [...new Set([...this.willAddAttachments, ...this.fileUploader])]
    },
  },

  computed: {
    ...mapGetters({
      role: ROLE,
    }),
  },

  data: () => ({
    status: [
      { text: '顯示', value: 1 },
      { text: '隱藏', value: 0 },
    ],
    newProb: {},
    willAddAttachments: [],
    willRemoveAttachments: [],
    fileUploader: [],
    TEACHER,
  }),

  methods: {
    submit() {
      this.$emit('submit', this.newProb, this.willAddAttachments, this.willRemoveAttachments)
      this.willAddAttachments = []
      this.willRemoveAttachments = []
    },
    removeFromWillAddAttachments(removedFilename) {
      this.willAddAttachments = this.willAddAttachments.filter(
        file => file.name !== removedFilename,
      )
    },
    removeAttachmentFromProb(removedFilename) {
      this.willRemoveAttachments.push(removedFilename)
      this.prob.attachments = this.prob.attachments.filter(file => file !== removedFilename)
    },
    undoRemoveAttachmentFromProb(filename) {
      this.willRemoveAttachments = this.willRemoveAttachments.filter(file => file !== filename)
      this.prob.attachments.push(filename)
    },
  },
}
</script>
