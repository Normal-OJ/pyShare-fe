<template>
  <div>
    <v-row>
      <v-col cols="auto">
        <slot />
      </v-col>
    </v-row>
    <codemirror
      class="editor"
      :value="value"
      :options="options"
      :style="{ height: 'auto', fontSize }"
      @input="handleChange"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/python/python.js'

export default {
  name: 'CodeEditor',

  components: { codemirror },

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
    fontSize: 14,
  }),

  computed: {
    options() {
      return {
        language: 'python',
        line: true,
        lineNumbers: true,
        tabSize: 4,
        readOnly: this.readOnly,
      }
    },
  },

  methods: {
    handleChange(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style>
.editor {
  border: 1px solid grey;
  text-align: left;
}
.CodeMirror-gutters {
  left: 0 !important;
}
.CodeMirror-gutter-wrapper {
  left: -30px !important;
}
</style>
