<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row class="mb-4" no-gutters>
      <v-btn color="primary" text :to="{ name: 'datasets' }">回到共享資料集列表</v-btn>
    </v-row>
    <Spinner v-if="!dataset" />
    <template v-else>
      <div class="text-h4 font-weight-bold text-center" v-text="dataset.title" />
      <v-row class="mt-6">
        <v-col cols="12" md="8">
          <div class="text-h6">資料集說明</div>
          <div class="text-body-1 ma-1" v-text="dataset.description" />
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-h6">基本資料</div>
          <div class="text-h6 mt-4">附件</div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import Spinner from '@/components/UI/Spinner'
import agent from '@/api/agent'

export default {
  components: { Spinner },
  data: () => ({
    dataset: null,
  }),
  mounted() {
    agent.Dataset.get(this.$route.params.id).then(resp => (this.dataset = resp.data.data))
  },
}
</script>

<style></style>
