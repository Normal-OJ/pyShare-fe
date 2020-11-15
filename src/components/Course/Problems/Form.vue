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
    <TextEditor v-model="prob.description" />

    <div class="text-body-1 mt-4">預設程式碼</div>
    <CodeEditor v-model="prob.defaultCode" />

    <v-btn class="mt-4" block color="primary" @click="submitProblem">
      送出
    </v-btn>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import TextEditor from '@/components/TextEditor'
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'Form',

  components: { Fragment, TextEditor, CodeEditor },

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
