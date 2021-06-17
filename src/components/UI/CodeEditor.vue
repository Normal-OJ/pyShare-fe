<template>
  <div>
    <v-row>
      <v-col cols="auto">
        <slot></slot>
      </v-col>
      <v-spacer />
      <v-col cols="4" class="d-flex align-center">
        <span class="text-subtitle-2 mr-2">編輯器</span>
        <v-slider
          v-model="containerHeight"
          min="200"
          max="1000"
          hide-details
          append-icon="mdi-arrow-expand-vertical"
          prepend-icon="mdi-arrow-collapse-vertical"
          @click:append="containerHeight = Math.min(1000, containerHeight + 100)"
          @click:prepend="containerHeight = Math.max(200, containerHeight - 100)"
        />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <span class="text-subtitle-2 mr-1">字體</span>
        <v-btn
          color="primary"
          icon
          tile
          :disabled="fontSize <= 8"
          @click="fontSize = Math.max(8, fontSize - 2)"
        >
          <v-icon>mdi-format-font-size-decrease</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          icon
          tile
          :disabled="fontSize >= 28"
          @click="fontSize = Math.min(28, fontSize + 2)"
        >
          <v-icon>mdi-format-font-size-increase</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <MonacoEditor
      class="editor"
      ref="editor"
      :style="{ height: containerHeight + 'px' }"
      :value="value"
      :options="options"
      @change="handleChange"
      @editorDidMount="editorDidMount"
    />
  </div>
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
    height: {
      type: Number,
      default: null,
    },
  },

  computed: {
    options() {
      return {
        language: 'python',
        automaticLayout: true,
        fontSize: this.fontSize,
        scrollbar: { alwaysConsumeMouseWheel: false },
        minimap: { enabled: false },
        readOnly: this.readOnly,
      }
    },
  },

  data: () => ({
    editor: null,
    fontSize: 14,
    containerHeight: 400,
  }),

  methods: {
    editorDidMount(editorInstance) {
      this.editor = editorInstance
      window.addEventListener('resize', this.handleResize)
    },
    handleChange(val) {
      this.$emit('input', val)
    },
    handleResize() {
      this.editor.layout()
    },
  },

  mounted() {
    if (this.height) this.containerHeight = this.height
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
.editor {
  border: 1px solid grey;
  text-align: left;
}
</style>
