<template lang="pug">
  div( :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '100%' }" )
    //- v-row.py-0( no-gutter )
    v-tabs.pa-0.ma-0( background-color="#e7e7e7" color="primary" left )
      v-tab 標準輸出
      v-tab 輸出檔案
      v-tab 錯誤訊息
      v-tab-item
        code {{ stdout }}
      v-tab-item
        v-container( fluid )
          v-img( max-height="200" )
            template( v-slot:placeholder )
              v-row.fill-height.ma-0( align="center" justify="center" )
                v-progress-circular( indeterminate color="grey lighten-5" )
      v-tab-item
        code {{ stderr }}
      v-spacer
      v-tooltip( bottom color="#000000E6" )
        template( v-slot:activator="{ on }" )
          v-btn.mr-6( color="success" icon small @click="$emit('reget')" )
            v-icon mdi-refresh
        span 若尚未收到結果，請點此重新整理
      v-tooltip( bottom color="#000000E6" )
        template( v-slot:activator="{ on }" )
          v-btn.mr-3( color="error" icon small @click="$emit('rejudge')" )
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
      default: [],
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
      console.log(this.files);
    },
  }
}
</script>

<style lang="css" scoped>
</style>