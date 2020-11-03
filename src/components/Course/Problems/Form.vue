<template>
  <Fragment>
    <v-text-field label="主題名稱" v-model="prob.title" outlined />
    <v-select label="主題分類" v-model="prob.tags" :items="availableTags" multiple outlined />
    <v-select
      label="顯示狀態"
      v-model="prob.status"
      :items="status"
      hint="隱藏僅老師和創題者可見"
      persistent-hint
      outlined
    />

    <div class="text-body-1 mt-4">主題敘述</div>
    <VueEditor v-model="prob.description" :editor-toolbar="customToolbar" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor :code="prob.defaultCode" />

    <v-btn class="mt-4" block color="primary" @click="submitProblem">
      送出
    </v-btn>
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
    prob: {
      deep: true,
      handler(value) {
        this.$emit('update:prob', value)
      },
    },
  },

  data() {
    return {
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }, 'blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'], // remove formatting button
      ],
      status: [
        { text: '顯示', value: 1 },
        { text: '隱藏', value: 0 },
      ],
    }
  },

  methods: {
    submitProblem() {
      this.$emit('submit')
    },
  },
}
</script>
