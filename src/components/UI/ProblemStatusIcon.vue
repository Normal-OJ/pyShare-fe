<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attr }">
      <v-icon :color="v.color" v-on="on" v-bind="attr">
        {{ v.icon }}
      </v-icon>
    </template>
    <span>{{ v.label }}</span>
  </v-tooltip>
</template>

<script>
import { ACCEPTANCE } from '@/constants/problem'

export default {
  props: {
    acceptance: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    return { v: ACCEPTANCE[props.acceptance] }
  },
}
</script>
