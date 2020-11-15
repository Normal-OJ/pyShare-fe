<template>
  <Fragment>
    <div class="my-2 d-flex flex-row align-center">
      <v-col cols="10" md="6" class="d-flex">
        <v-select
          v-model="sortby"
          class="mr-3"
          label="排序依據"
          outlined
          hide-details
          :items="sortOptions"
          dense
        />
        <v-text-field
          v-model="searchText"
          label="快速搜尋"
          outlined
          hide-details
          append-icon="mdi-magnify"
          single-line
          dense
        />
      </v-col>
      <v-spacer />
      <v-btn color="success">
        <v-icon class="mr-1">mdi-playlist-plus</v-icon>
        新增創作
      </v-btn>
    </div>
    <div
      v-for="{
        title,
        id,
        floor,
        author,
        hasAccepted,
        created,
        updated,
        liked,
        submissions,
        replies,
      } in filteredComments"
      :key="id"
    >
      <v-hover v-slot:default="{ hover }">
        <!-- Card item -->
        <v-card class="mb-4 comment" :elevation="hover ? 6 : 2" tile @click="navigate(floor)">
          <div class="d-flex flex-row align-center">
            <v-avatar class="ml-4" size="48">
              <img src="http://fakeimg.pl/48x48" />
            </v-avatar>
            <div class="d-flex flex-column" style="flex: 1">
              <!-- First Row -->
              <v-card-title class="d-flex flex-row align-center">
                <div class="text-body-1">
                  {{ title }}
                </div>
                <v-spacer />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <v-card-subtitle class="d-flex align-center pa-0" v-on="on" v-bind="attr">
                      <v-icon small class="pt-1 mr-1">
                        mdi-heart-outline
                      </v-icon>
                      <div class="text-body-2 mr-4">{{ liked.length }}</div>
                      <v-icon small class="pt-1 mr-1">
                        mdi-comment-outline
                      </v-icon>
                      <div class="text-body-2 mr-3">{{ replies.length }}</div>
                      <v-icon small class="pt-1 mr-1">
                        mdi-code-tags
                      </v-icon>
                      <div class="text-body-2 mr-4">{{ submissions.length }}</div>
                    </v-card-subtitle>
                  </template>
                  <span>
                    {{
                      `${liked.length} 個喜歡、${replies.length} 則留言、${submissions.length} 個程式版本`
                    }}
                  </span>
                </v-tooltip>
                <v-btn color="primary" small tile depressed>PENDING</v-btn>
              </v-card-title>
              <!-- Second Row -->
              <v-card-subtitle class="d-flex flex-row align-center">
                <router-link :to="{ name: 'profile', params: { username: author.username } }">
                  {{ author.displayName }}
                </router-link>
                <div class="text-body-2">&nbsp;·&nbsp;{{ floor }}&nbsp;樓&nbsp;·&nbsp;</div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <div class="text-body-2" v-on="on" v-bind="attr">
                      {{ `opened ${$timeToNow(created)}` }}
                    </div>
                  </template>
                  <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <div v-if="hasAccepted">
                      &nbsp;·&nbsp;
                      <v-icon color="primary" small v-on="on" v-bind="attr">
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </template>
                  <span>此創作已有其中一個版本 AC </span>
                </v-tooltip>
                <v-spacer />
                <v-tooltip left>
                  <template v-slot:activator="{ on, attr }">
                    <div class="text-body-2" v-on="on" v-bind="attr">
                      {{ `updated ${$timeToNow(updated)}` }}
                    </div>
                  </template>
                  <span>{{ `最後更新於 ${$formattedTime(updated)}` }}</span>
                </v-tooltip>
              </v-card-subtitle>
            </div>
          </div>
        </v-card>
      </v-hover>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

const SORT_BY = {
  TIME_DESCENDING: {
    value: 'TIME_DESCENDING',
    text: '發布時間（新到舊）',
    method: (a, b) => b.created - a.created,
  },
  TIME_ASCENDING: {
    value: 'TIME_ASCENDING',
    text: '發布時間（舊到新）',
    method: (a, b) => a.created - b.created,
  },
  LIKES_DESCENDING: {
    value: 'LIKES_DESCENDING',
    text: '愛心數（多到少）',
    method: (a, b) => b.liked.length - a.liked.length,
  },
  LIKES_ASCENDING: {
    value: 'LIKES_ASCENDING',
    text: '愛心數（少到多）',
    method: (a, b) => a.liked.length - b.liked.length,
  },
}

export default {
  name: 'CommentList',

  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  components: { Fragment },

  computed: {
    sortOptions() {
      return Object.values(this.SORT_BY)
    },
    filteredComments() {
      return this.comments.slice().sort(this.SORT_BY[this.sortby].method)
    },
  },

  data: () => ({
    SORT_BY,
    sortby: SORT_BY.TIME_ASCENDING.value,
    searchText: '',
  }),

  methods: {
    navigate(floor) {
      if (this.$route.query.floor !== floor) {
        this.$router.replace({ query: { floor } })
      }
    },
  },
}
</script>

<style scoped>
.comment {
  cursor: pointer;
}
</style>
