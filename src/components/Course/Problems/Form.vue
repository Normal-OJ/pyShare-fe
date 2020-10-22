<template>
  <Fragment>
    <v-text-field label="主題名稱" v-model="newProb.title" outlined />
    <v-select label="主題分類" v-model="newProb.tags" :items="availableTags" multiple outlined />
    <v-select
      label="顯示狀態"
      v-model="newProb.status"
      :items="status"
      hint="隱藏僅老師和創題者可見"
      persistent-hint
      outlined
    />

    <div class="text-body-1 mt-4">主題敘述</div>
    <VueEditor v-model="newProb.content" :editor-toolbar="customToolbar" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor :code="newProb.defaultCode" />
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import { VueEditor } from 'vue2-editor'
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'Form',

  components: { Fragment, VueEditor, CodeEditor },

  props: {
    availableTags: {
      type: Array,
      default: () => ['A', 'B', 'C'],
    },
    prob: {
      type: Object,
      required: true,
    },
  },

  watch: {
    newProb: {
      deep: true,
      handler(value) {
        this.$emit('update:prob', value)
      },
    },
  },

  data() {
    return {
      newProb: { ...this.prob },
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ color: [] }, { background: [] }, 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'], // remove formatting button
      ],
      status: [
        { text: '顯示', value: 1 },
        { text: '隱藏', value: 0 },
      ],
    }
  },
}
</script>
