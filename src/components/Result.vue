<template lang="pug">
  div( :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '100%' }" )
    v-tabs.pa-0.ma-0( background-color="#e7e7e7" color="primary" right )
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
</template>

<script>
export default {

  name: 'Result',

  props: {
    stderr: {
      required: true,
      type: String,
    },
    stdout: {
      required: true,
      type: String,
    },
    files: {
      required: true,
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