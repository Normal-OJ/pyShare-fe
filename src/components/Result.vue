<template lang="pug">
  div( :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '100%' }" )
    v-tabs.pa-0.ma-0( background-color="#e7e7e7" color="primary" left )
      v-tab 標準輸出
      v-tab 輸出檔案
      v-tab 錯誤訊息
      v-tab-item
        pre( v-highlightjs="stdout" )
          code
      v-tab-item( style="background-color: '#e7e7e7'" )
        v-menu( offset-y )
          template( v-slot:activator="{ on }" ) 
            v-btn.text-none( outlined v-on="on" small )
              | {{ browsing }}
              v-icon mdi-chevron-down
          v-list
            v-list-item( v-for="(file, idx) in files" :key="idx" @click="browsing = file" )
              v-list-item-title {{ file }}
        v-btn.ml-6( v-if="browsing!='請選擇'" color="info" small @click="download" :loading="downloading" )
          v-icon mdi-file-download
          | 下載
        //- v-container( fluid )
        //-   v-img( max-height="200" )
        //-     template( v-slot:placeholder )
        //-       v-row.fill-height.ma-0( align="center" justify="center" )
        //-         v-progress-circular( indeterminate color="grey lighten-5" )
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
    cid: {
      required: true,
    }
  },

  data () {
    return {
      browsing: '請選擇',
      downloading: false,
    }
  },

  beforeMount() {
    // this.getFiles();
  },

  methods: {
    // async getFiles() {
    //   for (let i = 0; i < this.files.length; i++) {
    //     console.log(this.files[i])
    //     try {
    //       let res = await this.$http.get(`/comment/${this.cid}/file/${this.files[i]}`);
    //       console.log(res);
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // },
    async download() {
      try {
        this.downloading = true;
        let result = await this.$http.get(`/comment/${this.cid}/attachment/${this.browsing}`);
        var file = new Blob([result], { type: 'text/plain;charset=utf-8' });
        if (window.navigator.msSaveOrOpenBlob) { // IE10+
          window.navigator.msSaveOrOpenBlob(file, this.browsing);
        } else { // Others
          var a = document.createElement("a");
          var url = URL.createObjectURL(file);
          a.href = url;
          a.download = this.browsing;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }, 0);
        }
        this.downloading = false;
      } catch (e) {
        console.log(e);
        this.downloading = false;
      }
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