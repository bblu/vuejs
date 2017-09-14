import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './assets/theme/theme-sg/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import axios from 'axios'
// // mock data
// import Mock from './mock'
// Mock.bootstrap();


import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

window.eventBus = new Vue();

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path != '/login' && to.path != '/register') {
  //   next({ path: '/login' });
  // } else {
  //   next();
  // }
  next();
})

//router.afterEach(transition => {
//NProgress.done();
//});

axios.get('/data.ini?t=201705241617').then((res) => {
  window.__config = res.data;
  new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app');

})
