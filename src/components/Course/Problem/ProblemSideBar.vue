<template>
  <v-navigation-drawer permanent :width="200" disable-resize-watcher>
    <v-list-item>
      <v-list-item-content>
        <v-btn
          v-if="problems"
          color="primary"
          outlined
          :to="{ name: 'courseProblems', params: { id: problems[0].course } }"
        >
          返回主題列表
        </v-btn>
        <spinner v-else />
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list v-if="problems" dense>
      <v-list-item
        v-for="{ pid, title } in problems"
        :key="pid"
        :to="{ name: 'courseProblem', params: { id: pid } }"
        color="primary"
      >
        <v-list-item-icon class="mr-0">{{ pid }}</v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <spinner v-else />
  </v-navigation-drawer>
</template>

<script>
import Spinner from '../../UI/Spinner.vue'
export default {
  components: { Spinner },
  props: {
    problems: {
      type: Array,
    },
  },
}
</script>

<style></style>
