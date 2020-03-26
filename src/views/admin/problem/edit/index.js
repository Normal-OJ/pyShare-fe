import Vue from 'vue';
import html from './index.pug';
import './index.scss';
// import hljs from 'highlight.js';
// import pycss from 'highlight.js/lib/languages/css';
// import pyjs from 'highlight.js/lib/languages/python';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  // CodeBlockHighlight,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';
// import Vuex file ...

export default Vue.extend({
  template: html,

  components: {
    EditorMenuBar,
    EditorContent,
  },
  
  data () {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new BulletList(),
          new OrderedList(),
          new ListItem(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: ``,
        onUpdate: ({ getJSON }) => {
          this.prob.description = getJSON()
        },
      }),
      // comment: new Editor({
      //   extensions: [
      //     new Code(),
      //     new CodeBlockHighlight({
      //       languages: {
      //         javascript,
      //         css,
      //         // pycss,
      //         // pyjs,
      //       },
      //     })
      //   ],
      //   content: `<pre><code># paste your code here</code></pre>`,
      //   onUpdate: ({ getJSON }) => {
      //     this.prob.defaultCode = getJSON()
      //   },
      // }),
      prob: {
        title: null,
        description: null, 
        status: null,
        tags: null,
        defaultCode: null,
      },
    }
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  ready () {
  },

  // methods: {
  //   hor() {
  //     console.log('hor!!!')
  //   }
  // },
});