<template>
  <v-dialog v-model="dialog" width="750" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on" data-test="newCourseBtn">
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
        <div class="mb-4 text-body-1">
          課程資訊可在日後修改。
        </div>
        <v-form ref="form">
          <v-text-field
            label="課程名稱"
            v-model.trim="courseInfo.name"
            :rules="nameRules"
            outlined
            dense
            data-test="courseName"
            persistent-hint
            hint="課程名稱僅能包含：中英文、數字、空格、底線、減號、點"
          />
          <v-row>
            <v-col>
              <v-select
                label="學年度"
                v-model="courseInfo.year"
                :items="years"
                outlined
                dense
                data-test="courseYear"
              />
            </v-col>
            <v-col>
              <v-select
                label="學期"
                v-model="courseInfo.semester"
                :items="semesters"
                outlined
                dense
                data-test="courseSemester"
              />
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
            :ripple="false"
            @click="courseInfo.status = status"
            :style="{
              border: courseInfo.status === status ? 'solid 3px var(--v-primary-base)' : null,
            }"
            :data-test="`courseStatus${status}`"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="54" :color="courseInfo.status === status ? 'primary' : null">
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
        <v-btn
          color="success"
          :disabled="isDisabled"
          :loading="isLoading"
          @click="submit"
          data-test="courseSubmit"
        >
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { YEARS, SEMESTERS, STATUS_OPTIONS } from '@/constants/course'

export default {
  data: () => ({
    dialog: false,
    isLoading: false,
    courseInfo: {
      name: null,
      year: 109,
      semester: 2,
      status: 1,
      description: '',
    },
    nameRules: [
      val => !!val || '請輸入課程名稱',
      val => RegExp(/^[\u4E00-\u9FCCA-Za-z0-9_.-\s]+$/).test(val) || '課程名稱包含非法字元',
      val => val.length >= 3 || '長度至少三個字元',
    ],
    years: YEARS,
    semesters: SEMESTERS,
    statusOptions: STATUS_OPTIONS,
  }),

  computed: {
    ...mapState({
      id: state => state.auth.id,
    }),
    isDisabled() {
      const { name, year, semester } = this.courseInfo
      return !name || !year || !semester
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const body = { ...this.courseInfo, teacher: this.id }
        new Promise((resolve, reject) => this.$emit('submit', body, resolve, reject))
          .then(() => {
            this.courseInfo.name = null
            this.dialog = false
            this.$alertSuccess('新增課程成功。')
          })
          .catch(() => {
            this.$alertFail('新增課程失敗')
          })
          .finally(() => (this.isLoading = false))
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
