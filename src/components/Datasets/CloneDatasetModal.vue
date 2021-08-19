<template>
  <v-dialog :value="open" width="750" persistent>
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>複製資料集</v-toolbar-title>
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
              選擇複製方式
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">
              命名複製資料
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              完成
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-form class="mt-2 mb-8" ref="stepOneForm">
                <div class="text-body-1">請選擇欲將資料集複製到哪個課程</div>
                <v-select
                  v-model="targetCourse"
                  label="選擇課程"
                  class="mt-2"
                  :items="teachingCourses"
                  :rules="[v => !!v || '請選擇課程']"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                />
                <div class="text-body-1">請選擇複製方式</div>
                <v-radio-group v-model="isToCreateProblem" row class="mt-2 mb-6" hide-details>
                  <v-radio label="使用選取的資料集建立新主題" :value="CLONE_TO.NEW" />
                  <v-radio label="將選取的資料集匯入已存在的主題" :value="CLONE_TO.EXISTING" />
                </v-radio-group>
                <div v-show="!isToCreateProblem">
                  <div class="text-body-1">請選擇欲將資料集匯入至哪個主題</div>
                  <v-select
                    v-model="targetPid"
                    label="選擇主題（請先選取課程）"
                    class="mt-2"
                    :items="problems"
                    :rules="[v => isToCreateProblem || !!targetPid || '請選擇主題']"
                    item-text="displayName"
                    item-value="pid"
                    :disabled="!targetCourse"
                    outlined
                    dense
                  />
                </div>
              </v-form>
              <div class="d-flex justify-end">
                <v-btn color="primary" :loading="stepOneLoading" @click="stepOneToTwo">
                  下一步
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-content step="2">
              <template v-if="!isToCreateProblem && targetProblem">
                主題 {{ targetPid }} 內的附件有：
                <ul>
                  <li v-for="{ filename } in targetProblem.attachments" :key="filename">
                    {{ filename }}
                  </li>
                </ul>
              </template>
              <v-form class="mt-2 mb-8" ref="stepTwoForm">
                <div class="text-subtitle-1">您可以在右邊的輸入框重新命名複製出來的資料檔名</div>
                <div class="text-body-2 mb-4">
                  由於檔名為程式讀檔時的檔名，故同一個主題內檔名不得重複
                </div>
                <div
                  v-for="(dataset, index) in datasets"
                  :key="dataset.id"
                  class="d-flex align-baseline mt-2"
                >
                  <div class="d-flex justify-space-between" style="width: 50%">
                    <div>{{ dataset.filename }}</div>
                    <v-icon class="mx-2">mdi-arrow-right</v-icon>
                  </div>
                  <v-text-field
                    v-model="clonedDatasets[index].filename"
                    :placeholder="`${dataset.filename} 的資料檔名`"
                    :rules="[
                      v => !!v || '請輸入資料檔名',
                      v =>
                        (!!v &&
                          (!targetProblem ||
                            targetProblem.attachments.every(att => att.filename !== v))) ||
                        '檔名不可與主題已存在的附件重複',
                      v =>
                        (!!v &&
                          clonedDatasets.every(
                            (att, idx) => att.filename !== v || idx === index,
                          )) ||
                        '檔名不可與其他資料檔名重複',
                    ]"
                    outlined
                    dense
                  />
                </div>
              </v-form>

              <div class="d-flex justify-end">
                <v-btn color="primary" text @click="step = 1">
                  上一步
                </v-btn>
                <v-btn color="primary" @click="stepTwoToThree">
                  下一步
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card height="150">
                <v-card-title class="text-center">
                  <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                  複製資料成功，即將前往主題編輯頁面...
                </v-card-title>
                <v-card-actions class="justify-center">
                  <Spinner />
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from '@/components/UI/Spinner.vue'
import { GetterTypes } from '@/store/getter-types'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { MutationTypes } from '@/store/mutation-types'

export default {
  components: { Spinner },

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
    targetPid: null,
    targetProblem: null,
    stepOneLoading: false,
    clonedDatasets: null,
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
    datasets: {
      handler() {
        this.clonedDatasets = this.datasets.map(({ filename, id }) => ({
          filename,
          id,
        }))
      },
      immediate: true,
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
    async stepOneToTwo() {
      if (this.$refs.stepOneForm.validate()) {
        this.stepOneLoading = true
        if (!this.isToCreateProblem) {
          try {
            const { data } = await this.$agent.Problem.get(this.targetPid)
            this.targetProblem = data.data
          } catch (error) {
            this.$alertFail('資料讀取失敗')
            this.$rollbar.error('[components/CloneDatasetModal/stepOneToTwo]', error)
            return
          }
        }
        this.stepOneLoading = false
        this.step = 2
      }
    },
    stepTwoToThree() {
      if (this.$refs.stepTwoForm.validate()) {
        this.setProblemDatasets(this.clonedDatasets)
        this.step = 3
        setTimeout(() => {
          if (this.isToCreateProblem) {
            this.$router.push({
              name: 'courseSetProblems',
              params: { id: this.targetCourse, operation: 'new' },
              query: { datasets: true },
            })
          } else {
            this.$router.push({
              name: 'courseSetProblems',
              params: { id: this.targetCourse, operation: 'edit' },
              query: { pid: this.targetPid, datasets: true },
            })
          }
        }, 1200)
      }
    },
    close() {
      this.$emit('close')
    },
    ...mapMutations({
      setProblemDatasets: MutationTypes.SET_PROBLEM_DATASETS,
    }),
  },
}
</script>
