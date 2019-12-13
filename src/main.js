import 'element-ui/lib/theme-chalk/index.css'
import './style/common.scss';
import './assets/icon/iconfont.css'
import Vue from 'vue'
import VueCookies from 'vue-cookies';
import download from 'downloadjs';
import {
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Collapse,
  CollapseItem,
  Container,
  DatePicker,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Header,
  Input,
  Radio,
  RadioGroup,
  Carousel,
  CarouselItem,
  Checkbox,
  CheckboxGroup,
  Menu,
  MenuItem,
  MenuItemGroup,
  Option,
  Pagination,
  Row,
  Select,
  Submenu,
  Table,
  Tabs,
  TabPane,
  Tag,
  Tree,
  TableColumn,
  Main,
  Message,
  MessageBox,
  Popover,
  Card,
  Upload,
  Tooltip,
  Cascader,
  Autocomplete
} from 'element-ui';

import ptTable from "./components/ptTable";
import ptSearch from "./components/ptSearch";
import VALID from './lib/validation';
import ENUM from './constant/enum';

import App from './App'
import router from './router/router'
import store from './store/store'

import * as filters from './lib/filters'
import * as methods from './lib/methods'

Vue.component('pt-table', ptTable);
Vue.component('pt-search', ptSearch);

Vue.use(Aside);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Button);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(Container);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Header);
Vue.use(Input);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Select);
Vue.use(Submenu);
Vue.use(Table);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(TableColumn);
Vue.use(Main);
Vue.use(Radio);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(Card);
Vue.use(Upload);

Vue.use(VueCookies);
Vue.use(Autocomplete);

Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$downloadFile = download;

Vue.prototype.$valid = VALID;
Vue.prototype.$enum = ENUM;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

Object.keys(methods).forEach(key => {
  Vue.prototype[key] = methods[key]
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
