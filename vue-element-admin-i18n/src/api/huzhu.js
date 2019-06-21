import request from '@/utils/request'

export function fetchDepartmentList() {
  return request({
    url: '/huzhu/departmentList',
    method: 'get'
  })
}

export function fetchGridList(department_id) {
  return request({
    url: '/huzhu/gridList',
    method: 'post',
    params: { department_id }
  })
}

export function fetchLoginList(grid_id) {
  return request({
    url: '/huzhu/loginList',
    method: 'post',
    params: { grid_id }
  })
}

export function fetchVillageList(login_id) {
  return request({
    url: '/huzhu/villageList',
    method: 'post',
    params: { login_id }
  })
}

export function fetchCountryList(village_id) {
  return request({
    url: '/huzhu/countryList',
    method: 'post',
    params: { village_id }
  })
}

export function fetchBrandList() {
  return request({
    url: '/huzhu/brandList',
    method: 'get'
  })
}

export function createHuzhuBean(huzhuBean) {
  return request({
    url: '/huzhu/add',
    method: 'post',
    data: huzhuBean
  })
}

export function updateHuzhuBean(huzhuBean) {
  return request({
    url: '/huzhu/update',
    method: 'post',
    data: huzhuBean
  })
}

export function getListHuzhu(listHuzhuQuery) {
  return request({
    url: '/huzhu/getListHuzhu',
    method: 'get',
    params: listHuzhuQuery
  })
}

export function getListHuzhuByQuery(listHuzhuQuery) {
  return request({
    url: '/huzhu/getListHuzhuByQuery',
    method: 'get',
    params: listHuzhuQuery
  })
}

export function getSelectOpionsForUpdate(huzhu_model) {
  return request({
    url: '/huzhu/getSelectOpionsForUpdate',
    method: 'get',
    params: { 'department_id': huzhu_model.department_select_data,
      'grid_id': huzhu_model.grid_select_data,
      'login_id': huzhu_model.login_select_data,
      'village_id': huzhu_model.village_select_data }
  })
}
