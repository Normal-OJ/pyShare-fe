<template>
  <div ref="container" style="width:100%;height:600px;border:1px solid grey;text-align: left" />
</template>
<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'CodeEditor',

  props: {
    code: {
      type: String,
      required: true,
    },
  },

  mounted() {
    // eslint-disable-next-line no-unused-vars
    const editor = monaco.editor.create(this.$refs.container, {
      value: this.code,
      language: 'python',
      fontSize: 14,
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
    })
  },
}
</script>
