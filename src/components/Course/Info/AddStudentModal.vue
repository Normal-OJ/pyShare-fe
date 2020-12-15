<template>
  <v-dialog v-model="dialog" width="750">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-account-plus</v-icon>
        新增學生
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>新增學生</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-tabs v-model="tab" fixed-tabs>
        <v-tab>批量新增學生</v-tab>
        <v-tab>新增單個學生</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <v-card-text class="text--primary">
              <div class="d-flex align-center mt-2">
                <v-file-input
                  v-model="newStudentFile"
                  label="上傳 csv 檔案"
                  outlined
                  truncate-length="50"
                  hide-details
                  dense
                />
                <v-btn class="ml-2" color="success" :disabled="!newStudentFile" @click="submit">
                  送出
                </v-btn>
              </div>
              <div class="text-body-1 font-weight-bold mt-4 mb-1">檔案格式說明</div>
              <div class="text-body-2">
                您可以上傳一個以 <strong>utf-8</strong> 編碼的 csv 檔案（逗號分隔檔案）。
                <br />
                其中第一列為標題列，接下來每一列皆為一位學生的基本帳號資料，詳見以下說明，最下方亦有範例可以參考。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                標題列（第一列）
              </div>
              <div class="text-body-2">
                必須包含四欄，分別是：
                <ul>
                  <li>
                    <pre>username（至多 16 字元）</pre>
                  </li>
                </ul>
                <ul>
                  <li>
                    <pre>displayName（至多 32 字元）</pre>
                  </li>
                </ul>
                <ul v-for="header in ['password', 'email']" :key="header">
                  <li>
                    <pre>{{ header }}</pre>
                  </li>
                </ul>
                <code>displayName</code> 為平台內顯示的名稱，另外目前僅開放
                <code>password</code> 支援修改。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                學生資料列（第二列以後）
              </div>
              <div class="text-body-2">
                第二列開始為欲加入的學生的帳號資料，系統將會判斷該
                <code>username</code> 是否存在於系統。
                <br />
                若不存在，會以填寫的四個資料在系統新增這個使用者的帳號，隨後將該使用者加入此課程。
                <br />
                反之，若已存在於系統，將會忽略其他三個欄位的資料，然後將該使用者加入此課程。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                範例
              </div>
              <PreviewCSV :data="template" />
              <v-btn class="my-4" block color="primary" @click="downloadExample">
                下載模板
              </v-btn>
              <ConfirmModal
                v-if="isShowConfirmModal"
                @close="closeConfirmModal"
                @confirm="confirmSubmit"
              >
                <template v-slor:title>
                  確認是否送出
                </template>
                <template v-slot:content>
                  <PreviewCSV v-if="previewFile" :data="previewFile" />
                </template>
              </ConfirmModal>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text class="text--primary">
              <v-form ref="form" v-model="validForm">
                <v-text-field
                  v-model="newStudent.username"
                  :rules="[
                    val => !!val || '此欄位為必填',
                    val => val.length <= 16 || '使用者名稱至多 16 字元',
                  ]"
                  label="username（使用者名稱）"
                  outlined
                  dense
                />
                <div class="text-body-1 mb-4">若帳號尚未創立，請填寫以下資料。</div>
                <v-text-field
                  v-model="newStudent.displayName"
                  label="displayName（顯示名稱）"
                  :rules="[v => v.length <= 32 || '顯示名稱至多 32 字元']"
                  outlined
                  dense
                />
                <v-text-field
                  v-model="newStudent.password"
                  label="password（密碼）"
                  outlined
                  dense
                />
                <v-text-field v-model="newStudent.email" label="email（信箱）" outlined dense />
                <v-btn
                  class="my-4"
                  block
                  color="success"
                  :disabled="isAddStudentDisabled"
                  @click="submitAddStudent"
                >
                  送出
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import PreviewCSV from '@/components/UI/PreviewCSV'
import ConfirmModal from '@/components/UI/ConfirmModal'

const template =
  'username,displayName,password,email\n407123000S,王大明,gB7hj31p,bigming@ntnu.edu.tw\n409456000H,陳耳東,409456000H,earEast@ntu.edu.tw\nB123456789,（若是已註冊過的帳號,其他欄位可填可不填）'
const initNewStudent = {
  username: '',
  displayName: '',
  password: '',
  email: '',
}

export default {
  props: {
    submitSuccess: {
      type: Boolean,
      required: true,
    },
  },

  components: { PreviewCSV, ConfirmModal },

  data: () => ({
    dialog: false,
    tab: 0,
    newStudentFile: null,
    template,
    validForm: false,
    newStudent: { ...initNewStudent },
    isShowConfirmModal: false,
    previewFile: null,
  }),

  watch: {
    submitSuccess() {
      if (this.submitSuccess) {
        this.dialog = false
        if (this.newStudentFile) {
          this.newStudentFile = null
        } else {
          this.validForm = false
          this.newStudent = { ...initNewStudent }
        }
      }
    },
  },

  computed: {
    isAddStudentDisabled() {
      return !this.newStudent.username || !this.validForm
    },
  },

  methods: {
    async submit() {
      const r = new FileReader()
      r.onload = async e => {
        this.previewFile = await e.target.result
      }
      await r.readAsText(this.newStudentFile)
      this.isShowConfirmModal = true
    },
    closeConfirmModal() {
      this.isShowConfirmModal = false
    },
    confirmSubmit() {
      this.$emit('submitAddMultipleStudents', this.newStudentFile)
      this.closeConfirmModal()
    },
    downloadExample() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.template
      const link = document.createElement('a')
      link.download = 'template.csv'
      link.href = csvContent
      link.click()
    },
    submitAddStudent() {
      if (this.$refs.form.validate()) {
        this.$emit(
          'submitAddStudent',
          `${Object.keys(this.newStudent).join(',')}\n${Object.values(this.newStudent).join(',')}`,
        )
      }
    },
  },
}
</script>
