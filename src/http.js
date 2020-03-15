import axios from 'axios'
import router from './router'
import store from './store'
// import {setCookie, getCookie} from './cookie'

// 自定义配置新建一个axios实例
const http = axios.create({
  timeout: 5000
})

if (process.env.NODE_ENV === 'development') {
  http.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
  http.defaults.baseURL = ''
}

// http request 拦截器
http.interceptors.request.use(
  config => {
    // const token = getCookie('authorization')
    const token = store.state.authorization
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
http.interceptors.response.use(
  response => {
    // console.log(JSON.stringify(response))
    // 101 => 用户不存在, 111 => 用户已经登陆, 97 => TOKEN 不能为空, 98 => TOKEN 校验错误
    if (response.data.code === 101 || response.data.code === 111 || response.data.code === 97 || response.data.code === 98) {
      router.push({
        path: '/login'
        // query: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
      })
    }
    // 103 => 登陆成功
    if (response.status === 200 && response.data.code === 103) {
      // 将 header 中的 token 取出并存入cookie 中
      const authorization = response.headers['authorization']
      // console.log(authorization)
      // setCookie('authorization', authorization, 3600)
      store.commit('setAuthorization', authorization)
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    http.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    http.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    http.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    http.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
