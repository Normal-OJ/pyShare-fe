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
      <v-list-item
        v-for="{ label, icon, routeName, permission } in items.slice(0, 1)"
        :key="label"
        :to="{ name: routeName }"
        color="primary"
        v-permission="permission"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <template v-if="$route.name === 'courseProblem'">
        <v-list-item
          v-for="{ pid, title } in problems"
          :key="pid"
          :to="{ name: 'courseProblem', params: { pid: pid } }"
          color="primary"
        >
          <v-list-item-icon class="pl-2">{{ pid }}</v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list-item
        v-for="{ label, icon, routeName, permission } in items.slice(1)"
        :key="label"
        :to="{ name: routeName }"
        color="primary"
        v-permission="permission"
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
import { ROLE } from '@/constants/auth'
import { mapState } from 'vuex'

const { TEACHER, STUDENT } = ROLE
const SIDE_NAVS = [
  {
    label: '主題列表',
    icon: 'mdi-view-list',
    routeName: 'courseProblems',
    permission: [TEACHER, STUDENT],
  },
  {
    label: '總覽',
    icon: 'mdi-view-compact',
    routeName: 'courseInfo',
    permission: [TEACHER, STUDENT],
  },
]
const MANAGE = {
  label: '管理',
  icon: 'mdi-settings',
  routeName: 'courseManages',
  permission: [TEACHER, 'COURSE'],
}

export default {
  name: 'SideNav',

  props: {
    courseInfo: {
      type: Object,
    },
  },

  computed: {
    ...mapState({
      problems: state => state.course.courseProblems,
    }),
    items() {
      const navs = SIDE_NAVS.slice()
      if (this.courseInfo && this.courseInfo.id === this.$route.params.id) {
        navs.splice(1, 0, MANAGE)
      }
      return navs
    },
  },

  data: () => ({
    isMinify: false,
  }),
}
</script>
