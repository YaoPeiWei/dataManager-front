import {post, fetch} from '../../../http'

export const dologin = (url, param = {}) => post(url, param)
export const getLoginUser = (url, param) => fetch(url, param)
