<template>
  <Fragment>
    <div class="text-h5 font-weight-bold text-center">{{ prob.title }}</div>
    <div class="d-flex flex-row mt-4">
      <v-avatar class="mr-2" size="48">
        <img src="http://fakeimg.pl/48x48" />
      </v-avatar>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'about' }">
          {{ prob.author.displayName }}
        </router-link>
        <div class="text-body-2 d-flex">
          Jul 12, 2020
          <div v-if="prob.tags && prob.tags.length > 0" style="white-space: pre">
            &nbsp;·&nbsp;
          </div>
        </div>
      </div>
    </div>
    <v-row class="mt-6">
      <v-col cols="9">
        <div class="text-body-1" v-html="prob.description" />
      </v-col>
      <v-col cols="3">
        <div class="text-body-1">分類</div>
        <v-chip class="text-caption mr-1" v-for="tag in prob.tags" :key="tag" small>
          {{ tag }}
        </v-chip>
      </v-col>
    </v-row>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: 'Problem',

  props: {
    prob: {
      type: Object,
      required: true,
    },
  },

  components: { Fragment },

  data: () => ({}),
}
</script>
