<template>
  <v-navigation-drawer permanent bottom :mini-variant="isMinify" mini-variant-width="50">
    <v-list-item>
      <v-list-item-avatar class="rounded">
        <v-img src="http://fakeimg.pl/100x100" />
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
import { SIDE_NAVS } from '@/constants/course'
export default {
  name: 'SideNav',

  data: () => ({
    items: SIDE_NAVS,
    isMinify: false,
  }),
}
</script>