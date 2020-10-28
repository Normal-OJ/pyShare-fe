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

      <v-card-text class="mt-8">
        <v-text-field label="課程名稱" v-model="name" :rules="nameRules" outlined dense />
        <v-row>
          <v-col cols="8">
            <v-select label="學年度" v-model="year" :items="years" outlined dense />
          </v-col>
          <v-col cols="4">
            <v-select label="學期" v-model="semester" :items="semesters" outlined dense />
          </v-col>
        </v-row>
        <v-text-field label="教師" :value="teacher" outlined dense readonly />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!name || !year || !semester" @click="submit">
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
    // TODO: 課程名稱限制
    nameRules: [val => !!val || '請輸入課程名稱'],
    year: null,
    semester: null,
    years: YEARS,
    semesters: SEMESTERS,
  }),

  computed: {
    ...mapState({
      teacher: state => state.auth.username,
    }),
  },

  methods: {
    submit() {
      const { name, year, semester, teacher } = this
      this.$emit('submit', { name, year, semester, teacher })
      // TODO: getError and show feedback, conditionally close dialog
      this.dialog = false
    },
  },
}
</script>

<style></style>
