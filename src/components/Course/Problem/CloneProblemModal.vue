<template>
  <v-dialog :value="isOpen" width="750">
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>複製{{ label }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8 text--primary">
        請選擇欲將{{ label }}（pid: {{ clonePid }}）複製到哪個課程
        <v-form class="mt-2" ref="form">
          <v-select
            v-model="target"
            :items="teachingCourses"
            item-text="name"
            item-value="id"
            outlined
            dense
          />
          請選擇欲將{{ label }}複製為何種形式
          <v-radio-group v-model="isTemplate">
            <v-radio :label="`複製為${label}`" :value="false" />
            <v-radio :label="`複製為${label}範本`" :value="true" />
          </v-radio-group>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :loading="isLoading" :disabled="!target" @click="cloneProblem">
          送出
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
    isOpen: {
      type: Boolean,
      required: true,
    },
    clonePid: {
      type: Number,
      required: true,
    },
    defaultCourseId: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
    isTemplate: false,
    target: null,
  }),
  computed: {
    ...mapGetters({
      teachingCourses: GetterTypes.TEACHING_COURSES,
    }),
  },
  created() {
    this.getCourses()
    if (this.defaultCourseId) {
      this.target = this.defaultCourseId
    }
  },
  methods: {
    ...mapActions({
      getCourses: ActionTypes.GET_COURSES,
    }),
    cloneProblem() {
      this.isLoading = true
      this.$agent.Problem.clone(this.clonePid, this.target, this.isTemplate)
        .then(() => {
          this.$alertSuccess(`複製${this.label}成功`)
          this.onSuccess()
        })
        .catch(() => this.$alertFail(`複製${this.label}失敗`))
        .finally(() => (this.isLoading = false))
    },
    onSuccess() {
      this.$emit('success')
    },
    onClose() {
      this.$emit('close')
    },
  },
}
</script>
