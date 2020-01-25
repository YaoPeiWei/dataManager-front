import Vue from 'vue'
import App from './App'
import router from './router'
import Antdesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import store from './store'
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
