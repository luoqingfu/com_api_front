import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import storage from "./utils/storage";
import { Modal } from "ant-design-vue";
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
} from "ant-design-vue";

Vue.prototype.$confirm = Modal.confirm;
Vue.config.productionTip = false;
Vue.prototype.$storage = storage;
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
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
