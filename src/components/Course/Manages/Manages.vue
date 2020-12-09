<template>
  <v-container fluid>
    <v-hover v-slot:default="{ hover }">
      <v-card
        class="px-4 mt-6 mx-6"
        :elevation="hover ? 6 : 2"
        max-width="300"
        @click="clickCard('courseManageTags')"
      >
        <div class="d-flex justify-space-around">
          <div class="d-flex justify-center align-center">
            <v-icon size="60" color="primary">mdi-tag-multiple</v-icon>
          </div>
          <div>
            <v-card-title>管理分類</v-card-title>
            <v-card-subtitle>在這裡管理課程中可使用的主題分類</v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-hover>

    <v-hover v-slot:default="{ hover }">
      <v-card class="px-4 mt-6 mx-6" :elevation="hover ? 6 : 2" max-width="300">
        <div class="d-flex justify-space-around">
          <div class="d-flex justify-center align-center">
            <v-icon size="60" color="primary">mdi-account-multiple</v-icon>
          </div>
          <div>
            <v-card-title>管理成員</v-card-title>
            <v-card-subtitle>在這裡管理課程中成員、檢視詳細資料</v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-hover>

    <v-hover v-slot:default="{ hover }">
      <v-card
        class="px-4 mt-6 mx-6"
        :elevation="hover ? 6 : 2"
        max-width="300"
        @click="clickCard('courseManageProblems')"
      >
        <div class="d-flex justify-space-around">
          <div class="d-flex justify-center align-center">
            <v-icon size="60" color="primary">mdi-file-document</v-icon>
          </div>
          <div>
            <v-card-title>管理範本</v-card-title>
            <v-card-subtitle>在這裡管理課程中可使用的主題範本</v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'Manages',

  methods: {
    clickCard(routeName) {
      this.$router.push({ name: routeName })
    },
  },
}
</script>
