<template>
  <v-container fluid>
    <div class="d-flex flex-column mt-6">
      <div class="text-h3 align-self-center">平台更新</div>
      <div class="text-caption align-self-center">(current: {{ currentCommit }})</div>

      <div v-if="data.length > 0" class="mt-2 align-self-center">
        <div
          v-for="{ tag, name, content, time, sha } in isShowAll ? data : data.slice(0, 2)"
          :key="tag"
          class="mt-4"
        >
          <div class="d-flex flex-column">
            <div class="d-flex align-baseline" style="white-space: pre">
              <div class="text-h5 font-weight-bold">{{ tag }}</div>
              <div class="text-caption">&nbsp;({{ sha }})&nbsp;</div>
              <div class="text-h6">{{ name }} &nbsp;{{ time }}</div>
            </div>
            <div
              v-for="({ type, text }, index) in content"
              :key="index"
              class="ml-8 my-1 d-flex align-center"
            >
              <v-chip :color="typeColor[type]" label small class="mr-2 font-weight-bold">
                {{ type }}
              </v-chip>
              {{ text }}
            </div>
          </div>
        </div>
        <v-btn
          v-if="data.length > 2"
          class="mt-4"
          block
          outlined
          color="primary"
          @click="isShowAll = !isShowAll"
        >
          <v-icon>{{ isShowAll ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          {{ isShowAll ? '顯示部分' : '顯示全部' }}
        </v-btn>
      </div>
      <Spinner v-else class="mt-2" />
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
      return this.releases.map(release => {
        const name = release.name
        const tag = release.tag_name
        const rawContent = release.description.split('\n')
        const content = rawContent
          .map(raw => ({
            type: this.getType(raw),
            text: this.getContent(raw),
          }))
          .filter(c => c.type)
        const time = this.$dayjs(release.released_at).format('YYYY-MM-DD')
        const sha = release.commit.id.substring(0, 8)
        return {
          name,
          tag,
          content,
          time,
          sha,
        }
      })
    },
  },

  methods: {
    getType(str) {
      const matches = types.filter(type => str.match(type.rule))
      return matches.length > 0 ? matches[0].name : ''
    },
    getContent(str) {
      return str
        .split(':')
        .slice(1)
        .join('')
    },
  },
}
</script>
