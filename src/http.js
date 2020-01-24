import axios from 'axios'
import router from './router'
import {setCookie, getCookie} from './cookie'

axios.defaults.timeout = 5000
axios.defaults.baseURL = ''

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = getCookie('Authorization')
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': undefined
    }
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // 101 => 用户不存在, 111 => 用户已经登陆, 97 => TOKEN 不能为空, 98 => TOKEN 校验错误
    if (response.status === 200 && (response.data.code === 101 || response.data.code === 111 || response.data.code === 97 || response.data.code === 98)) {
      router.push({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
      })
    }
    // 103 => 登陆成功
    if (response.status === 200 && response.data.code === 103) {
      // 将 header 中的 token 取出并存入cookie 中
      const authorization = response.headers['Authorization']
      setCookie('Authorization', authorization, 3600)
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
    axios.get(url, {
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
    axios.post(url, data)
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
    axios.patch(url, data)
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
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
