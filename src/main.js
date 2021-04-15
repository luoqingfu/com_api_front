import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import storage from "./utils/storage";
import { Modal, message } from "ant-design-vue";
import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Input,
  Form,
  Dropdown,
  Table,
  Pagination,
  Divider,
  Select,
} from "ant-design-vue";
Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;
Vue.config.productionTip = false;
Vue.prototype.$storage = storage;
Vue.prototype.$destroyAll = Modal.destroyAll;
Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Form);
Vue.use(Dropdown);
Vue.use(Table);
Vue.use(Pagination);
Vue.use(Divider);
Vue.use(Modal);
Vue.use(Select);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
