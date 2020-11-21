<template>
  <v-container fluid>
    <div class="text-h1">成員</div>
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
