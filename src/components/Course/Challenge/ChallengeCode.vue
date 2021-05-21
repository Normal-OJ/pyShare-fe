<template>
  <div>
    <div class="mt-4 d-flex flex-column">
      <CodeEditor v-model="code" :height="200">
        <div class="d-flex pb-1">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <v-btn
                class="ml-2"
                color="primary"
                v-on="on"
                v-bind="attr"
                small
                @click="setDefaultCode"
              >
                <v-icon>mdi-autorenew</v-icon>
              </v-btn>
            </template>
            <span>恢復為預設程式碼</span>
          </v-tooltip>
        </div>
      </CodeEditor>
    </div>
    <div class="mt-4 d-flex">
      <v-spacer />
      <v-btn color="success" @click="submitTest" class="mr-3">測試</v-btn>
      <v-btn color="success">送出</v-btn>
    </div>
    <Spinner v-if="isPending" />
  </div>
</template>

<script>
import CodeEditor from '@/components/UI/CodeEditor'
import Spinner from '@/components/UI/Spinner'

export default {
  components: { CodeEditor, Spinner },

  props: {
    defaultCode: {
      type: String,
      default: '',
    },
    testResult: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    isPending: false,
    code: '',
  }),

  methods: {
    setDefaultCode() {
      const result = window.confirm('套用預設程式碼將會覆蓋掉現有的程式碼，是否要繼續？')
      if (!result) return
      this.code = this.defaultCode
    },
    submitTest() {
      this.$emit('submit-test-submission', this.code)
    },
  },
}
</script>
