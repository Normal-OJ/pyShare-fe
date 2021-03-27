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
                  data-test="fileInput"
                />
                <v-btn
                  class="ml-2"
                  color="success"
                  :disabled="!newStudentFile"
                  :loading="isLoading"
                  @click="submit"
                  data-test="submitFileBtn"
                >
                  送出
                </v-btn>
              </div>
              <div class="text-body-1 font-weight-bold mt-4 mb-1">檔案格式說明</div>
              <div class="text-body-2">
                您可以上傳一個以 <strong>utf-8</strong> 編碼的 csv 檔案（逗號分隔檔案）來新增學生。
                <br />
                其中第一列為標題列，接下來每一列皆為一位學生的基本帳號資料，詳見以下說明，最下方亦有範例檔案可以參考及下載。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                標題列（第一列）
              </div>
              <div class="text-body-2">
                必須包含四欄，分別是：
                <ul
                  v-for="header in [
                    'school（須為下方「學校對照表」中的其中一個，值為不含引號的空字串或大寫學校縮寫）',
                    'username（至多 16 字元，慣例上會使用學號）',
                    'displayName（至多 32 字元，為平台內顯示的名稱）',
                    'password',
                  ]"
                  :key="header"
                >
                  <li>
                    <pre>{{ header }}</pre>
                  </li>
                </ul>
                日後學生登入平台可以自行修改密碼、新增電子信箱（忘記密碼時使用）。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                學生資料列（第二列以後）
              </div>
              <div class="text-body-2">
                第二列開始為欲加入的學生的帳號資料，一列一位學生資料，系統將會判斷該
                <code>school</code> + <code>username</code> 的組合是否存在於系統。
                <br />
                若不存在，會以填寫的四個資料在系統新增這個使用者，隨後將該使用者加入此課程。
                <br />
                反之，若已存在於系統，將會忽略其他兩個欄位的資料，然後將該使用者加入此課程。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                school 欄位可使用的值
              </div>
              <div class="text-body-2">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      學校對照表
                    </v-btn>
                  </template>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>學校名稱</th>
                          <th>csv 內應使用的值「不含引號」</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="{ alias, name } in schoolOptions" :key="name">
                          <td>{{ name }}</td>
                          <td>
                            <code>{{ `"${alias}"` }}</code>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-menu>
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
                <v-select
                  v-model="newStudent.school"
                  :rules="[val => val !== null || '此欄位為必填']"
                  :items="schoolOptions"
                  :item-text="({ alias, name }) => `${alias} ${name}`"
                  item-value="alias"
                  label="學校"
                  outlined
                  dense
                >
                  <template v-slot:selection="{ item }">{{ item.alias || item.name }}</template>
                </v-select>
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
                <div class="text-body-1 mb-4">若帳號尚未創立，請設定以下資料。</div>
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
                  :type="isShowPassword ? 'text' : 'password'"
                  :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="isShowPassword = !isShowPassword"
                />
                <v-btn
                  class="my-4"
                  block
                  color="success"
                  :disabled="isAddStudentDisabled"
                  :loading="isLoading"
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
    <v-dialog v-model="isShowError" persistent>
      <v-card class="py-8">
        <div class="d-flex flex-column align-center pb-8">
          <div>
            <v-icon size="66" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="text-h5 text-center mt-3">
            以下學生新增失敗
          </div>
        </div>
        <v-card-text class="text--primary">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>school</th>
                  <th>username</th>
                  <th>error message</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ school, username, err } in errors" :key="username">
                  <td>{{ school }}</td>
                  <td>{{ username }}</td>
                  <td v-if="err">
                    <div v-for="[key, value] in Object.entries(err)" :key="key">
                      {{ key }}: {{ value }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="px-16" large tile @click="isShowError = false">
            我知道了
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import PreviewCSV from '@/components/UI/PreviewCSV'
import ConfirmModal from '@/components/UI/ConfirmModal'
import { SCHOOLS } from '@/constants/auth'

const template =
  'school,username,displayName,password\n,407123000S,王大明,gB7hj31p\nNTNU,409456000H,陳耳東,409456000H\nNTUST,B123456789,（已註冊過的帳號）,'
const initNewStudent = {
  school: '',
  username: '',
  displayName: '',
  password: '',
  email: '',
}

export default {
  components: { PreviewCSV, ConfirmModal },

  data: () => ({
    dialog: false,
    tab: 0,
    newStudentFile: null,
    schoolOptions: SCHOOLS,
    template,
    validForm: false,
    newStudent: { ...initNewStudent },
    isShowPassword: false,
    isShowConfirmModal: false,
    previewFile: null,
    isShowError: false,
    errors: null,
    isLoading: false,
  }),

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
      this.isLoading = true
      new Promise((resolve, reject) =>
        this.$emit('submit-add-multiple-students', this.newStudentFile, resolve, reject),
      )
        .then(() => {
          this.dialog = false
          this.$alertSuccess('新增學生成功。')
        })
        .catch(error => {
          if (error.data.fails.length > 0) {
            this.$alertFail('新增學生失敗。')
            this.errors = error.data.fails
            this.isShowError = true
          } else {
            this.dialog = false
            this.$alertSuccess('新增學生成功。')
          }
        })
        .finally(() => {
          this.isLoading = false
          this.newStudentFile = null
          this.closeConfirmModal()
        })
    },
    downloadExample() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.template
      const link = document.createElement('a')
      link.download = 'template.csv'
      link.href = csvContent
      link.click()
    },
    submitAddStudent() {
      this.isLoading = true
      if (this.$refs.form.validate()) {
        new Promise((resolve, reject) =>
          this.$emit(
            'submit-add-student',
            `${Object.keys(this.newStudent).join(',')}\n${Object.values(this.newStudent).join(
              ',',
            )}`,
            resolve,
            reject,
          ),
        )
          .then(() => {
            this.dialog = false
            this.newStudent = { ...initNewStudent }
            this.$alertSuccess('新增學生成功。')
          })
          .catch(error => {
            if (error.data.fails.length > 0) {
              this.$alertFail('新增學生失敗。')
              this.errors = error.data.fails
              this.isShowError = true
            } else {
              this.dialog = false
              this.newStudent = { ...initNewStudent }
              this.$alertSuccess('新增學生成功。')
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
  },
}
</script>
