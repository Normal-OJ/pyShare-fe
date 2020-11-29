<template>
  <MonacoEditor class="editor" :value="value" @change="$emit('input', $event)" :options="options" />
</template>

<script>
import MonacoEditor from 'vue-monaco'

export default {
  name: 'CodeEditor',

  components: { MonacoEditor },

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

  computed: {
    options() {
      return {
        language: 'python',
        fontSize: 14,
        scrollbar: { alwaysConsumeMouseWheel: false },
        minimap: { enabled: false },
        readOnly: this.readOnly,
      }
    },
  },
}
</script>

<style>
.editor {
  height: 300px;
  border: 1px solid grey;
  text-align: left;
}
</style>
