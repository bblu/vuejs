import Vue from 'vue'
import { L } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
// import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n bblu

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

// bblu add @ 2018-11-21
import i18n from './lang'
// import 'leaflet.icon.glyph'
import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
