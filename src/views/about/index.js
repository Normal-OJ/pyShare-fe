import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
    template: html,

    data() {
        return {
        	logo: require('@/assets/pyShare.png'),
        }
    }
});