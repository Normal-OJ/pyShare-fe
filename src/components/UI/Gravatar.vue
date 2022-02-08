<template>
  <v-avatar :size="size">
    <v-img :src="source" />
  </v-avatar>
</template>

<script>
import config from '@/constants/config'

export default {
  props: {
    size: {
      type: Number,
      required: true,
    },
    md5: {
      type: String,
      required: true,
    },
  },
  computed: {
    source() {
      // FIXME: do not depend on noj avatar
      const defaultAvatar = encodeURI(config.DEFAULT_AVATAR)
      const url = `${config.GRAVATAR_API_BASE_URL}/${this.md5}?d=${defaultAvatar}`
      return url
    },
  },
}
</script>

<style></style>
