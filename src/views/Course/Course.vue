<template>
  <div class="wrapper">
    <SideNav :courseInfo="courseInfo" />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/Course/SideNav'
import { mapGetters } from 'vuex'
import { COURSE_INFO } from '@/store/getters.type.js'

export default {
  components: { SideNav },

  computed: {
    ...mapGetters({
      courseInfo: COURSE_INFO,
    }),
  },
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
