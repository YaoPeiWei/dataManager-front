import {post} from '../../../http'

export const dologin = (url, param = {}) => post(url, param)
