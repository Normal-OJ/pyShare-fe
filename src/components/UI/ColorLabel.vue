<template>
  <v-chip label :small="small" :color="labelColor.color" :dark="labelColor.dark">
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
  },

  computed: {
    labelColor() {
      const hash = this.tag.charCodeAt(0)
      return this.color[hash % this.color.length]
    },
  },

  data: () => ({
    color: [
      { color: '#3d5a80', dark: true },
      { color: '#293241', dark: true },
      { color: '#797d62', dark: true },
      { color: '#d08c60', dark: true },
      { color: '#a6808c', dark: true },
      { color: '#d81159', dark: true },
      { color: '#b9375e', dark: true },
      { color: '#f2b5d4', dark: false },
      { color: '#7bdff2', dark: false },
    ],
  }),
}
</script>
