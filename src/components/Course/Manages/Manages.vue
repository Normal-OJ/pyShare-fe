<template>
  <v-container fluid style="padding-bottom: 300px">
    <div class="text-h5">課程管理</div>
    <div class="d-flex flex-wrap">
      <template v-for="{ title, description, icon, routeName } in items">
        <v-hover v-slot:default="{ hover }" :key="routeName">
          <v-card
            class="px-4 mt-6 mx-6"
            :elevation="hover ? 6 : 2"
            width="450"
            @click="clickCard(routeName)"
          >
            <div class="d-flex justify-start flex-wrap">
              <div class="d-flex justify-center align-center">
                <v-icon size="60" color="primary" v-text="icon" />
              </div>
              <div>
                <v-card-title v-text="title" />
                <v-card-subtitle v-text="description" />
              </div>
            </div>
          </v-card>
        </v-hover>
      </template>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Manages',

  data: () => ({
    items: [
      {
        title: '管理分類',
        description: '在這裡管理課程中可使用的主題分類',
        icon: 'mdi-tag-multiple',
        routeName: 'courseManageTags',
      },
      {
        title: '管理成員',
        description: '在這裡管理課程中成員、檢視詳細資料',
        icon: 'mdi-account-multiple',
        routeName: 'courseManageMembers',
      },
      {
        title: '管理主題',
        description: '在這裡管理課程中的主題',
        icon: 'mdi-view-list',
        routeName: 'courseManageProblems',
      },
      {
        title: '管理測驗',
        description: '在這裡管理課程中的測驗',
        icon: 'mdi-code-tags',
        routeName: 'courseManageChallenges',
      },
      {
        title: '主題統計',
        description: '在這裡檢視學生的主題創作情況',
        icon: 'mdi-format-list-checks',
        routeName: 'courseProblemsStats',
      },
      {
        title: '測驗統計',
        description: '在這裡檢視學生的測驗答題情況',
        icon: 'mdi-code-tags-check',
        routeName: 'courseChallengesStats',
      },
    ],
  }),

  methods: {
    clickCard(routeName) {
      this.$router.push({ name: routeName })
    },
  },
}
</script>
