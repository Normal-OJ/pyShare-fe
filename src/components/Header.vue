<template>
  <v-app-bar app color="primary" height="56" elevate-on-scroll>
    <v-img class="mr-2" :src="require('@/assets/images/logo.png')" max-width="32" />
    <v-toolbar-title style="color: white;" class="font-weight-bold mr-4">
      Python 創作分享平台
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        v-for="{ label, routeName } in headerItems"
        :key="label"
        :to="{ name: routeName }"
        class="text-body-1 font-weight-bold "
        color="white"
        text
      >
        {{ label }}
      </v-btn>
    </v-toolbar-items>

    <v-spacer />

    <v-btn class="text-body-1" icon>
      <v-icon color="white">mdi-bell</v-icon>
    </v-btn>
    <v-btn class="text-body-1 font-weight-bold" color="white" text>
      莊博傑
    </v-btn>
  </v-app-bar>
</template>

<script>
import { HEADER_ITEMS } from '@/constants/header'

export default {
  name: 'Header',

  data: () => ({
    headerItems: HEADER_ITEMS,
  }),
}
</script>
