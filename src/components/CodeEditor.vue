<template>
  <div ref="container" style="width:100%;height:600px;border:1px solid grey;text-align: left"></div>
</template>
<script>
import * as monaco from 'monaco-editor' // 包體很大了 但是demo可以跑起來

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
      fontSize: 14, // 字型大小
    })
  },
}
</script>
