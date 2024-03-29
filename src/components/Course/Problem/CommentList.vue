<template>
  <div>
    <v-row
      class="my-2"
      align="center"
    >
      <v-col
        cols="12"
        lg="3"
        sm="6"
      >
        <v-select
          v-model="sortby"
          class="mr-3"
          label="排序依據"
          outlined
          hide-details
          append-icon="mdi-sort"
          :items="sortOptions"
          dense
        />
      </v-col>
      <v-col
        cols="12"
        lg="3"
        sm="6"
      >
        <v-select
          v-model="statusFilter"
          class="mr-3"
          label="狀態篩選"
          outlined
          hide-details
          multiple
          append-icon="mdi-filter"
          :items="statusOptions"
          dense
        >
          <template #selection="{ item, index }">
            <span v-if="statusFilter.length === statusOptions.length && index === 0">
              顯示全部
            </span>
            <SubmissionStatusLabel
              v-else-if="statusFilter.length !== statusOptions.length"
              :status="item"
            />
          </template>
          <template #item="{ item, attrs, on }">
            <v-list-item
              v-slot="{ active }"
              v-bind="attrs"
              v-on="on"
            >
              <v-list-item-action>
                <v-checkbox :input-value="active" />
              </v-list-item-action>
              <v-list-item-title>
                <SubmissionStatusLabel :status="item" />
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col
        cols="12"
        lg="3"
        sm="6"
      >
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
      <v-col
        class="align"
        cols="12"
        lg="3"
        sm="6"
      >
        <v-tooltip
          bottom
          :disabled="!isDisabledNewComment"
        >
          <template #activator="{ on, attrs }">
            <div v-on="on">
              <v-btn
                v-if="canParticipateCourse"
                color="success"
                :disabled="isDisabledNewComment"
                v-bind="attrs"
                @click="navigate('new')"
              >
                <v-icon class="mr-1">
                  mdi-pencil-plus
                </v-icon>
                新增創作
              </v-btn>
            </div>
          </template>
          <span>此主題僅限一則創作，您可以在一則創作上建立新版本的程式</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <div
      v-if="filteredComments.length === 0"
      class="d-flex flex-column align-center"
    >
      <div class="text-subtitle-1 gray--text my-8">
        這裡還沒有任何創作，或找不到符合條件的創作
      </div>
      <v-img
        :src="require('@/assets/images/noData.svg')"
        max-width="600"
        contain
      />
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
      <v-hover v-slot="{ hover }">
        <!-- Card item -->
        <v-card
          class="mb-4 comment"
          :elevation="hover ? 6 : 2"
          tile
          @click="navigate(floor)"
        >
          <div class="d-flex flex-row align-center">
            <Gravatar
              class="ml-4"
              :size="48"
              :md5="author.md5"
            />
            <div
              class="d-flex flex-column"
              style="flex: 1"
            >
              <!-- First Row -->
              <v-card-title class="d-flex flex-row align-center flex-wrap">
                <div class="text-body-1">
                  {{ title }}
                </div>
                <v-spacer />
                <v-tooltip bottom>
                  <template #activator="{ on, attr }">
                    <v-card-subtitle
                      class="d-flex align-center pa-0"
                      v-bind="attr"
                      v-on="on"
                    >
                      <v-icon
                        small
                        class="pt-1 mr-1"
                      >
                        mdi-heart-outline
                      </v-icon>
                      <div class="text-body-2 mr-4">
                        {{ liked.length }}
                      </div>
                      <v-icon
                        small
                        class="pt-1 mr-1"
                      >
                        mdi-comment-outline
                      </v-icon>
                      <div class="text-body-2 mr-3">
                        {{ replies.length }}
                      </div>
                      <v-icon
                        small
                        class="pt-1 mr-1"
                      >
                        mdi-code-tags
                      </v-icon>
                      <div class="text-body-2 mr-4">
                        {{ submissions.length }}
                      </div>
                    </v-card-subtitle>
                  </template>
                  <span>{{
                    `${liked.length} 個喜歡、${replies.length} 則留言、${submissions.length} 個程式版本`
                  }}</span>
                </v-tooltip>
                <v-btn
                  v-if="SUBMISSION_STATUS[`${submission.state}`]"
                  :color="SUBMISSION_STATUS[`${submission.state}`].color"
                  small
                  tile
                  depressed
                >
                  {{ SUBMISSION_STATUS[`${submission.state}`].text }}
                </v-btn>
              </v-card-title>
              <!-- Second Row -->
              <v-card-subtitle class="d-flex flex-row align-center flex-wrap">
                <router-link :to="{ name: 'profile', params: { id: author.id } }">
                  {{ author.displayName }}
                </router-link>
                <div
                  class="text-body-2"
                  style="white-space: pre"
                >
                  &nbsp;·&nbsp;{{ floor }}&nbsp;樓&nbsp;·&nbsp;
                </div>
                <v-tooltip bottom>
                  <template #activator="{ on, attr }">
                    <div
                      class="text-body-2"
                      v-bind="attr"
                      v-on="on"
                    >
                      {{ `發布於 ${$timeFromNow(created)}` }}
                    </div>
                  </template>
                  <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attr }">
                    <div
                      v-show="hasAccepted"
                      style="white-space: pre"
                    >
                      &nbsp;·&nbsp;
                      <v-icon
                        color="primary"
                        small
                        v-bind="attr"
                        v-on="on"
                      >
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </template>
                  <span>此創作已有其中一個版本 AC </span>
                </v-tooltip>
                <v-spacer />
                <v-tooltip bottom>
                  <template #activator="{ on, attr }">
                    <div
                      class="text-body-2"
                      v-bind="attr"
                      v-on="on"
                    >
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SUBMISSION_STATUS } from '@/constants/submission'
import { canParticipateCourseMixin } from '@/lib/permissionMixin'

export default {
  name: 'CommentList',
  mixins: [canParticipateCourseMixin],
  props: {
    comments: {
      type: Array,
      required: true,
    },
    isAllowMultipleComments: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      SUBMISSION_STATUS,
      searchText: '',
      statusOptions: Object.keys(SUBMISSION_STATUS).map((s) => Number(s)),
      statusFilter: Object.keys(SUBMISSION_STATUS).map((s) => Number(s)),
      sortby: 'SHOW_MINE',
    }
  },
  computed: {
    ...mapState({
      username: (state) => state.auth.username,
    }),
    isDisabledNewComment() {
      if (this.isAllowMultipleComments) return false
      return this.comments.some((comment) => comment.author.username === this.username)
    },
    sortOptions() {
      return Object.values(this.SORT_BY)
    },
    filteredComments() {
      return this.comments
        .slice()
        .sort(this.SORT_BY[this.sortby].method)
        .filter(
          (comment) =>
            comment.title.includes(this.searchText) ||
            comment.author.displayName.includes(this.searchText),
        )
    },
    SORT_BY() {
      return {
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
          method: (a, b) => {
            if (a.author.username === this.username) return -1
            if (b.author.username === this.username) return 1
            return 0
          },
        },
      }
    },
  },
  watch: {
    filteredComments: {
      handler() {
        this.$emit('change-filtered-comments', this.filteredComments)
      },
      immediate: true,
    },
  },
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
