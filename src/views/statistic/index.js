import Vue from 'vue';
import html from './index.pug';
// import Vuex file ...

export default Vue.extend({
    template: html,

    data() {
        return {
            statistic: {}
        }
    },

    ready() {},

    beforeMount() {
        this.getStatistic()
    },

    methods: {
        async getStatistic() {
            let result;
            try {
                result = await this.$http.get(`/user/${this.$route.params.name}/statistic`);
            } catch (e) {
                console.log(e);
            }
            this.statistic = result.data.data
        },
    },
});