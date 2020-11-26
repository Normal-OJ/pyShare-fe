<template>
  <div
    ref="container"
    style="height: 300px;border:1px solid grey;text-align: left"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'CodeEditor',

  props: {
    value: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    editor: null,
  }),

  mounted() {
    this.editor = monaco.editor.create(this.$refs.container, {
      value: this.value,
      language: 'python',
      fontSize: 14,
      scrollbar: { alwaysConsumeMouseWheel: false },
      minimap: { enabled: false },
      readOnly: this.readOnly,
    })
  },
}
</script>
