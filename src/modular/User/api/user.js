import {post, fetch} from '../../../http'

export const getUserByAdmin = (url, param) => post(url, param)
export const LockedUser = (url, param) => fetch(url, param)
export const getUserById = (url, param) => fetch(url, param)