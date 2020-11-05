<template>
  <v-container>
    <div v-html="content"></div>
    <CodeEditor :code="submission.code" readOnly />
  </v-container>
</template>

<script>
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'Comment',

  components: { CodeEditor },

  props: {
    content: {
      type: String,
      required: true,
    },
    submission: {
      type: Object,
      required: true,
    },
  },
}
</script>
