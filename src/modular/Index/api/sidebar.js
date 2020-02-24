import {fetch} from '../../../http'

export const logout = (url, param = {}) => fetch(url, param)
