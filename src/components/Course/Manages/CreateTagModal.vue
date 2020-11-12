<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-tag-plus</v-icon>
        新增分類
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>新增分類</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8">
        <v-combobox
          v-model="newTags"
          label="輸入分類名稱"
          multiple="multiple"
          chips="chips"
          dense
          hint="（可輸入多個，按下 Enter 來輸入下一個分類）"
          persistent-hint
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
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
    dialog: false,
  }),

  methods: {
    submit() {
      this.$emit('submit', this.newTags)
      // TODO: getError and show feedback, conditionally close dialog
      this.dialog = false
    },
  },
}
</script>
