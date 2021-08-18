<template>
  <v-dialog :value="open" width="750" persistent>
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>引用資料集</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8 text--primary">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              選擇引用方式
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">
              命名引用資料
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              完成
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-form class="mt-2 mb-8" ref="stepOneForm">
                <div class="text-body-1">請選擇欲將資料集引用到哪個課程</div>
                <v-select
                  v-model="targetCourse"
                  label="選擇課程"
                  class="mt-2"
                  :items="teachingCourses"
                  :rules="[v => !!v || '請選擇課程']"
                  item-text="name"
                  item-value="id"
                  outlined
                />
                <div class="text-body-1">請選擇引用方式</div>
                <v-radio-group v-model="isToCreateProblem" row class="mt-2 mb-6" hide-details>
                  <v-radio label="使用選取的資料集建立新主題" :value="CLONE_TO.NEW" />
                  <v-radio label="將選取的資料集匯入已存在的主題" :value="CLONE_TO.EXISTING" />
                </v-radio-group>
                <div v-show="!isToCreateProblem">
                  <div class="text-body-1">請選擇欲將資料集匯入至哪個主題</div>
                  <v-select
                    v-model="targetProblem"
                    label="選擇主題（請先選取課程）"
                    class="mt-2"
                    :items="problems"
                    :rules="[v => isToCreateProblem || !!targetProblem || '請選擇主題']"
                    item-text="displayName"
                    item-value="pid"
                    :disabled="!targetCourse"
                    outlined
                  />
                </div>
              </v-form>

              <v-btn color="primary" @click="step1To2">
                下一步
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <template v-if="!isToCreateProblem">
                abc
              </template>
              <v-form class="mt-2 mb-8" ref="stepTwoForm">
                <div class="text-body-1">請選擇欲將資料集匯入至哪個主題</div>
                <v-row v-for="dataset in datasets" :key="dataset.id" align="center">
                  <v-col cols="6">
                    這裡要放附件
                  </v-col>
                  <v-col cols="6">
                    這裡要放輸入框
                  </v-col>
                </v-row>
              </v-form>

              <v-btn color="primary" @click="step = 3">
                下一步
              </v-btn>
              <v-btn color="primary" text @click="step = 1">
                上一步
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

              <v-btn color="primary" text @click="step = 2">
                上一步
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="isToCreateProblem" color="success" @click="createProblem">
          前往建立主題
        </v-btn>
        <v-btn v-else color="success">
          匯入
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetterTypes } from '@/store/getter-types'
import { mapActions, mapGetters } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    datasets: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    step: 1,
    isToCreateProblem: true,
    targetCourse: null,
    targetProblem: null,
  }),

  computed: {
    ...mapGetters({
      teachingCourses: GetterTypes.TEACHING_COURSES,
      courseProblems: GetterTypes.PROBLEMS_OF_MINE,
    }),
    problems() {
      return this.courseProblems.map(p => ({
        ...p,
        displayName: `${p.pid} - ${p.title}`,
      }))
    },
    CLONE_TO() {
      return {
        NEW: true,
        EXISTING: false,
      }
    },
  },

  watch: {
    targetCourse() {
      if (!this.targetCourse) return
      this.getProblems({ course: this.targetCourse })
    },
  },

  created() {
    this.getCourses()
  },

  methods: {
    ...mapActions({
      getCourses: ActionTypes.GET_COURSES,
      getProblems: ActionTypes.GET_PROBLEMS,
    }),
    createProblem() {
      // if (this.$refs.form.validate()) {
      //   this.$router.push({
      //     name: 'courseSetProblems',
      //     params: { operation: 'new' },
      //     props: {
      //       preSelectedDatasets: this.datasets,
      //     },
      //   })
      // }
    },
    step1To2() {
      if (this.$refs.stepOneForm.validate()) {
        this.step = 2
      }
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>
