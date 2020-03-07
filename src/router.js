import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/HelloWorld',
    name: '初始化vue界面',
    component: () => import('./modular/HelloWorld')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./modular/Login/components/Login')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('./modular/Index/components/Index'),
    redirect: '/index/order',
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('./modular/Order/components/user/OrderIndex')
      },
      {
        path: 'HelloWorld',
        name: 'HelloWorld',
        component: () => import('./modular/HelloWorld')
      },
      {
        path: 'adminOrderIndex',
        name: 'adminOrderIndex',
        component: () => import('./modular/Order/components/admin/adminOrderIndex')
      },
      {
        path: 'adminCarPark',
        name: 'adminCarPark',
        component: () => import('./modular/CarPark/components/CarParkIndex')
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 全局路由守卫配置
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     sessionStorage.removeItem('user')
//   }
//   let user = JSON.parse(sessionStorage.getItem('LoginUser'))
//   if (!user && to.path !== '/login' && to.path !== '/index/order') {
//     next({path: '/login'})
//   } else {
//     next()
//   }
//   // if (to.matched.some((route) => route.meta.Auth)) {
//   //   next({
//   //     path: '/login',
//   //     query: {
//   //       returnURL: to.path
//   //     }
//   //   })
//   // } else {
//   //   next()
//   // }
// })
export default router
