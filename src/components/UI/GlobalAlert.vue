<template>
  <v-dialog :value="true">
    <v-card />
  </v-dialog>
</template>

<script>
// TODO: how to import all exported things?
import { NETWORK_ERROR } from '@/constants/globalAlert'

export default {
  props: {
    error: {
      type: String,
      required: true,
    },
  },

  computed: {
    icon() {
      switch (this.errorType) {
        case NETWORK_ERROR:
          return 'mdi-wifi-alert'
        default:
          return 'mdi-question'
      }
    },
  },
}
</script>
