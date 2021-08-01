<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-account-plus</v-icon>
        新增學生
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>新增學生</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-tabs v-model="tab" fixed-tabs>
        <v-tab>批量新增學生</v-tab>
        <v-tab>新增單個學生</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <BatchSignupForm :schoolOptions="schoolOptions" @signup="signup" />
        </v-tab-item>
        <v-tab-item>
          <SingleSignupForm :schoolOptions="schoolOptions" @signup="signup" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-dialog v-model="isShowError" persistent>
      <v-card class="py-8">
        <div class="d-flex flex-column align-center pb-8">
          <div>
            <v-icon size="66" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="text-h5 text-center mt-3">
            以下學生新增失敗
          </div>
        </div>
        <v-card-text class="text--primary">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>school</th>
                  <th>username</th>
                  <th>error message</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ school, username, err } in errors" :key="username">
                  <td>{{ school }}</td>
                  <td>{{ username }}</td>
                  <td v-if="err">
                    <div v-for="[key, value] in Object.entries(err)" :key="key">
                      {{ key }}: {{ value }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="px-16" large tile @click="isShowError = false">
            我知道了
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { SCHOOLS } from '@/constants/auth'
import agent from '@/api/agent'
import BatchSignupForm from './BatchSignupForm.vue'
import SingleSignupForm from './SingleSignupForm.vue'

export default {
  components: { BatchSignupForm, SingleSignupForm },
  data: () => ({
    dialog: false,
    tab: 0,
    schoolOptions: null,
    isShowConfirmModal: false,
    isShowError: false,
    errors: null,
  }),

  created() {
    agent.School.getList()
      .then(resp => (this.schoolOptions = resp.data.data))
      .catch(error => {
        // 備援
        this.schoolOptions = SCHOOLS
        throw error
      })
  },

  methods: {
    async signup(course, csvString, cb = () => {}) {
      try {
        await agent.Auth.batchSignup({ course, csvString })
      } catch (error) {
        if (error.data.fails.length > 0) {
          this.$alertFail('新增學生失敗。')
          this.errors = error.data.fails
          this.isShowError = true
          console.log('[components/AddStudentModal/signup] error', error)
          throw error
        }
      }
      this.dialog = false
      this.$alertSuccess('新增學生成功。')
      this.$emit('success')
      cb()
    },
  },
}
</script>
