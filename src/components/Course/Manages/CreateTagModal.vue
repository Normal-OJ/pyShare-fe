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
        <v-icon class="mr-1">mdi-tag-plus</v-icon>
        <v-toolbar-title>新增分類</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="close">
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
          append-icon=""
        >
          <template v-slot:selection="{ parent, item }">
            <ColorLabel :tag="item" close @close-chip="remove(item)" />
          </template>
        </v-combobox>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :disabled="isSubmitDisabled" @click="submit">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel'

export default {
  name: 'CreateTagModal',

  components: { ColorLabel },

  data: () => ({
    newTags: [],
    dialog: false,
  }),

  computed: {
    isSubmitDisabled() {
      return this.newTags.length === 0
    },
  },

  methods: {
    remove(removedTag) {
      this.newTags = this.newTags.filter(tag => tag !== removedTag)
    },
    submit() {
      new Promise((resolve, reject) =>
        this.$emit('submit-new-tags', this.newTags, resolve, reject),
      ).then(() => {
        this.dialog = false
        this.newTags = []
      })
    },
    close() {
      if (this.newTags.length > 0) {
        const result = window.confirm('確定要放棄新增嗎？輸入的資料將不會被儲存。')
        if (result) {
          this.dialog = false
        }
      } else {
        this.dialog = false
      }
    },
  },
}
</script>
