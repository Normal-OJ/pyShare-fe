<template>
  <v-navigation-drawer
    permanent
    :mini-variant="isMinify"
    mini-variant-width="50"
    :width="200"
    disable-resize-watcher
  >
    <v-list dense :nav="!isMinify">
      <v-list-item
        v-for="{ label, icon, routeName } in headerNavs"
        :key="label"
        :to="{ name: routeName }"
        link
        exact
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
import { mapState } from 'vuex'
import { ROLE } from '@/constants/auth'

const navs = [
  {
    label: '公開資料集',
    icon: 'mdi-table',
    routeName: 'datasets',
  },
  {
    label: '公開主題',
    icon: 'mdi-view-list',
    routeName: 'templateProblems',
    authorizedRole: [ROLE.ADMIN, ROLE.TEACHER],
  },
  {
    label: '公開測驗',
    icon: 'mdi-code-tags',
    routeName: 'templateChallenges',
    authorizedRole: [ROLE.ADMIN, ROLE.TEACHER],
  },
]

export default {
  name: 'DatasetsSideNav',

  computed: {
    ...mapState({
      role: state => state.auth.role,
    }),
    headerNavs() {
      return navs.filter(nav => {
        if (nav.authorizedRole && !nav.authorizedRole.includes(this.role)) return false
        return true
      })
    },
  },

  data: () => ({
    isMinify: false,
  }),
}
</script>
