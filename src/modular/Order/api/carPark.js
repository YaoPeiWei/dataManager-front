import {post, fetch} from '../../../http'

export const getCarPark = (url, param) => post(url, param)
export const getCarParkByID = (url, param) => fetch(url, param)
export const getLoginUserOrders = (url, param) => fetch(url, param)
