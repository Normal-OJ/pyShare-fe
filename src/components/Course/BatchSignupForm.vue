<template>
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
          @click="isShowConfirmModal = true"
          data-test="submitFileBtn"
        >
          送出
        </v-btn>
      </div>
      <div>
        <p class="text-body-1 font-weight-medium mt-4 mb-1">檔案格式說明</p>
        <p class="text-body-2">
          您可以上傳一個以 <strong>utf-8</strong> 編碼的 csv 檔案（逗號分隔檔案）。
          其中第一列為標題列，接下來每一列皆為一位學生的基本帳號資料，詳見以下說明，最下方亦有範例可以參考。
        </p>
        <p class="text-body-1 font-weight-medium mt-4 mb-1">檔案格式說明</p>
        <p class="text-body-2">
          必須包含四欄，分別是：
        </p>
        <ul>
          <li><pre>school（須為下方指定的其中一個）</pre></li>
          <li><pre>username（至多 16 字元）</pre></li>
          <li><pre>displayName（至多 32 字元）</pre></li>
          <li><pre>password</pre></li>
        </ul>
        <p>
          <code>displayName</code> 為平台內顯示的名稱，另外目前僅開放
          <code>password</code> 支援修改。
        </p>
        <p class="text-body-1 font-weight-medium mt-4 mb-1">學生資料列（第二列以後）</p>
        <p class="text-body-2">
          第二列開始為欲加入的學生的帳號資料，系統將會判斷該
          <code>school</code> 與 <code>username</code> 的組合是否存在於系統。
          若不存在，會以填寫的四個資料在系統新增這個使用者，隨後將該使用者加入此課程。
          反之，若已存在於系統，將會忽略其他兩個欄位的資料，然後將該使用者加入此課程。
        </p>
        <p class="text-body-1 font-weight-medium mt-4 mb-1">school 欄位可使用的值</p>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" small dark v-bind="attrs" v-on="on">
              學校對照表
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="{ abbr, name } in schoolOptions || []" :key="name">
              <v-list-item-title> {{ name }}：{{ abbr ? abbr : '（空字串）' }} </v-list-item-title>
            </v-list-item>
            <Spinner v-if="!schoolOptions" />
          </v-list>
        </v-menu>
        <p class="text-body-1 font-weight-medium mt-4 mb-1">範例</p>
        <PreviewCSV :data="template" />
        <v-btn class="my-4" block color="primary" @click="downloadExample">
          下載模板
        </v-btn>
      </div>

      <ConfirmModal
        :isOpen="isShowConfirmModal"
        @close="isShowConfirmModal = false"
        @confirm="submitAddMultipleStudents"
      >
        <template v-slor:title>
          確認是否送出
        </template>
        <template v-slot:content>
          <PreviewCSV :data="newStudentFile" />
        </template>
      </ConfirmModal>
    </v-card-text>
  </v-card>
</template>

<script>
import PreviewCSV from '@/components/UI/PreviewCSV'
import ConfirmModal from '@/components/UI/ConfirmModal'
import Spinner from '../UI/Spinner.vue'

const template =
  'school,username,displayName,password\n,407123000S,王大明,gB7hj31p\nNTNU,409456000H,陳耳東,409456000H\nNTUST,B123456789,（已註冊過的帳號）,'
const csvContent = 'data:text/csv;charset=utf-8,' + template
const link = document.createElement('a')
link.download = '批次新增學生模板.csv'
link.href = csvContent

export default {
  components: { PreviewCSV, ConfirmModal, Spinner },
  props: {
    schoolOptions: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
    newStudentFile: null,
    template,
    isShowConfirmModal: false,
    fileReader: new FileReader(),
  }),
  created() {
    this.fileReader.onload = this.setupFileReader
  },
  methods: {
    async setupFileReader(element) {
      this.isLoading = true
      const csvString = element.target.result
      this.$emit('signup', this.$route.params.id, csvString)
      this.isLoading = false
      this.newStudentFile = null
      this.isShowConfirmModal = false
    },
    submitAddMultipleStudents() {
      this.fileReader.readAsText(this.newStudentFile)
    },
    downloadExample() {
      link.click()
    },
  },
}
</script>

<style></style>
