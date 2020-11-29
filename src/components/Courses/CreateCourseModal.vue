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
        <v-toolbar-title>新增課程</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <v-text-field
          label="課程名稱"
          v-model="name"
          :rules="nameRules"
          outlined
          dense
          persistent-hint
          hint="課程名稱僅能包含：A-Z、a-z、0-9、空白、底線、減號、點"
        />
        <v-row>
          <v-col cols="8">
            <v-select label="學年度" v-model="year" :items="years" outlined dense />
          </v-col>
          <v-col cols="4">
            <v-select label="學期" v-model="semester" :items="semesters" outlined dense />
          </v-col>
        </v-row>
        <v-text-field label="教師" :value="teacher" outlined dense readonly />

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
    name: '',
    nameRules: [
      val => !!val || '請輸入課程名稱',
      val => RegExp(/[\w. _-]+$/).test(val) || '課程名稱包含非法字元',
    ],
    year: null,
    semester: null,
    years: YEARS,
    semesters: SEMESTERS,
    checkedOption: 1,
    statusOptions: [
      {
        status: 2,
        icon: 'mdi-earth',
        title: '開放課程',
        subtitle: '任何使用者都可以造訪，並擁有在課程內創作的權限',
      },
      {
        status: 1,
        icon: 'mdi-eye',
        title: '公開課程',
        subtitle: '任何使用者都可以造訪，但僅供檢視，沒有創作權限',
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
      teacher: state => state.auth.username,
    }),
  },

  methods: {
    submit() {
      // TODO: do validation
      const { name, year, semester, teacher, checkedOption } = this
      this.$emit('submit', { name, year, semester, teacher, status: checkedOption })
      // TODO: getError and show feedback, conditionally close dialog
      this.dialog = false
    },
  },
}
</script>

<style>
.v-card--link {
  background-color: white;
}
</style>
