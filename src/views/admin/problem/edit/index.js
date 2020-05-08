import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { UNLIMIT, getCourses, getTags } from '@/util.js'
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
                onUpdate: ({ getJSON }) => {
                    this.content = getJSON()
                },
            }),
            problem: {
                title: '',
                description: '',
                course: UNLIMIT,
                status: null,
                tags: [],
                defaultCode: '',
            },
            files: [],
            availableTags: [],
            courses: [],
            status: [{text: '顯示', value: 1}, {text: '隱藏（僅老師和創題者可見）', value: 0}],
            unlimit: UNLIMIT,
            content: '',
        }
    },

    beforeDestroy() {
        this.editor.destroy()
    },

    beforeMount() {
        this.getProblem()
        getCourses(false).then(courses => this.courses = courses)
        getTags().then(tags => this.availableTags = tags)
    },

    computed: {
      course() {
        return this.problem.course
      }
    },
    watch: {
      course() {
        this.availableTags = []
        if ( this.problem.course != UNLIMIT ) {
          getTags(this.course).then(tags => this.availableTags = tags)
        }
      }
    },

    methods: {
        async getProblem() {
            let result;
            try {
                if (this.$route.params.id != 'new') {
                    result = await this.$http.get(`/problem/${this.$route.params.id}`);
                    result = result.data.data
                    this.problem.title = result.title
                    this.problem.status = result.status
                    this.files = result.attachments
                    this.problem.tags = result.tags
                    this.problem.course = result.course
                    this.content = JSON.parse(result.description)
                    this.editor.setContent(this.content)
                    this.problem.defaultCode = result.defaultCode
                    console.log(result)
                }
            } catch (e) {
                console.log(e);
            }
        },
        async createProblem() {
            this.problem.description = JSON.stringify(this.content)
            let result;
            try {
                if (this.$route.params.id == 'new')
                    result = await this.$http.post('/problem', this.problem);
                else
                    result = await this.$http.put(`/problem/${this.$route.params.id}`, this.problem);
            } catch (e) {
                console.log(e);
            }
            this.uploadAttachment()
        },
        async uploadAttachment() {
            /*
              uploadAttachment
                @problem_api.route('/<int:pid>/attachment', methods=['POST', 'DELETE'])
                @Request.files('attachment')
                @Request.form('attachment_name')
            */
            console.log(this.files);
        }
    },
});