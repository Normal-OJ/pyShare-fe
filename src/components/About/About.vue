<template>
  <v-container fluid>
    <div class="d-flex flex-column align-center mt-4">
      <div class="text-h3">Meet The Team</div>
      <div class="d-flex mt-4">
        <div class="text-h5">計畫主持人</div>
      </div>
      <div class="d-flex justify-space-around mt-4">
        <v-img :src="require('@/assets/images/pyshare.png')" width="300" contain />
        <div class="mx-10" />
        <v-img :src="require('@/assets/images/ntnu.png')" width="300" contain />
      </div>
    </div>
  </v-container>
</template>

<script>
export default {}
</script>
