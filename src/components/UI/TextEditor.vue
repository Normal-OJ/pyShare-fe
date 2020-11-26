<template>
  <VueEditor :value="value" @input="$emit('input', $event)" :editor-toolbar="customToolbar" />
</template>

<script>
import { VueEditor } from 'vue2-editor'

const customToolbar = [
  [{ header: [false, 1, 2, 3, 4, 5, 6] }],
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  [{ color: [] }, { background: [] }, 'blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean'], // remove formatting button
]

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  components: { VueEditor },

  data: () => ({
    customToolbar,
  }),
}
</script>
