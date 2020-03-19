import {post,fetch} from '../../../http'

export const SelectCarPark = (url, param) => post(url, param)
export const saveOrUpdate = (url, param) => post(url, param)
export const DeleteCarPark = (url, param) => fetch(url, param)
