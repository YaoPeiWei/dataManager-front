import {fetch} from '../../../http'
import axios from 'axios'

export const logout = (url, param = {}) => fetch(url, param)
export const uploadImage = file =>
  axios({
    url: '/attach/uploadImage',
    method: 'post',
    data: file,
    timeout: 30000,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
