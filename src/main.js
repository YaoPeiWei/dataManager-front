import Vue from 'vue'
import App from './App'
import router from './router'
import Antdesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import store from './store'
import AMap from 'vue-amap'
Vue.use(AMap)
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: '8cefb0eac944d42adff48384cc8aa82b',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Geolocation']
})

Vue.config.productionTip = false
Vue.use(Antdesign)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
