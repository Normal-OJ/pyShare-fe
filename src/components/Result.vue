<template lang="pug">
  div( :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '100%' }" )
    v-tabs.pa-0.ma-0( background-color="#e7e7e7" color="primary" left )
      v-tab 標準輸出
      v-tab 輸出檔案
      v-tab 錯誤訊息
      v-tab-item
        pre( v-highlightjs="stdout" )
          code
      v-tab-item.imgblock
        v-row.my-1( no-gutters v-if="misc && misc.length > 0" )
          v-menu( offset-y )
            template( v-slot:activator="{ on }" ) 
              v-btn.text-none( outlined v-on="on" small )
                | {{ browsing }}
                v-icon mdi-chevron-down
            v-list
              v-list-item( v-for="(file, idx) in misc" :key="file" @click="browsing = file" )
                v-list-item-title {{ file }}
          v-btn.ml-6( v-if="browsing!='請選擇'" color="info" small @click="download" :loading="downloading" )
            v-icon mdi-file-download
            | 下載
        v-row.my-1( no-gutters )
          v-col( cols="12" md="3" v-for="(img, idx) in images" :key="img" )
            v-img.hover-click( max-height="200" contain :src="img" @click="overlayImg = img; overlay = true;" )
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
    
    v-dialog( v-model="overlay" width="60vw" )
      v-row( justify="center" )
        v-btn( icon @click="overlay = false" )
          v-icon mdi-close
      v-img( max-width="60vw" contain :src="overlayImg" )
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
      overlay: false,
      overlayImg: '',
      images: [],
      misc: [],
    }
  },

  beforeMount() {
    this.getFiles();
  },

  watch: {
    files() {
      this.getFiles();
    }
  },

  methods: {
    isImage(f) {
      return ( f === 'png' || f === 'jpg' || f === 'gif' || f === 'jpeg' || f === 'webp' || f === 'svg' || f === 'bmp' )
    },
    async getFiles() {
      this.images = [];
      this.misc = [];
      for (let i = 0; i < this.files.length; i++) {
        let ext = this.files[i].split('.');
        ext = ext[ext.length - 1];
        if ( this.isImage(ext) )
          this.images.push(`/api/comment/${this.cid}/file/${this.files[i]}`);
        else
          this.misc.push(this.files[i]);
      }
    },
    async download() {
      let url = `/api/comment/${this.cid}/file/${this.browsing}`;
      let routeData = this.$router.resolve({path: url});
      window.open(routeData.href, '_blank');
    },
  }
}
</script>

<style lang="scss" scoped>
$color-black: #000000;
$color-grey: #e7e7e7;

.hover-click:hover {
  cursor: pointer;
}

.imgblock {
  background: $color-grey !important;
}

.codeblock {
  pre {
    border-radius: 5px;
    background: $color-grey;
    overflow-x: auto;

    code {
      display: block;
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