import Vue from 'vue';
import VueMeta from 'vue-meta';
import AntDesign, { Modal } from 'ant-design-vue';
import ConfirmModal from './confirm';
import Drawer from './drawer';
import AntTable from '@/components/AntTable';
import 'ant-design-vue/dist/antd.less';
import 'animate.css';
import '@/style/reset.styl';
import './form';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueMeta);
Vue.use(AntDesign);
Vue.use(ElementUI);

// a-table的拓展table
Vue.component(AntTable.name, AntTable);

Vue.prototype.$modal = Modal;
Vue.prototype.$confirm = ConfirmModal;
Vue.prototype.$drawer = Drawer;
