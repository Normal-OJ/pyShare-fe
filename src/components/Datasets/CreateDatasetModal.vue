<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-folder-plus</v-icon>
        新增資料集
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-icon class="mr-1">mdi-folder-plus</v-icon>
        <v-toolbar-title>新增課程</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <div class="mb-4 text-body-1">
          資料集內容可在日後修改。
        </div>
        <v-form ref="form">
          <v-text-field
            label="資料集名稱"
            v-model="dataset.title"
            :rules="[v => !!v || '請填寫資料集名稱']"
            outlined
            color="primary"
            dense
          />
          <v-textarea
            label="資料夾說明"
            v-model="dataset.description"
            rows="10"
            outlined
            color="primary"
          />
          <v-file-input
            label="上傳檔案"
            v-model="dataset.attachments"
            multiple
            color="primary"
            prepend-icon="mdi-file-upload"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :disabled="isDisabled" :loading="isLoading" @click="submit">
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    isLoading: false,
    dataset: {
      title: '',
      description: '',
      attachments: [],
    },
  }),

  computed: {
    isDisabled() {
      const { title, attachments } = this.dataset
      return !title || attachments.length == 0
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const body = { ...this.dataset }
        new Promise((resolve, reject) => this.$emit('submit', body, resolve, reject))
          .then(() => {
            this.dialog = false
            this.$alertSuccess('新增資料集成功。')
          })
          .catch(() => {
            this.$alertFail('新增資料集失敗')
          })
          .finally(() => (this.isLoading = false))
      }
    },
  },
}
</script>

<style></style>
