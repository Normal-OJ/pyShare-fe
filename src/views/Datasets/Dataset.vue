<template>
  <div class="wrapper">
    <DatasetSideNav />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import DatasetSideNav from '@/components/Datasets/DatasetsSideNav.vue'

export default {
  components: { DatasetSideNav },
}
</script>

<style>
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: calc(100vh - 56px);
  position: fixed;
}
.container {
  flex: 1;
  overflow: scroll;
}
</style>
