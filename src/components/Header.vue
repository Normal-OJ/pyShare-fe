<template>
  <v-app-bar app color="primary" height="56" elevation="0">
    <v-img
      class="mr-2"
      :src="require('@/assets/images/logo.png')"
      max-width="32"
    />
    <v-toolbar-title style="color: white;" class="font-weight-bold mr-4">
      Python 創作分享平台
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        v-for="{ label, routeName } in headerItems"
        :key="label"
        :to="routeName"
        class="text-body-1 font-weight-bold "
        color="white"
        text
      >
        {{ label }}
      </v-btn>
    </v-toolbar-items>

    <v-spacer />

    <v-toolbar-items>
      <v-btn class="text-body-1" icon>
        <v-icon color="white">mdi-bell</v-icon>
      </v-btn>
      <v-btn class="text-body-1 font-weight-bold" color="white" text>
        莊博傑
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { HEADER_ITEMS } from '../constants/header'

export default {
  name: 'Header',

  data: () => ({
    headerItems: HEADER_ITEMS,
  }),
}
</script>
