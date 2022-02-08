<template>
  <v-btn
    outlined
    small
    color="primary"
    style="font-size: 0.875rem"
    @click="$emit('preview')"
  >
    <span class="text-none mr-1">{{ truncatedName }}</span>
    <v-btn
      v-if="download"
      icon
      small
      @click.stop="$emit('download')"
    >
      <v-icon color="primary">
        mdi-download
      </v-icon>
    </v-btn>
    <slot name="append" />
  </v-btn>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    download: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    truncatedName() {
      return this.name.length <= 14 ?
        this.name :
        `${this.name.substring(0, 8)}...${this.name.substring(this.name.length - 6)}`
    },
  },
}
</script>

<style></style>
