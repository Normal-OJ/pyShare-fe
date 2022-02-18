<template>
  <v-container fluid>
    <v-row no-gutters>
      <div class="text-h5">
        管理分類
      </div>
      <v-spacer />
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-row no-gutters>
          <div class="flex flex-col">
            <div class="text-h6">
              主題分類
            </div>
            <div class="text-subtitle-1">
              以下為在此課程內的主題可使用的分類
            </div>
          </div>
          <v-spacer />
          <CreateTagModal
            title="新增主題分類"
            :items="candidateProblemTags"
            @submit="(tags, cb) => addCourseTags(tags, cb, TAG_CATES.NORMAL_PROBLEM)"
          />
        </v-row>

        <v-card
          class="my-6"
          tile
        >
          <v-list v-if="courseProblemTags">
            <div
              v-show="courseProblemTags.length === 0"
              class="text-center py-4"
            >
              <div class="text-body-2 mb-2">
                課程沒有可用的主題分類，快加入一些吧！
              </div>
              <v-img
                :src="require('@/assets/images/emptyBox.svg')"
                max-height="100"
                contain
              />
            </div>
            <v-list-item
              v-for="item in courseProblemTags"
              :key="item"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <ColorLabel
                    :tag="item"
                    small
                  />
                </v-list-item-title>
              </v-list-item-content>
              <v-tooltip left>
                <template #activator="{ on }">
                  <v-btn
                    color="secondary"
                    small="small"
                    icon
                    v-on="on"
                    @click="removeCourseTag(item, TAG_CATES.NORMAL_PROBLEM)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>移除</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
          <spinner v-else />
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-row no-gutters>
          <div class="flex flex-col">
            <div class="text-h6">
              測驗分類
            </div>
            <div class="text-subtitle-1">
              以下為在此課程內的測驗可使用的分類
            </div>
          </div>
          <v-spacer />
          <CreateTagModal
            title="新增測驗分類"
            :items="candidateChallengeTags"
            @submit="(tags, cb) => addCourseTags(tags, cb, TAG_CATES.OJ_PROBLEM)"
          />
        </v-row>
        <v-card
          class="my-6"
          tile
        >
          <v-list v-if="courseChallengeTags">
            <div
              v-show="courseChallengeTags.length === 0"
              class="text-center py-4"
            >
              <div class="text-body-2 mb-2">
                課程沒有可用的測驗分類，快加入一些吧！
              </div>
              <v-img
                :src="require('@/assets/images/emptyBox.svg')"
                max-height="100"
                contain
              />
            </div>
            <v-list-item
              v-for="item in courseChallengeTags"
              :key="item"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <ColorLabel
                    :tag="item"
                    small
                  />
                </v-list-item-title>
              </v-list-item-content>
              <v-tooltip left>
                <template #activator="{ on }">
                  <v-btn
                    color="secondary"
                    small="small"
                    icon
                    v-on="on"
                    @click="removeCourseTag(item, TAG_CATES.OJ_PROBLEM)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>移除</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
          <spinner v-else />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { TAG_CATES } from '@/constants/tag'
import Spinner from '@/components/UI/Spinner.vue'

export default {
  name: 'ManageTags',
  components: { Spinner },

  props: {
    courseProblemTags: {
      type: Array,
      default: () => undefined,
    },
    courseChallengeTags: {
      type: Array,
      default: () => undefined,
    },
    problemTags: {
      type: Array,
      default: () => undefined,
    },
    challengeTags: {
      type: Array,
      default: () => undefined,
    },
    errorMsg: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    selectedTags: [],
    TAG_CATES,
  }),

  computed: {
    candidateProblemTags() {
      if (!this.problemTags) return []
      return this.problemTags.filter((tag) => !this.courseProblemTags.includes(tag))
    },
    candidateChallengeTags() {
      if (!this.challengeTags) return []
      return this.challengeTags.filter((tag) => !this.courseChallengeTags.includes(tag))
    },
  },

  methods: {
    addCourseTags({ existTags, newTags }, cb, category) {
      new Promise((resolve) => {
        const body = { tags: newTags, category }
        this.$emit('submit-new-tags', body, resolve)
      }).then(() => {
        const body = { pop: [], push: [...existTags, ...newTags], category }
        this.$emit('submit-patch-tags', body)
      }).then(cb)
    },
    removeCourseTag(tag, category) {
      const body = { push: [], pop: [tag], category }
      this.$emit('submit-patch-tags', body)
    },
  },
}
</script>
