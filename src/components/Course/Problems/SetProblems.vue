<template>
  <v-container fluid class="pb-16">
    <v-row class="mb-4" no-gutters>
      <div class="text-h5">{{ isEdit ? '編輯主題' : '新增主題' }}</div>
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
          hint="設為「隱藏」則只有老師和主題作者可見"
          persistent-hint
          outlined
          dense
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-checkbox
          v-if="canWriteCourse"
          class="pt-0 mt-0"
          v-model="newProb.allowMultipleComments"
          label="允許主題下每人可發表多個創作"
          hide-details
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-checkbox
          v-if="canWriteCourse"
          class="pt-0 mt-0"
          v-model="newProb.isTemplate"
          label="發布至共享資源"
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
      <AttachmentCard
        v-for="att in newProb.attachments"
        :key="att.filename"
        :name="att.filename"
        class="mb-1 mr-1"
        @download="$agent.Problem.downloadAttachment(newProb.pid, att.filename)"
        @preview="preview = { dialog: true, pid: newProb.pid, filename: att.filename }"
      >
        <template v-slot:append>
          <v-btn text color="error" small @click.stop="removeAttachmentFromProb(att)">
            移除
          </v-btn>
        </template>
      </AttachmentCard>
    </div>

    <div
      v-if="willAddAttachments.length > 0 || willImportAttachments.length > 0"
      class="d-flex align-center flex-wrap mt-1"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attr }">
          <v-icon color="primary" small v-on="on" v-bind="attr">
            mdi-information
          </v-icon>
        </template>
        <span>待上傳的附件會在送出新題目或更新題目時才會進行上傳</span>
      </v-tooltip>
      <div class="text-body-2 ml-1">待上傳：</div>
      <AttachmentCard
        v-for="att in willAddAttachments"
        :key="att.name"
        :name="att.name"
        class="mb-1 mr-1"
        :download="false"
        @preview="$alertFail('待上傳的附件無法預覽')"
      >
        <template v-slot:append>
          <v-btn text color="error" small @click.stop="removeFromWillAddAttachments(att)">
            移除
          </v-btn>
        </template>
      </AttachmentCard>
      <AttachmentCard
        v-for="att in willImportAttachments"
        :key="att.filename"
        :name="att.filename"
        class="mb-1 mr-1"
        :download="false"
        @preview="$alertFail('待上傳的附件無法預覽')"
      >
        <template v-slot:append>
          <v-btn text color="error" small @click.stop="removeFromWillImportAttachments(att)">
            移除
          </v-btn>
        </template>
      </AttachmentCard>
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
      <AttachmentCard
        v-for="att in willRemoveAttachments"
        :key="att.filename"
        :name="att.filename"
        class="mb-1 mr-1"
        @download="$agent.Problem.downloadAttachment(newProb.pid, att.filename)"
        @preview="preview = { dialog: true, pid: newProb.pid, filename: att.filename }"
      >
        <template v-slot:append>
          <v-btn text color="error" small @click.stop="undoRemoveAttachmentFromProb(att)">
            還原
          </v-btn>
        </template>
      </AttachmentCard>
    </div>

    <div class="mt-8 d-flex">
      <v-btn
        class="mr-3"
        color="success"
        :loading="isLoading"
        :disabled="newProb.title === ''"
        @click="submit"
      >
        {{ isEdit ? '更新' : '上傳' }}主題
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
    <PreviewAttachmentModal
      v-model="preview.dialog"
      :pid="preview.pid"
      :filename="preview.filename"
      @close="preview = { dialog: false, pid: null, filename: null }"
    />
  </v-container>
</template>

<script>
import PreviewNewProblem from '@/components/Course/Problems/PreviewNewProblem'
import TextEditor from '@/components/UI/TextEditor'
import CodeEditor from '@/components/UI/CodeEditor'
import ColorLabel from '@/components/UI/ColorLabel'
import PreviewAttachmentModal from '@/components/UI/PreviewAttachmentModal.vue'
import AttachmentCard from '@/components/UI/AttachmentCard.vue'
import _ from 'lodash'
import { mapState } from 'vuex'
import { ROLE as _ROLE } from '@/constants/auth'
import { canWriteCourseMixin } from '@/lib/permissionMixin'

const { TEACHER } = _ROLE

export default {
  name: 'SetProblems',

  mixins: [canWriteCourseMixin],

  components: {
    PreviewNewProblem,
    TextEditor,
    CodeEditor,
    ColorLabel,
    PreviewAttachmentModal,
    AttachmentCard,
  },

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
    datasets: {
      type: Array,
      required: true,
    },
  },

  watch: {
    prob: {
      handler() {
        this.newProb = _.cloneDeep(this.prob)
        if (!this.isEdit && this.role <= TEACHER) {
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
    ...mapState({
      role: state => state.auth.role,
    }),
  },

  data: () => ({
    status: [
      { text: '顯示', value: 1 },
      { text: '隱藏', value: 0 },
    ],
    newProb: {},
    willAddAttachments: [],
    willImportAttachments: [],
    willRemoveAttachments: [],
    preview: {
      dialog: false,
      pid: null,
      filename: null,
    },
    fileUploader: [],
  }),

  mounted() {
    this.willImportAttachments = [...this.datasets]
  },

  methods: {
    submit() {
      this.$emit(
        'submit',
        this.newProb,
        this.willAddAttachments,
        this.willRemoveAttachments,
        this.willImportAttachments,
      )
      this.willAddAttachments = []
      this.willRemoveAttachments = []
      this.willImportAttachments = []
    },
    removeFromWillAddAttachments(removedFile) {
      this.willAddAttachments = this.willAddAttachments.filter(
        file => file.name !== removedFile.name,
      )
    },
    removeFromWillImportAttachments(removedFile) {
      this.willImportAttachments = this.willImportAttachments.filter(
        file => file.filename !== removedFile.filename,
      )
    },
    removeAttachmentFromProb(removedFile) {
      this.willRemoveAttachments.push(removedFile)
      this.prob.attachments = this.prob.attachments.filter(
        file => file.filename !== removedFile.filename,
      )
    },
    undoRemoveAttachmentFromProb(undoFile) {
      this.willRemoveAttachments = this.willRemoveAttachments.filter(
        file => file.filename !== undoFile.filename,
      )
      this.prob.attachments.push(undoFile)
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'courseProblems' })
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
