<template>
  <div class="wrapper">
    <SideNav />
    <div class="container">
      <!-- <v-breadcrumbs :items="breadcrumbs" /> -->
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/Course/SideNav'

export default {
  components: { SideNav },

  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style>
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
}
</style>
