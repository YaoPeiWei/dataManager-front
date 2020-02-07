import {fetch} from '../../../http'

export const getLoginUserOrders = (url, param) => fetch(url, param)
export const getLoginUserUnFinishedOrder = (url, param) => fetch(url, param)
