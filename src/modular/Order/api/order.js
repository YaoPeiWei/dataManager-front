import {fetch, post} from '../../../http'

export const getLoginUserOrders = (url, param) => fetch(url, param)
export const getLoginUserUnFinishedOrder = (url, param) => fetch(url, param)
export const inserOrder = (url, param) => post(url, param)
export const getUnFinishedOrder = (url, param) => post(url, param)
export const ParkingOrder = (url, param) => fetch(url, param)
