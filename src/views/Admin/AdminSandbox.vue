<template>
  <v-container fluid class="d-flex flex-column pb-12">
    <v-card flat>
      <v-card-title>
        沙盒列表
        <v-spacer />
        <v-text-field
          v-model="searchText"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
        <v-btn class="ml-6 mt-4" color="primary" @click="populateWith = initNewSandboxData">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          新增沙盒
        </v-btn>
      </v-card-title>
      <NewSandboxForm
        v-if="!!populateWith"
        :populateWith="populateWith"
        @modify="modifySandbox"
        @submit="submitNewSandbox"
        @cancel="populateWith = null"
      />
      <div v-else-if="error">載入失敗</div>
      <v-data-table
        v-else
        :loading="!sandboxes"
        :headers="sandboxTableHeaders"
        :items="sandboxes"
        :search="searchText"
      >
        <template v-slot:item.operation="{ item }">
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="populateWith = { data: item }">
                <v-list-item-title>編輯</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteSandbox(item.url)">
                <v-list-item-title>刪除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import NewSandboxForm from '@/components/Admin/NewSandboxForm.vue'
import { ref, computed } from '@vue/composition-api'
import useSWRV from 'swrv'
import { fetcher } from '@/api/agent'

const sandboxTableHeaders = [
  { text: '暱稱 Alias', value: 'alias' },
  { text: '連線位址 URL', value: 'url' },
  { text: '', value: 'operation' },
]
const initNewSandboxData = {
  data: {
    url: '',
    token: '',
    alias: '',
  },
  new: true,
}

export default {
  components: { NewSandboxForm },
  setup() {
    const { data, error, mutate } = useSWRV('/sandbox', fetcher)
    const sandboxes = computed(() => data.value?.data.data)
    const searchText = ref('')
    const populateWith = ref(null)

    return {
      error,
      sandboxes,
      sandboxTableHeaders,
      searchText,
      populateWith,
      initNewSandboxData,
      submitNewSandbox(data) {
        this.populateWith.loading = true
        this.$agent.Sandbox.create(data)
          .then(() => {
            this.$alertSuccess('新增沙盒成功')
            this.populateWith = null
            mutate()
          })
          .catch(error => {
            this.$alertFail('新增沙盒失敗')
            this.$rollbar.error('[views/AdminSandbox/submitNewSandbox]', error)
          })
          .finally(() => (this.populateWith.loading = false))
      },
      modifySandbox(data) {
        this.populateWith.loading = true
        this.$agent.Sandbox.modify(data)
          .then(() => {
            this.$alertSuccess('編輯沙盒成功')
            this.populateWith = null
            mutate()
          })
          .catch(error => {
            this.$alertFail('編輯沙盒失敗')
            this.$rollbar.error('[views/AdminSandbox/modifySandbox]', error)
          })
          .finally(() => (this.populateWith.loading = false))
      },
      deleteSandbox(url) {
        if (!confirm('確定要刪除嗎？此操作將無法復原。')) return
        this.$agent.Sandbox.delete(url)
          .then(() => this.$alertSuccess('刪除沙盒成功'))
          .catch(() => this.$alertFail('刪除沙盒失敗'))
      },
    }
  },
}
</script>
