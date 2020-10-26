<template>
  <Fragment>
    <div class="d-flex flex-row">
      <v-spacer />
      <v-btn icon :to="{ query: { selectedCommentId: null } }"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <div class="text-h4 title">{{ comment.title }}</div>
    <div class="d-flex flex-row mt-4">
      <v-avatar class="mr-2" size="48">
        <img src="http://fakeimg.pl/48x48" />
      </v-avatar>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'about' }">
          {{ comment.author.displayName }}
        </router-link>
      </div>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: 'CommentDetail',

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  components: { Fragment },

  data: () => ({}),
}
</script>
