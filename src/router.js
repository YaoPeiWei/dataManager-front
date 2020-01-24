import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/HelloWorld',
    name: '初始化vue界面',
    component: () => import('./components/HelloWorld')
  }
]
const router = new VueRouter({
  routes
})

// 全局路由守卫配置
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((route) => route.meta.Auth)) {
//     next({
//       path: '/login',
//       query: {
//         returnURL: to.path
//       }
//     })
//   } else {
//     next()
//   }
// })
export default router
