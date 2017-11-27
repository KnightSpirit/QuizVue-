import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router'
import { Spinner, Badge, Button, Checklist, Radio, Popup, InfiniteScroll, Cell, Picker, Field } from 'mint-ui'
import 'mint-ui/lib/style.css'
import start from './vue_components/start.vue'
import level from './vue_components/level.vue'
import login from './vue_components/login.vue'
import questionType from './vue_components/questionType.vue'
import dashboard from './vue_components/dashboard.vue'
import mode from './vue_components/qMode.vue'
import ax from './axio_instance';

Vue.use(VueRouter);
Vue.component(Button.name, Button);
Vue.component(Checklist.name, Checklist);
Vue.component(Radio.name, Radio);
Vue.component(Cell.name, Cell);
Vue.component(Badge.name, Badge);
Vue.component(Spinner.name, Spinner);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
Vue.component(Field.name, Field);
Vue.use(InfiniteScroll);

const routes = [
  { path: '/', component: login },
  { path: '/start', component: start, name: 'start' },
  { path: '/selectQuestion', component: questionType, name: 'selectQuestion' },
  { path: '/level/:level', component: level, name: 'level' },
  { path: '/dashboard', component: dashboard, name: 'dashboard' },
  { path: '/mode', component: mode, name: 'mode' }
]

export const router = new VueRouter({
  routes
});

const v = new Vue({
  router,
  el:'#app'
});
