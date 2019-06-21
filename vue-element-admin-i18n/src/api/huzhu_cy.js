import request from '@/utils/request'

export function fetchHuzhuCyList(huzhu_id) {
  return request({
    url: '/huzhu/list_huzhu_cy/' + huzhu_id,
    method: 'get'
  })
}

export function fetchSelectOpionsForHuzhuCyAddEdit() {
  return request({
    url: '/huzhu/getSelectOpionsForHuzhuCyAddEdit',
    method: 'get'
  })
}

export function createHuzhuCYBean(huzhu_cy_model) {
  return request({
    url: '/huzhu/addcy',
    method: 'post',
    data: huzhu_cy_model
  })
}

export function updateHuzhuCYBean(huzhu_cy_model) {
  return request({
    url: '/huzhu/updatecy',
    method: 'post',
    data: huzhu_cy_model
  })
}
