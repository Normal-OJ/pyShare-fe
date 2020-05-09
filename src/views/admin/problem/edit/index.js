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
                attachments: [],
            },
            files: [],
            availableTags: [],
            courses: [],
            status: [{ text: '顯示', value: 1 }, { text: '隱藏（僅老師和創題者可見）', value: 0 }],
            unlimit: UNLIMIT,
            content: '',
            alert: {
                rmAtt: {
                    value: false,
                    msg: '',
                },
                problem: {
                    value: false,
                    msg: '',
                },
                att: {
                    value: false,
                    msg: '',
                }
            }
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
            if (this.problem.course != UNLIMIT) {
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
                    this.problem.attachments = result.attachments
                    this.problem.attachments = ["test.csv"]
                }
            } catch (e) {
                console.log(e);
            }
        },
        async createProblem() {
            this.problem.description = JSON.stringify(this.content)
            this.alert.problem.msg = '題目內容上傳中...'
            this.alert.problem.value = true
            let result;
            let pid = this.$route.params.id
            try {
                if (pid == 'new') {
                    result = await this.$http.post('/problem', this.problem);
                    pid = result.data.pid
                } else {
                    result = await this.$http.put(`/problem/${this.$route.params.id}`, this.problem);
                }
                this.alert.problem.msg = '題目內容上傳成功！'
            } catch (e) {
                console.log(e);
                this.alert.problem.msg = '題目內容上傳失敗！'
            }
            this.uploadAttachment(pid)
        },
        async uploadAttachment(pid) {
            this.alert.att.msg = '附件上傳中...'
            this.alert.att.value = true
            let result;
            let cnt = [0, 0]
            for (let i = 0; i < this.files.length; i++) {
                try {
                    let formData = new FormData();
                    formData.append('attachment', this.files[i]);
                    result = await this.$http.post(`/${pid}/attachment`, formData);
                    cnt[0]++;
                } catch (e) {
                    console.log(e);
                    cnt[1]++;
                }
            }
            this.alert.att.msg = `附件上傳：成功 ${cnt[0]}、失敗 ${cnt[1]}`
        },
        async deleteAttachment(filename, pid) {
            /*
                put these two lines of codes at the end of try {}
                this.alert.rmAtt.msg = '附件移除成功'
                this.alert.rmAtt.value = true

                put these two lines of codes at the end of catch(e) {}
                this.alert.rmAtt.msg = '附件移除失敗'
                this.alert.rmAtt.value = true
            */
        }
    },
});