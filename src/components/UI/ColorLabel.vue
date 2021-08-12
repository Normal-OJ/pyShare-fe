<template>
  <v-chip
    label
    :small="small"
    :color="labelColor.color"
    :dark="labelColor.dark"
    class="text-body-2"
    :close="close"
    @click:close="$emit('close-chip')"
  >
    {{ tag }}
  </v-chip>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      required: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    labelColor() {
      const hash = this.tag.split('').reduce((a, b) => {
        return a + b.charCodeAt(0)
      }, 0)
      return this.color[hash % this.color.length]
    },
  },

  data: () => ({
    color: [
      { color: '#d32f2f', dark: true },
      { color: '#C2185B', dark: true },
      { color: '#7B1FA2', dark: true },
      { color: '#512DA8', dark: true },
      { color: '#303F9F', dark: true },
      { color: '#1976D2', dark: true },
      { color: '#0288D1', dark: true },
      { color: '#0097A7', dark: true },
      { color: '#00796B', dark: true },
      { color: '#388E3C', dark: true },
      { color: '#689F38', dark: true },
      { color: '#AFB42B', dark: true },
      { color: '#FFA000', dark: true },
      { color: '#F57C00', dark: true },
      { color: '#E64A19', dark: true },
      { color: '#5D4037', dark: true },
      { color: '#616161', dark: true },
      { color: '#455A64', dark: true },
    ],
  }),
}
</script>
