<template>
  <v-card flat>
    <v-card-text class="text--primary">
      <div class="d-flex align-center mt-2">
        <v-file-input
          v-model="newStudentFile"
          label="上傳 CSV 檔案"
          outlined
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
        <p class="text-h6 mt-4">使用 CSV 檔案來新增多個學生</p>

        <p class="text-subtitle-1 font-weight-medium mt-5 mb-1">步驟一：下載範本檔案</p>
        <p>
          <a @click="downloadExample">點我下載範本檔案</a>
        </p>

        <p class="text-subtitle-1 font-weight-medium mt-5 mb-1">步驟二：填入使用者資訊</p>
        對於每一位要新增的使用者，在檔案的對應資料欄中輸入下列<strong>必要資訊</strong>：
        <ul>
          <li>
            <code>school</code>（須為
            <v-dialog v-model="schoolTableDialog" width="750">
              <template v-slot:activator="{ on, attrs }">
                <a v-bind="attrs" v-on="on">學校對照表 </a>
              </template>
              <v-card>
                <v-card-title class="d-flex">
                  <p class="text-subtitle-1">學校為「無」的代號為「空字串」，該儲存格應留空</p>
                  <v-spacer />
                  <v-btn icon @click="schoolTableDialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-simple-table class="pa-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>學校名稱</th>
                        <th>代號</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="{ abbr, name } in schoolOptions || []" :key="abbr">
                        <td class="text-body-1">{{ name }}</td>
                        <td class="text-body-1">
                          <code>{{ abbr }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>

              <Spinner v-if="!schoolOptions" />
            </v-dialog>
            的其中一個代號，學校為「無」則留空）
          </li>
          <li><code>username</code>（使用者名稱，至多 16 字元，慣例上會使用學號）</li>
          <li><code>displayName</code>（平台內顯示的名稱，至多 32 字元）</li>
          <li><code>password</code>（密碼，長度不限）</li>
        </ul>

        <p class="text-subtitle-1 font-weight-medium mt-5 mb-1">注意事項</p>
        <ul>
          <li>
            在送出檔案後會先彈出預覽檔案內容的視窗，若內容出現亂碼，請確認您的檔案是否使用 utf-8
            編碼。
          </li>
          <li>日後學生登入平台可以自行修改密碼，其他欄位目前不開放修改。</li>
        </ul>

        <p class="text-subtitle-1 font-weight-medium mt-5 mb-1">
          如果我的學生已擁有平台帳號了怎麼辦？
        </p>
        <p>
          您可以向該學生詢問他的 <code>school</code> 與
          <code>username</code> 並填寫進檔案中，而另外兩個欄位留空。<br />
          此平台以 <code>school</code> + <code>username</code>
          的組合來辨認唯一使用者，在新增學生時，系統會自行檢查該組合是否已存在於系統，若已存在則將該使用者直接加入此課程，剩餘的兩個欄位會被忽略，反之則會進行新帳號的創建。
        </p>

        <p class="text-subtitle-1 font-weight-medium mt-5 mb-1">
          若無法下載範本檔案，請參考以下範例
        </p>
        <PreviewCSV :data="template" />
        <p>
          第一列為欄位名稱
          <code>school</code
          >、<code>username</code>、<code>displayName</code>、<code>password</code>。<br />
          第二列開始每列填入一位學生的資料，例如第一位學生其學校為「無」<br />
          最後一列填入的資料示範了如果該學生已有帳號，則只需要填寫他的 <code>school</code> 與
          <code>username</code>。
        </p>
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
import { downloadFile } from '@/lib/utils'

const template =
  'school,username,displayName,password\n,400123456S,王大明,gB7hj31p\nNTNU,409456000H,陳耳東,409456000H\nNTUST,B123456789,,'
const csvContent = 'data:text/csv;charset=utf-8,' + template

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
    schoolTableDialog: false,
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
      downloadFile('批次新增學生範例檔案.csv', csvContent)
    },
  },
}
</script>

<style></style>
