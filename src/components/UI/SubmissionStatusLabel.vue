<template>
  <v-chip :color="state.color" :small="small" label>
    {{ state.text }}
    <slot />
  </v-chip>
</template>

<script>
import { SUBMISSION_STATUS } from '@/constants/submission'

export default {
  props: {
    status: {
      type: Number,
      required: true,
    },
    small: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    state() {
      return SUBMISSION_STATUS[String(this.status)]
    },
  },
}
</script>

<style></style>
