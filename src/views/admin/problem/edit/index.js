import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { getCourses, getTags } from '@/util.js'
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
    CodeBlockHighlight,
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

    data() {
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
                    new CodeBlockHighlight({
                        languages: {
                            python,
                            css,
                        },
                    })
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
            problem: {
                title: '',
                description: '',
                course: null,
                status: null,
                tags: [],
                defaultCode: '',
            },
            files: [],
            availableTags: [],
            courses: [],
            status: ['顯示', '隱藏（僅老師和創題者可見）']
        }
    },

    beforeDestroy() {
        this.editor.destroy()
    },

    beforeMount() {
        getCourses(false).then(courses => this.courses = courses)
        getTags().then(tags => this.availableTags = tags)
    },

    methods: {
        async createProblem() {
            let result;
            try {
                if (this.$route.params.id == 'new')
                    result = await this.$http.post('/problem', this.problem);
                else
                    result = await this.$http.put(`/problem/${this.$route.params.id}`, this.problem);
            } catch (e) {
                console.log(e);
            }
        }
    },
});