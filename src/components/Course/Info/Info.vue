<template>
  <v-container fluid>
    <Members :members="members" />
  </v-container>
</template>

<script>
import Members from '@/components/Course/Info/Members'

export default {
  name: 'Info',

  components: { Members },

  props: {
    info: {
      type: Object,
      required: true,
    },
  },

  computed: {
    members() {
      return this.info ? this.info.students : []
    },
  },
}
</script>
