<template>
  <v-navigation-drawer
    permanent
    :mini-variant="isMinify"
    mini-variant-width="50"
    :width="200"
    disable-resize-watcher
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          管理員介面
        </v-list-item-title>
        <v-list-item-subtitle style="font-family: monospace">
          ({{ currentCommit }})
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list
      dense
      :nav="!isMinify"
    >
      <v-list-item-group color="primary">
        <v-list-item
          v-for="{ label, icon, routeName } in navs"
          :key="label"
          :to="{ name: routeName }"
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
      </v-list-item-group>
    </v-list>

    <template #append>
      <v-divider />
      <v-list
        dense
        :nav="!isMinify"
      >
        <v-list-item @click="isMinify = !isMinify">
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
import { ref } from '@vue/composition-api'
const navs = [
  {
    label: '管理帳號',
    icon: 'mdi-table',
    routeName: 'adminUsers',
  },
  {
    label: '管理學校',
    icon: 'mdi-table',
    routeName: 'adminSchools',
  },
  {
    label: '管理沙盒',
    icon: 'mdi-server',
    routeName: 'adminSandbox',
  },
]

export default {
  name: 'AdminSideNav',
  setup() {
    const isMinify = ref(false)
    return { navs, isMinify, currentCommit: process.env.VITE_APP_GIT_SHA }
  },
}
</script>
