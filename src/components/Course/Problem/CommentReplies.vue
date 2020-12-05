<template>
  <div>
    <v-card
      class="mt-4"
      tile
      v-for="{ id, author, created, updated, content } in replies"
      :key="id"
    >
      <div class="d-flex flex-row align-center">
        <v-avatar class="ml-4" size="48" color="primary">
          <span class="white--text headline">{{ author.displayName.slice(0, 1) }}</span>
        </v-avatar>
        <div class="d-flex flex-column">
          <!-- First Row -->
          <v-card-title class="d-flex flex-row align-center flex-wrap text-body-2">
            <router-link
              class="mr-2"
              :to="{ name: 'profile', params: { username: author.username } }"
            >
              {{ author.displayName }}
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attr }">
                <div v-on="on" v-bind="attr">
                  {{ `${$timeFromNow(created)}` }}
                </div>
              </template>
              <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
            </v-tooltip>
            {{ created !== updated ? '（已編輯）' : '' }}
          </v-card-title>
          <!-- Second Row -->
          <div class="px-4 pb-4 text--primary" v-html="content" />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    replies: {
      type: Array,
      required: true,
    },
  },
}
</script>
