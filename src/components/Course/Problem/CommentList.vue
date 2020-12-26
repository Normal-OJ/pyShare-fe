<template>
  <Fragment>
    <div class="my-2 d-flex flex-row align-center flex-wrap">
      <v-col cols="12" md="6" class="d-flex">
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
      <v-tooltip bottom :disabled="!isDisabledNewComment">
        <template v-slot:activator="{ on, attrs }">
          <div v-on="on" v-permission="['ALL', 'COURSE']">
            <v-btn
              color="success"
              :disabled="isDisabledNewComment"
              v-bind="attrs"
              @click="navigate('new')"
            >
              <v-icon class="mr-1">mdi-pencil-plus</v-icon>
              新增創作
            </v-btn>
          </div>
        </template>
        <span>此主題僅限一則創作，您可以在一則創作上建立新版本的程式</span>
      </v-tooltip>
    </div>
    <div class="d-flex flex-column align-center" v-if="filteredComments.length === 0">
      <div class="text-subtitle-1 gray--text my-8">這裡還沒有任何創作，或找不到符合條件的創作</div>
      <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
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
        submission,
        replies,
      } in filteredComments"
      :key="id"
    >
      <v-hover v-slot:default="{ hover }">
        <!-- Card item -->
        <v-card class="mb-4 comment" :elevation="hover ? 6 : 2" tile @click="navigate(floor)">
          <div class="d-flex flex-row align-center">
            <v-avatar class="ml-4" size="48" color="primary">
              <span class="white--text headline">{{ author.displayName.slice(0, 1) }}</span>
            </v-avatar>
            <div class="d-flex flex-column" style="flex: 1">
              <!-- First Row -->
              <v-card-title class="d-flex flex-row align-center flex-wrap">
                <div class="text-body-1">{{ title }}</div>
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
                  <span>{{
                    `${liked.length} 個喜歡、${replies.length} 則留言、${submissions.length} 個程式版本`
                  }}</span>
                </v-tooltip>
                <v-btn
                  :color="SUBMISSION_COLOR[SUBMISSION_STATE[submission.state]]"
                  small
                  tile
                  depressed
                >
                  {{ SUBMISSION_STATE[submission.state] }}
                </v-btn>
              </v-card-title>
              <!-- Second Row -->
              <v-card-subtitle class="d-flex flex-row align-center flex-wrap">
                <router-link :to="{ name: 'profile', params: { username: author.username } }">
                  {{ author.displayName }}
                </router-link>
                <div class="text-body-2" style="white-space: pre">
                  &nbsp;·&nbsp;{{ floor }}&nbsp;樓&nbsp;·&nbsp;
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <div class="text-body-2" v-on="on" v-bind="attr">
                      {{ `發布於 ${$timeFromNow(created)}` }}
                    </div>
                  </template>
                  <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <div v-show="hasAccepted" style="white-space: pre">
                      &nbsp;·&nbsp;
                      <v-icon color="primary" small v-on="on" v-bind="attr">
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </template>
                  <span>此創作已有其中一個版本 AC </span>
                </v-tooltip>
                <v-spacer />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <div class="text-body-2" v-on="on" v-bind="attr">
                      {{ `更新於 ${$timeFromNow(updated)}` }}
                    </div>
                  </template>
                  <span>{{ `更新於 ${$formattedTime(updated)}` }}</span>
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
import { mapGetters } from 'vuex'
import { USERNAME } from '@/store/getters.type'
import { SUBMISSION_STATE, SUBMISSION_COLOR } from '@/constants/submission'

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
  SHOW_MINE: {
    value: 'SHOW_MINE',
    text: '優先顯示我的創作',
  },
}

export default {
  name: 'CommentList',

  props: {
    comments: {
      type: Array,
      required: true,
    },
    isAllowMultipleComments: {
      required: null,
    },
    subscribeRefetch: {
      type: Function,
      required: true,
    },
    unsubscribeRefetch: {
      type: Function,
      required: true,
    },
  },

  components: { Fragment },

  computed: {
    ...mapGetters({
      username: USERNAME,
    }),
    isDisabledNewComment() {
      if (this.isAllowMultipleComments) return false
      return this.comments.some(comment => comment.author.username === this.username)
    },
    sortOptions() {
      return Object.values(this.SORT_BY)
    },
    filteredComments() {
      if (this.sortby === SORT_BY.SHOW_MINE.value) {
        return this.comments
          .slice()
          .sort((a, b) => {
            if (a.author.username === this.username) return -1
            if (b.author.username === this.username) return 1
            return 0
          })
          .filter(
            comment =>
              comment.title.includes(this.searchText) ||
              comment.author.displayName.includes(this.searchText),
          )
      }
      return this.comments
        .slice()
        .sort(this.SORT_BY[this.sortby].method)
        .filter(
          comment =>
            comment.title.includes(this.searchText) ||
            comment.author.displayName.includes(this.searchText),
        )
    },
  },

  data: () => ({
    SORT_BY,
    SUBMISSION_STATE,
    SUBMISSION_COLOR,
    sortby: SORT_BY.SHOW_MINE.value,
    searchText: '',
  }),

  methods: {
    navigate(floor) {
      if (this.$route.query.floor !== floor) {
        this.$router.replace({ query: { floor } })
        this.$emit('refetchFloor')
      }
    },
  },

  mounted() {
    this.subscribeRefetch()
  },

  destroyed() {
    this.unsubscribeRefetch()
  },
}
</script>

<style scoped>
.comment {
  cursor: pointer;
}
</style>
