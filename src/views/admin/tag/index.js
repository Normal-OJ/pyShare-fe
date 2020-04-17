import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
  template: html,
  
  data () {
    return {
      items: ['分類一', '分類三'],
      settings: [],
    }
  },

  ready () {
  },

  methods: {
    myToggle() {
      this.$nextTick(() => {
        if ( this.selectAll() ) {
          this.settings = [];
        } else {
          this.settings = [];
          for ( let i=0; i<this.items.length; i++ ) this.settings.push(i);
        }
      })
    },
    selectAll() {
      return this.settings.length === this.items.length
    },
    selectSome() {
      return this.settings.length > 0 && !this.selectAll()
    },
    icon() {
      if ( this.selectAll() ) return 'mdi-close-box'
      if ( this.selectSome() ) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
});