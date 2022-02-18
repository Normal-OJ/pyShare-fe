<template>
  <v-dialog
    v-model="dialog"
    width="750"
    persistent
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="success"
        dark
        v-bind="attrs"
        v-on="on"
      >
        <v-icon class="mr-1">
          mdi-tag-plus
        </v-icon>
        {{ title }}
      </v-btn>
    </template>

    <v-card>
      <v-toolbar
        dark
        color="primary"
        dense
      >
        <v-icon class="mr-1">
          mdi-tag-plus
        </v-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8">
        <div>選單已有一些建議的分類，您也可以自行新增分類，輸入名稱後按下 Enter 鍵即可。</div>

        <div class="mb-4">
          一次可以加入多個分類，最後按下右下角的確認後才會儲存您新增的分類。
        </div>

        <v-combobox
          v-model="newTags"
          label="輸入分類名稱"
          multiple
          chips
          :items="items"
        >
          <template #selection="{ item }">
            <ColorLabel
              :tag="item"
              close
              @close-chip="remove(item)"
            />
          </template>
        </v-combobox>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :disabled="isSubmitDisabled"
          @click="submit"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateTagModal',

  props: {
    title: {
      type: String,
      default: '新增分類',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

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
      this.newTags = this.newTags.filter((tag) => tag !== removedTag)
    },
    submit() {
      this.$emit(
        'submit', {
          existTags: this.newTags.filter((tag) => this.items.includes(tag)),
          newTags: this.newTags.filter((tag) => !this.items.includes(tag)),
        },
        () => {
          this.dialog = false
          this.newTags = []
        },
      )
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
