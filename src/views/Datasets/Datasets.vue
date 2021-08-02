<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row class="mb-4" no-gutters>
      <div class="text-h5">共享資料集</div>
      <v-spacer />
      <CreateDatasetModal @submit="addNewDataset" />
    </v-row>
    <Spinner v-if="!datasets" />
    <div v-else>
      <div v-for="{ id, title, description, author, update, view, download } in datasets" :key="id">
        <v-hover v-slot="{ hover }">
          <v-card
            class="d-flex flex-column"
            elevation="0"
            :to="{ name: 'dataset', params: { id } }"
            :color="hover ? '#eee' : '#fff'"
          >
            <v-card-title v-text="title" />
            <v-card-text v-text="truncateDescription(description)" />
            <v-spacer />
            <v-card-text class="d-flex">
              上傳者：{{ author.displayName }}
              &nbsp;·&nbsp;
              <v-icon class="mx-1" small>mdi-clock</v-icon>
              {{ $timeFromNow(update) + '更新' }} &nbsp;·&nbsp;
              <v-icon class="mx-1" small>mdi-eye</v-icon>{{ view }} &nbsp;·&nbsp;
              <v-icon class="mx-1" small>mdi-download</v-icon>{{ download }}
            </v-card-text>
          </v-card>
        </v-hover>
        <v-divider />
      </div>
    </div>
  </v-container>
</template>

<script>
import CreateDatasetModal from '@/components/Datasets/CreateDatasetModal'
import Spinner from '@/components/UI/Spinner'

export default {
  components: {
    Spinner,
    CreateDatasetModal,
  },
  data: () => ({
    datasets: null,
  }),
  mounted() {
    this.$agent.Dataset.getList().then(resp => (this.datasets = resp.data.data))
  },
  methods: {
    truncateDescription(description) {
      return description.length > 150 ? description.substring(0, 150) + '...' : description
    },
    addNewDataset(dataset, resolve, reject) {
      try {
        console.log(dataset)
        resolve()
      } catch {
        reject()
      }
    },
  },
}
</script>

<style></style>
