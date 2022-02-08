<template>
  <v-dialog
    :value="isOpen"
    width="750"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
        dense
      >
        <v-toolbar-title>複製{{ label }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8 text--primary">
        請選擇欲將{{ label }}（pid: {{ clonePid }}）複製到哪個課程
        <v-form
          ref="form"
          class="mt-2"
        >
          <v-select
            v-model="target"
            :items="teachingCourses"
            item-text="name"
            item-value="id"
            outlined
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :loading="isLoading"
          :disabled="!target"
          @click="cloneProblem"
        >
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
      this.$agent.Problem.clone(this.clonePid, this.target)
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
    close() {
      this.$emit('close')
    },
  },
}
</script>
