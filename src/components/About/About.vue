<template>
  <v-container fluid>
    <div class="d-flex flex-column align-center mt-6">
      <div class="text-h3">Meet The Team</div>
      <div class="text-subtitle-1 mt-4">此平台由國立臺灣師範大學建置與維護</div>
      <!-- Chair -->
      <div class="text-h5 font-weight-bold mt-6">計畫主持人</div>
      <div class="d-flex flex-column align-center mt-2">
        <v-avatar size="120">
          <v-img :src="require('@/assets/images/chair.jpg')" width="120" />
        </v-avatar>
        <div class="mt-1" style="font-size: 20px">資工系 蔣宗哲 教授</div>
        <div class="text-body-1">tcchiang@ntnu.edu.tw</div>
      </div>
      <!-- Developer -->
      <div class="text-h5 font-weight-bold mt-6">開發團隊</div>
      <div class="d-flex justify-space-around flex-wrap mt-2">
        <div class="d-flex flex-column align-center mx-4">
          <v-avatar size="100">
            <v-img :src="require('@/assets/images/Uier.png')" width="100" contain />
          </v-avatar>
          <!-- <div class="text-subtitle-2 mt-1">Frontend Designer/Developer</div> -->
          <div class="text-body-1 mt-1">資工系 111 級 于子緯</div>
        </div>
        <div class="d-flex flex-column align-center mx-4">
          <v-avatar size="100">
            <v-img :src="require('@/assets/images/Bogay.png')" width="100" contain />
          </v-avatar>
          <!-- <div class="text-subtitle-2 mt-1">Backend/Sandbox Developer</div> -->
          <div class="text-body-1 mt-1">資工系 111 級 莊博傑</div>
        </div>
        <div class="d-flex flex-column align-center mx-4">
          <v-avatar size="100">
            <v-img :src="require('@/assets/images/skps2010.png')" width="100" contain />
          </v-avatar>
          <!-- <div class="text-subtitle-2 mt-1">Backend Developer</div> -->
          <div class="text-body-1 mt-1">資工系 111 級 盧昭華</div>
        </div>
      </div>
      <!-- Organization -->
      <div class="d-flex justify-space-around flex-wrap mt-8">
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
