<template>
  <v-navigation-drawer
    permanent
    :mini-variant="isMinify"
    mini-variant-width="50"
    :width="200"
    disable-resize-watcher
  >
    <v-list-item>
      <v-list-item-avatar class="rounded">
        <v-avatar size="48" color="secondary" tile>
          <span class="white--text headline" v-if="courseInfo">
            {{ courseInfo.name.slice(0, 1) }}
          </span>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-tooltip bottom v-if="courseInfo">
          <template v-slot:activator="{ on, attr }">
            <v-list-item-title v-on="on" v-bind="attr">
              {{ courseInfo.name }}
            </v-list-item-title>
          </template>
          <span>{{ courseInfo.name }}</span>
        </v-tooltip>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense :nav="!isMinify">
      <v-list-item :to="{ name: 'courseProblems' }" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-view-list</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>主題</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-if="$route.name === 'courseProblem'">
        <v-list-item
          v-for="{ pid, title } in normalProblems"
          :key="pid"
          :to="{ name: 'courseProblem', params: { pid: pid } }"
          color="primary"
          :class="{ 'ml-4': !isMinify }"
        >
          <v-list-item-icon class="pl-3 mr-3">{{ pid }}</v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list-item :to="{ name: 'courseChallenges' }" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-code-tags</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>測驗</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-if="$route.name === 'courseChallenge'">
        <v-list-item
          v-for="{ pid, title } in ojProblems"
          :key="pid"
          :to="{ name: 'courseChallenge', params: { pid: pid } }"
          color="primary"
          :class="{ 'ml-4': !isMinify }"
        >
          <v-list-item-icon class="pl-3 mr-3">{{ pid }}</v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list-item
        v-for="{ label, icon, routeName } in items"
        :key="label"
        :to="{ name: routeName }"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />
      <v-list dense :nav="!isMinify">
        <v-list-item link @click="isMinify = !isMinify">
          <v-list-item-icon>
            <v-icon>
              {{ isMinify ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ isMinify ? '展開側選單' : '收起側選單' }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { GetterTypes } from '@/store/getter-types'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SideNav',

  computed: {
    ...mapState({
      courseInfo: state => state.course.courseInfo,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS,
    }),
    normalProblems() {
      return this.problems.filter(p => p.extra._cls !== 'OJProblem' && !p.isTemplate)
    },
    ojProblems() {
      return this.problems.filter(p => p.extra._cls === 'OJProblem')
    },
    courseId() {
      return this.$route.params.id
    },
    items() {
      return this.links.slice(this.canWriteCourse ? 0 : 1)
    },
  },

  data: () => ({
    isMinify: false,
    links: [
      {
        label: '管理',
        icon: 'mdi-settings',
        routeName: 'courseManages',
      },
      {
        label: '總覽',
        icon: 'mdi-view-compact',
        routeName: 'courseInfo',
      },
    ],
    canWriteCourse: null,
  }),

  async created() {
    this.canWriteCourse = await this.$hasPermission('course', this.courseId, ['w'])
  },
}
</script>
