import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    User: 'LoginUser', // 登陆用户KEY => 具体用户信息存在sessionstore 中
    RememberUser: 'RememberUser' // 记住用户KEY => 具体账号信息存在localstore 中
  },
  getters: {
    getLoginUser: state => JSON.parse(sessionStorage.getItem(state.User)),
    getRememberUser: state => JSON.parse(localStorage.getItem(state.RememberUser))
  },
  // mutations => 一般是同步操作, this.$store.commit('mutations方法名', 值)
  mutations: {
    setLoginUser: (state, user) => sessionStorage.setItem(state.User, JSON.stringify(user)),
    clearLoginUser: state => sessionStorage.removeItem(state.User),
    setRememberUser: (state, user) => localStorage.setItem(state.RememberUser, JSON.stringify(user)),
    clearRememberUser: state => localStorage.removeItem(state.RememberUser)
  },
  // action => 可以存放一些异步的方法， 比如向后台提交数据...... this.$store.dispatch('action方法名', 值)
  actions: {

  }
})

export default store
