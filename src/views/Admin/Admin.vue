<template>
  <div class="wrapper">
    <AdminSideNav />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
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
