<template>
  <v-chip
    label
    :small="small"
    :color="labelColor.color"
    :style="{ color: labelColor.textColor }"
    class="text-body-2 font-weight-medium"
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

  data: () => ({
    color: [
      { color: '#FECACA', textColor: '#B91C1C' },
      { color: '#FED7AA', textColor: '#C2410C' },
      { color: '#FDE68A', textColor: '#B45309' },
      { color: '#FEF08A', textColor: '#A16207' },
      { color: '#BBF7D0', textColor: '#15803D' },
      { color: '#A7F3D0', textColor: '#047857' },
      { color: '#99F6E4', textColor: '#0F766E' },
      { color: '#A5F3FC', textColor: '#0E7490' },
      { color: '#BFDBFE', textColor: '#1D4ED8' },
      { color: '#C7D2FE', textColor: '#4338CA' },
      { color: '#DDD6FE', textColor: '#6D28D9' },
      { color: '#E9D5FF', textColor: '#7E22CE' },
      { color: '#F5D0FE', textColor: '#A21CAF' },
      { color: '#FBCFE8', textColor: '#BE185D' },
      { color: '#FECDD3', textColor: '#BE123C' },
    ],
  }),

  computed: {
    labelColor() {
      const hash = this.tag.split('').reduce((a, b) => {
        return a + b.charCodeAt(0)
      }, 0)
      return this.color[hash % this.color.length]
    },
  },
}
</script>
