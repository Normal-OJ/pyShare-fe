<template>
  <v-dialog :width="$vuetify.breakpoint.mdAndUp ? '70vw' : '95vw'">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-plus</v-icon>
        新增分類
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>新增分類</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-combobox
          v-model="newTags"
          label="輸入分類名稱（可輸入多個，按下 Enter 來輸入下一個分類）"
          multiple="multiple"
          chips="chips"
        ></v-combobox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-3" color="danger" dark="dark" @click="close">取消</v-btn>
        <v-btn color="primary" :disabled="newTags === []" @click="submit">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateTagModal',

  data: () => ({
    newTags: [],
  }),

  methods: {
    submit() {
      this.$emit('submit', this.newTags)
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>
