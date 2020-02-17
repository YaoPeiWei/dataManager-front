import {fetch, post} from '../../../http'

export const getLoginUserOrders = (url, param) => fetch(url, param)
export const getLoginUserUnFinishedOrder = (url, param) => fetch(url, param)
export const inserOrder = (url, param) => post(url, param)
