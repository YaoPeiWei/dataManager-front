import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    User: 'LoginUsers', // 登陆用户KEY => 具体用户信息存在sessionstore 中
    RememberUser: 'RememberUser', // 记住用户KEY => 具体账号信息存在localstore 中
    userId: 'userId',
    authorization: 'authorization'
  },
  getters: {
    getLoginUser: state => {
      const loginUserArray = JSON.parse(sessionStorage.getItem(state.User))
      if (loginUserArray) {
        const user = loginUserArray.filter(item => item.id === sessionStorage.getItem(state.userId))
        return user[0]
      }
      return null
    },
    getRememberUser: state => {
      const RememberMe = JSON.parse(localStorage.getItem(state.RememberUser))
      return RememberMe
    },
    getAuthorization: state => {
      // console.log(state.authorization)
      // console.log(sessionStorage.getItem(state.authorization))
      return sessionStorage.getItem(state.authorization)
    },
    getUserId: state => {
      // console.log(sessionStorage.getItem(state.userId))
      return sessionStorage.getItem(state.userId)
    }
  },
  // mutations => 一般是同步操作, this.$store.commit('mutations方法名', 值)
  mutations: {
    setLoginUser: (state, user) => {
      let userArray = []
      userArray = JSON.parse(sessionStorage.getItem(state.User))
      let a = []
      if (userArray) {
        a = userArray.map(item => item)
      } else {
        a = []
      }
      if (a.filter(item => item.id === user.id).length <= 0) {
        a.push(user)
        sessionStorage.setItem(state.userId, user.id)
      }
      sessionStorage.setItem(state.User, JSON.stringify(a))
    },
    clearLoginUser: state => {
      // const loginUserArray = JSON.parse(sessionStorage.getItem(state.User))
      // let userArray = []
      // if (loginUserArray) {
      //   userArray = loginUserArray.filter(item => item.id !== sessionStorage.getItem(state.userId))
      // }
      // sessionStorage.removeItem(state.authorization)
      // sessionStorage.removeItem(state.userId)
      // sessionStorage.removeItem(state.User)
      sessionStorage.clear()
    },
    setRememberUser: (state, user) => localStorage.setItem(state.RememberUser, JSON.stringify(user)),
    clearRememberUser: state => localStorage.removeItem(state.RememberUser),
    setAuthorization: (state, authorization) => sessionStorage.setItem(state.authorization, authorization)
  },
  // action => 可以存放一些异步的方法， 比如向后台提交数据...... this.$store.dispatch('action方法名', 值)
  actions: {

  }
})

export default store
