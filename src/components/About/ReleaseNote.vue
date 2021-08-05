<template>
  <v-container fluid>
    <div class="d-flex flex-column mt-6">
      <div class="text-h3 align-self-center">平台更新</div>
      <div class="text-caption align-self-center mb-2">(current: {{ currentCommit }})</div>

      <Spinner v-if="isLoading" />
      <div
        v-else-if="data && data.length > 0"
        class="align-self-center"
        style="height: 500px; overflow: auto"
      >
        <div v-for="{ tag, content, time, sha } in data" :key="tag" class="mt-4">
          <div class="d-flex flex-column">
            <div class="d-flex align-baseline" style="white-space: pre">
              <div class="text-h6">{{ tag }}</div>
              <div class="text-caption">&nbsp;({{ time }}, {{ sha }})&nbsp;</div>
            </div>
            <div
              v-for="({ type, text }, index) in content"
              :key="index"
              class="ml-8 my-1 d-flex align-center"
            >
              <v-chip :color="typeColor[type]" label small class="mr-2 font-weight-medium">
                {{ type }}
              </v-chip>
              {{ text }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="align-self-center">
        <v-icon color="error">mdi-alert-circle-outline</v-icon>
        擷取資料發生錯誤
      </div>
    </div>
  </v-container>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
const types = [
  {
    name: 'BugFix',
    rule: /^- bugfix:/,
  },
  {
    name: 'Update',
    rule: /^- update:/,
  },
  {
    name: 'NewFeature',
    rule: /^- new:/,
  },
]
const typeColor = {
  BugFix: 'secondary',
  Update: 'primary',
  NewFeature: 'success',
}

export default {
  props: {
    releases: {
      type: Array,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  components: { Spinner },

  data: () => ({
    currentCommit: process.env.VUE_APP_GIT_SHA,
    typeColor,
    isShowAll: false,
  }),

  computed: {
    data() {
      return (
        this.releases &&
        this.releases.map((release) => {
          const tag = release.tag_name
          const rawContent = release.description.split('\n')
          const content = rawContent
            .map((raw) => ({
              type: this.getType(raw),
              text: this.getContent(raw),
            }))
            .filter((c) => c.type)
          const time = this.$dayjs(release.commit.committed_date).format('YYYY-MM-DD')
          const sha = release.commit.short_id
          return {
            tag,
            content,
            time,
            sha,
          }
        })
      )
    },
  },

  methods: {
    getType(str) {
      const matches = types.filter((type) => str.match(type.rule))
      return matches.length > 0 ? matches[0].name : ''
    },
    getContent(str) {
      return str.split(':').slice(1).join('')
    },
  },
}
</script>
