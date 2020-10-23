<template>
  <div class="wrapper">
    <SideNav />
    <router-view />
  </div>
</template>

<script>
import SideNav from '@/components/Course/SideNav'

export default {
  name: 'Course',

  components: { SideNav },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  height: 80%;
}
</style>
