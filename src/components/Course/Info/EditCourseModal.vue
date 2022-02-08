<template>
  <v-dialog
    v-model="dialog"
    width="750"
    persistent
  >
    <template #activator="{ on, attrs }">
      <v-btn
        class="ml-4"
        color="primary"
        dark
        v-bind="attrs"
        small
        v-on="on"
      >
        <v-icon
          class="mr-1"
          small
        >
          mdi-pencil
        </v-icon>
        編輯
      </v-btn>
    </template>

    <v-card>
      <v-toolbar
        dark
        color="primary"
        dense
      >
        <v-toolbar-title>編輯課程資訊</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <v-form ref="form">
          <v-text-field
            v-model.trim="name"
            label="課程名稱"
            :rules="nameRules"
            outlined
            dense
            persistent-hint
            hint="課程名稱僅能包含：中英文、數字、空格、底線、減號、點"
          />
          <v-row>
            <v-col>
              <v-select
                v-model="year"
                label="學年度"
                :items="years"
                outlined
                dense
              />
            </v-col>
            <v-col>
              <v-select
                v-model="semester"
                label="學期"
                :items="semesters"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-form>

        <div class="text-h6">
          課程狀態
        </div>
        <v-row
          justify="space-between"
          no-gutters
        >
          <v-card
            v-for="{ status, icon, title, subtitle } in statusOptions"
            :key="status"
            width="30%"
            class="pa-3"
            hover
            :ripple="false"
            :style="{
              border: checkedOption === status ? 'solid 3px var(--v-primary-base)' : null,
            }"
            @click="checkedOption = status"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                size="54"
                :color="checkedOption === status ? 'primary' : null"
              >
                {{ icon }}
              </v-icon>
              <div class="text-h6">
                {{ title }}
              </div>
              <div class="text-subtitle-1">
                {{ subtitle }}
              </div>
            </div>
          </v-card>
        </v-row>

        <div class="text-h6 mt-8">
          課程簡介
        </div>
        <v-row
          justify="space-between"
          no-gutters
        >
          <v-textarea
            v-model="description"
            outlined
          />
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :disabled="!name || !year || !semester"
          :loading="isLoading"
          @click="submit"
        >
          送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ActionTypes } from '@/store/action-types'
import { YEARS, SEMESTERS, STATUS_OPTIONS } from '@/constants/course'

export default {
  props: {
    info: Object,
  },

  data: () => ({
    dialog: false,
    isLoading: false,
    name: null,
    teacher: null,
    nameRules: [
      (val) => !!val || '請輸入課程名稱',
      (val) => RegExp(/^[\u4E00-\u9FCCA-Za-z0-9_.-\s]+$/).test(val) || '課程名稱包含非法字元',
      (val) => val.length >= 3 || '長度至少三個字元',
    ],
    year: 109,
    semester: 2,
    years: YEARS,
    semesters: SEMESTERS,
    checkedOption: 1,
    description: '',
    statusOptions: STATUS_OPTIONS,
  }),

  computed: {
    courseId() {
      return this.$route.params.id
    },
  },
  watch: {
    info: {
      handler() {
        if (!this.info) return
        this.name = this.info.name
        this.year = this.info.year
        this.semester = this.info.semester
        this.checkedOption = this.info.status
        this.description = this.info.description
        this.teacher = this.info.teacher.id
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const { name, year, semester, teacher, checkedOption, description } = this
        const body = { name, year, semester, teacher, status: checkedOption, description }
        this.$agent.Course.update(this.courseId, body)
          .then(() => {
            this.$store.dispatch(ActionTypes.GET_COURSE_INFO, this.courseId)
            this.dialog = false
            this.$alertSuccess('編輯課程資訊成功。')
          })
          .catch(() => {
            this.$alertFail('編輯課程資訊失敗')
          })
          .finally(() => (this.isLoading = false))
      }
    },
  },
}
</script>

<style scoped>
.v-card--link {
  background-color: white;
}
</style>
