<template>
  <v-dialog :value="isVisible" persistent width="1000px">
    <v-card width="1000px" class="pb-4">
      <v-toolbar elevation="0">
        <v-toolbar-title>是否要移除勾選的成員？</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon color="black" @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="text--primary">
        <p>
          以下是即將被移除的課程成員，此動作將<strong>無法復原</strong>。
          <span class="red--text">請注意以下成員創作的主題、創作、留言將會一併移除</span>。
        </p>
        <div style="max-height: 200px; overflow-y: scroll">
          <ol>
            <li v-for="member in willDeleteMembers" :key="member">{{ member }}</li>
          </ol>
        </div>
      </v-card-text>
      <v-card-actions class="flex-column align-center">
        在此輸入課程名稱：{{ courseName }} 以執行刪除
        <v-text-field
          v-model="inputText"
          class="mt-4"
          outlined
          dense
          width="50%"
          :error="!!deleteStudentErrorMsg"
          :error-messages="deleteStudentErrorMsg"
        />
        <v-btn
          color="error"
          @click="handleClick"
          :disabled="inputText !== courseName"
          :loading="isLoading"
        >
          確認刪除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    willDeleteMembers: {
      type: Array,
      required: true,
    },
    deleteStudentErrorMsg: {
      type: String,
      required: true,
    },
  },

  computed: {
    courseName() {
      return this.$route.params.name
    },
  },

  data: () => ({
    inputText: '',
  }),

  methods: {
    handleClick() {
      this.$emit('delete-student')
    },
  },
}
</script>
