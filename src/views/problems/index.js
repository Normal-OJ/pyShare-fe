import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
    template: html,

    data() {
        return {
            items: []
        }
    },

    ready() {},

    beforeMount() {
        this.getProblems()
    },

    methods: {
        async getProblems() {
            let result;
            try {
                result = await this.$http.get('/api/problem');
            } catch (e) {
                console.log(e);
                result = {
                    'data': [{
                        pid: '1',
                        title: 'DSCP修課背景分析',
                        timestamp: '',
                        author: {
                            username: 'tcc',
                            displayedName: '蔣宗哲',
                        },
                        status: 0
                    }]
                }
            }
            this.items = result.data.map((problem) => {
                problem.tags = []
                return problem
            });
        }
    },
});