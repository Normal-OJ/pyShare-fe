import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { UNLIMIT, getCourses, getTags, getProfile } from '@/util.js'
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
    Image,
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
                    new Image(),
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
                pid: '',
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
            },
            downloading: false,
        }
    },

    beforeDestroy() {
        this.editor.destroy()
    },

    beforeMount() {
        this.getProblem()
        getCourses(false).then(courses => {
            if ( getProfile().role == 2 )   this.courses = [getProfile().course]
            else this.courses = courses
        })
        this.setCourse()
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
                getTags(this.problem.course).then(tags => this.availableTags = tags)
            }
        }
    },

    methods: {
        setCourse() {
            if ( this.$route.params.id === 'new' ) {
                if ( this.$route.query.course ) this.problem.course = this.$route.query.course;
                else    this.problem.course = getProfile().course
            }
        },
        async getProblem() {
            let result;
            try {
                if (this.$route.params.id != 'new') {
                    result = await this.$http.get(`/problem/${this.$route.params.id}`);
                    result = result.data.data
                    this.problem.pid = result.pid
                    this.problem.title = result.title
                    this.problem.status = result.status
                    this.problem.tags = result.tags
                    this.problem.course = result.course
                    this.content = JSON.parse(result.description)
                    this.editor.setContent(this.content)
                    this.problem.defaultCode = result.defaultCode
                    this.problem.attachments = result.attachments
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
                    this.problem.pid = result.data.data.pid
                } else {
                    result = await this.$http.put(`/problem/${this.$route.params.id}`, this.problem);
                }
                this.alert.problem.msg = '題目內容上傳成功！'
            } catch (e) {
                console.log(e);
                this.alert.problem.msg = '題目內容上傳失敗！'
            }
            this.uploadAttachment(this.problem.pid)
        },
        async uploadAttachment(pid) {
            let result;
            let attStatus = { success: [], fail: [] };
            this.alert.att.msg = '題目附件上傳中...'
            for (let i = 0; i < this.files.length; i++) {
                this.alert.att.value = true
                try {
                    let formData = new FormData();
                    formData.append('attachment', this.files[i]);
                    result = await this.$http.post(`/problem/${pid}/attachment`, formData);
                    attStatus.success.push(this.files[i].name);
                } catch (e) {
                    console.log(e);
                    attStatus.fail.push(this.files[i].name);
                }
            }
            this.alert.att.msg = `題目附件上傳\n成功：\n${attStatus.success.join('\n')}\n失敗：\n${attStatus.fail.join('\n')}`
            if ( this.$route.params.id == 'new' ) {
                this.$router.push(`/admin/problem/${this.problem.pid}`);
            }
            this.getProblem();
            this.files = [];
        },
        async deleteAttachment(filename, pid) {
            let result;
            try {
                let formData = new FormData();
                formData.append('attachmentName', filename);
                result = await this.$http.delete(`/problem/${pid}/attachment`, { data: formData });
                this.alert.rmAtt.msg = `題目附件：${filename} 移除成功`
            } catch (e) {
                console.log(e);
                this.alert.rmAtt.msg = `題目附件：${filename} 移除失敗`
            }
            this.alert.rmAtt.value = true
            for ( let i=0; i<this.problem.attachments.length; ++i )
                if ( this.problem.attachments[i] === filename )
                    this.problem.attachments.splice(i,1);
        },
        async download(filename, pid) {
            let url = `/api/problem/${pid}/attachment/${filename}`;
            let routeData = this.$router.resolve({path: url});
            window.open(routeData.href, '_blank');
        },
        showImagePrompt(command) {
          const src = prompt('Enter the url of your image here')
          if (src !== null) {
            command({ src })
          }
        },
    },
});