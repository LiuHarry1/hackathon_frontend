import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import * as API from '@/api';
import zhCn from 'ant-design-vue/lib/locale-provider/zh_CN';
import './permission'; // permission control
import './config';
import '@/plugins';
import '@/tool';
import '@/vendor/codemirror';
import './assets/styles/index.styl';

Vue.config.productionTip = false;
Vue.prototype.$api = API;
Vue.prototype.$utils = require('./utils/index').default;

const vm = new Vue({
  router,
  store,
  render: h => (
    <a-config-provider>
      <App/>
    </a-config-provider>
  ),
});

vm.$mount('#app');
