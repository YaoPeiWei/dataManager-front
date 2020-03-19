import {post, fetch} from '../../../http'
export const getCommunity = (url, param) => post(url, param)
export const setCommunity = (url, param) => post(url, param)
export const ListCommunity = (url, param) => post(url, param)
export const getRegionByCommunityId = (url, param) => fetch(url, param)
export const DeleteCommunity = (url, param) => fetch(url, param)
