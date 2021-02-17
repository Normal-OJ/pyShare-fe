<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-layers-plus</v-icon>
        新增課程
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-icon class="mr-1">mdi-layers-plus</v-icon>
        <v-toolbar-title>新增課程</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <div class="mb-2 text-body-1">
          除教師無法更改外，其他資訊可在日後修改。
        </div>
        <v-form ref="form">
          <v-text-field label="課程名稱" v-model="name" :rules="nameRules" outlined dense />
          <v-row>
            <v-col>
              <v-select label="學年度" v-model="year" :items="years" outlined dense />
            </v-col>
            <v-col>
              <v-select label="學期" v-model="semester" :items="semesters" outlined dense />
            </v-col>
            <v-col>
              <v-text-field label="教師" :value="username" outlined dense :readonly="role !== 0" />
            </v-col>
          </v-row>
        </v-form>

        <div class="text-h6">課程狀態</div>
        <v-row justify="space-between" no-gutters>
          <v-card
            v-for="{ status, icon, title, subtitle } in statusOptions"
            :key="status"
            width="30%"
            class="pa-3"
            hover
            :ripple="false"
            @click="checkedOption = status"
            :style="{
              border: checkedOption === status ? 'solid 3px var(--v-primary-base)' : null,
            }"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="54" :color="checkedOption === status ? 'primary' : null">
                {{ icon }}
              </v-icon>
              <div class="text-h6">{{ title }}</div>
              <div class="text-subtitle-1">{{ subtitle }}</div>
            </div>
          </v-card>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :disabled="!name || !year || !semester" @click="submit">
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { YEARS, SEMESTERS } from '@/constants/course'

export default {
  data: () => ({
    dialog: false,
    name: null,
    nameRules: [
      val => !!val || '請輸入課程名稱',
      // val => RegExp(/[\w. _-]+$/).test(val) || '課程名稱包含非法字元',
    ],
    year: 109,
    semester: 2,
    years: YEARS,
    semesters: SEMESTERS,
    checkedOption: 1,
    statusOptions: [
      {
        status: 2,
        icon: 'mdi-earth',
        title: '開放課程',
        subtitle: '任何使用者都可以檢視，並擁有在課程內創作的權限',
      },
      {
        status: 1,
        icon: 'mdi-eye',
        title: '公開課程',
        subtitle: '任何使用者都可以檢視，但沒有新增主題、創作的權限',
      },
      {
        status: 0,
        icon: 'mdi-lock',
        title: '不公開課程',
        subtitle: '僅有被加入課程的學生才可造訪以及創作',
      },
    ],
  }),

  computed: {
    ...mapState({
      username: state => state.auth.username,
      id: state => state.auth.id,
      role: state => state.auth.role,
    }),
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        const { id, name, year, semester, checkedOption } = this
        const body = { name, year, semester, teacher: id, status: checkedOption, description: '' }
        new Promise((resolve, reject) => this.$emit('submit', body, resolve, reject))
          .then(() => {
            this.dialog = false
            this.$alertSuccess('新增課程成功。')
          })
          .catch(() => {
            this.$alertFail('新增課程失敗')
          })
      }
    },
  },
}
</script>

<style>
.v-card--link {
  background-color: white;
}
</style>
