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
          v-for="{ pid, title } in problems"
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
          v-for="{ pid, title } in challenges"
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

      <v-list-item :to="{ name: 'courseInfo' }" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-view-compact</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>總覽</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="canWriteCourse" :to="{ name: 'courseManages' }" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>管理</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-if="$route.meta.detailedSideNav">
        <v-list-item
          v-for="{ title, icon, routeName } in manageItems"
          :key="routeName"
          :to="{ name: routeName }"
          color="primary"
          :class="{ 'ml-4': !isMinify }"
        >
          <v-list-item-icon class="pl-3 mr-3">
            <v-icon size="18px">{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
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
import { canWriteCourseMixin } from '@/lib/permissionMixin'

export default {
  name: 'SideNav',

  mixins: [canWriteCourseMixin],

  computed: {
    ...mapState({
      courseInfo: state => state.course.courseInfo,
    }),
    ...mapGetters({
      problems: GetterTypes.PROBLEMS,
      challenges: GetterTypes.CHALLENGES,
    }),
  },

  data: () => ({
    isMinify: false,
    manageItems: [
      {
        title: '管理分類',
        icon: 'mdi-tag-multiple',
        routeName: 'courseManageTags',
      },
      {
        title: '管理成員',
        icon: 'mdi-account-multiple',
        routeName: 'courseManageMembers',
      },
      {
        title: '管理主題',
        icon: 'mdi-view-list',
        routeName: 'courseManageProblems',
      },
      {
        title: '管理測驗',
        icon: 'mdi-code-tags',
        routeName: 'courseManageChallenges',
      },
      {
        title: '主題統計',
        icon: 'mdi-format-list-checks',
        routeName: 'courseProblemsStats',
      },
      {
        title: '測驗統計',
        icon: 'mdi-code-tags-check',
        routeName: 'courseChallengesStats',
      },
    ],
  }),
}
</script>
