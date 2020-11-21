<template>
  <v-dialog v-model="dialog" width="750" persistent>
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
              <v-file-input
                v-model="newStudentFile"
                label="上傳 csv 檔案"
                outlined
                truncate-length="50"
                hide-details
              />
              <div class="text-body-1 font-weight-bold mt-4 mb-1">檔案格式說明</div>
              <div class="text-body-2">
                您可以上傳一個以 <strong>utf-8</strong> 編碼的 csv 檔案（逗號分隔檔案）。
                <br />
                其中第一列為標題列，接下來每一列皆為一位學生的基本帳號資料，詳見以下說明，最下方亦有範例可以參考。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                標題列
              </div>
              <div class="text-body-2">
                必須包含四欄，分別是：
                <ul v-for="header in headers" :key="header">
                  <li>
                    <pre>{{ header }}</pre>
                  </li>
                </ul>
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                學生資料列
              </div>
              <div class="text-body-2">
                第二列開始為欲加入的學生的帳號資料，系統將會判斷該
                <code>username</code>
                若不存在，會以填寫的四個資料在系統新增這個使用者的帳號。
                <br />
                反之，若已存在於系統，將會忽略其他三個欄位的資料，然後將該使用者加入此課程。
              </div>

              <div class="text-body-1 font-weight-bold mt-4 mb-1">
                範例
              </div>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr class="text--primary text-body-1">
                      <th v-for="header in headers" :key="header">
                        <pre>{{ header }}</pre>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(content, index) in contents.slice(0, 2)" :key="index">
                      <td v-for="(data, index2) in content" :key="index2">{{ data }}</td>
                    </tr>
                    <tr>
                      <td>B123456789</td>
                      <td colspan="3" class="text--secondary text-center">
                        （已註冊過的帳號，其他欄位可填可不填）
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-btn class="my-4" block color="primary" @click="downloadExample">
                下載模板
              </v-btn>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>hi 1</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    tab: 0,
    newStudentFile: null,
    headers: ['username', 'displayName', 'password', 'email'],
    contents: [
      ['407123000S', '王大明', 'gB7hj31p', 'bigming@ntnu.edu.tw'],
      ['409456000H', '陳耳東', '409456000H', 'earEast@ntu.edu.tw'],
      ['B123456789', '（已註冊過的帳號，其他欄位可填可不填）'],
    ],
  }),

  methods: {
    submit() {
      this.$emit('submit')
      // TODO: getError and show feedback, conditionally close dialog
      this.dialog = false
    },
    downloadExample() {
      const allContents = this.contents.slice()
      allContents.unshift(this.headers)
      const csvContent =
        'data:text/csv;charset=utf-8,' + allContents.map(e => e.join(',')).join('\n')
      const link = document.createElement('a')
      link.download = 'template.csv'
      link.href = csvContent
      link.click()
    },
  },
}
</script>
