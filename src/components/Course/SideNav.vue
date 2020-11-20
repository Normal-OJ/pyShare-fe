<template>
  <v-navigation-drawer
    permanent
    :mini-variant="isMinify"
    mini-variant-width="50"
    disable-resize-watcher
  >
    <v-list-item>
      <v-list-item-avatar class="rounded">
        <v-avatar size="48" color="secondary" tile>
          <span class="white--text headline">{{ $route.params.name.slice(0, 1) }}</span>
        </v-avatar>
        <!-- <v-img src="http://fakeimg.pl/100x100" /> -->
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ $route.params.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense :nav="!isMinify">
      <v-list-item
        v-for="{ label, icon, routeName } in items"
        :key="label"
        :to="{ name: routeName }"
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
const SIDE_NAVS = [
  {
    label: '主題列表',
    icon: 'mdi-view-list',
    routeName: 'courseProblems',
  },
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
]

export default {
  name: 'SideNav',

  data: () => ({
    items: SIDE_NAVS,
    isMinify: false,
  }),
}
</script>
