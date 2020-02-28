import axios from 'axios'
import {post, fetch} from '../../../http'
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = ''
}

export const dologin = (url, param = {}) => post(url, param)
export const getLoginUser = (url, param) => fetch(url, param)
export const register = (url, param) => post(url, param)
export const uploadCarNumber = file =>
  axios({
    url: '/attach/uploadCarNumber',
    method: 'post',
    data: file,
    timeout: 30000,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
