<template lang="pug">
  div( :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '100%' }" )
    v-tabs.pa-0.ma-0( background-color="#e7e7e7" color="primary" left )
      v-tab 標準輸出
      v-tab 輸出檔案
      v-tab 錯誤訊息
      v-tab-item
        pre( v-highlightjs="stdout" )
          code
      v-tab-item
        v-container( fluid )
          v-img( max-height="200" )
            template( v-slot:placeholder )
              v-row.fill-height.ma-0( align="center" justify="center" )
                v-progress-circular( indeterminate color="grey lighten-5" )
      v-tab-item
        pre( v-highlightjs="stderr" )
          code
      v-spacer
      v-tooltip( bottom color="#000000E6" )
        template( v-slot:activator="{ on }" )
          v-btn.mr-6( v-on="on" color="success" icon small @click="$emit('reget')" )
            v-icon mdi-refresh
        span 若尚未收到結果，請點此重新整理
      v-tooltip( bottom color="#000000E6" )
        template( v-slot:activator="{ on }" )
          v-btn.mr-3( v-on="on" color="error" icon small @click="$emit('rejudge')" )
            v-icon mdi-alert
        span 若程式執行不正確，可以點此重新執行
</template>

<script>
export default {

  name: 'Result',

  props: {
    stderr: {
      default: '',
      type: String,
    },
    stdout: {
      default: '',
      type: String,
    },
    files: {
      default: () => [],
      type: Array,
    },
  },

  data () {
    return {

    }
  },

  beforeMount() {
    this.getFiles();
  },

  methods: {
    getFiles() {
    },
  }
}
</script>

<style lang="scss" scoped>
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.codeblock {
  pre {
    // padding: 0.7rem 1rem;
    border-radius: 5px;
    background: #e7e7e7;
    overflow-x: auto;

    code {
      display: block;
      // padding: 0 0.4rem;
      background: rgba($color-black, 0);
      color: rgba($color-black, 0.9);
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }

  code::before {
    content: "" !important,
  }
}
</style>