<template>
  <VueEditor
    :value="value"
    :editor-toolbar="customToolbar"
    @input="$emit('input', $event)"
  />
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

  components: { VueEditor },
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    customToolbar,
  }),
}
</script>
