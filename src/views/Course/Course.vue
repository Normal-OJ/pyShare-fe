<template>
  <div class="wrapper">
    <SideNav />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/Course/SideNav'

export default {
  components: { SideNav },
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
  /* height: 100%; */
  overflow: scroll;
}
</style>
