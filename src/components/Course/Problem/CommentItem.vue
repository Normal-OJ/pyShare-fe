<template>
  <v-hover v-slot:default="{ hover }">
    <v-card class="mb-4 comment" :elevation="hover ? 6 : 2" @click="navigate">
      <v-card-title class="text-subtitle-1 d-flex">
        {{ title }}
        <v-spacer />
        <v-chip color="primary" label small>PENDING</v-chip>
      </v-card-title>
      <v-card-subtitle>
        {{ `#${floor} · opened 1 week ago` }}
        {{ ' · ' }}
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attr }">
            <v-icon color="primary" small v-on="on" v-bind="attr">
              mdi-check-circle
            </v-icon>
          </template>
          <span>此創作已有其中一個版本被批改完成</span>
        </v-tooltip>
      </v-card-subtitle>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'Comment',

  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
  },

  methods: {
    navigate() {
      this.$router.replace({ query: { selectedCommentId: this.id } })
    },
  },
}
</script>

<style scoped>
.comment {
  cursor: pointer;
}
</style>
