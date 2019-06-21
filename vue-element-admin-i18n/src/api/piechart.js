import request from '@/utils/request'

export function fetchPieChartData(query_model) {
  return request({
    url: '/piechart/getDataForPieChart',
    method: 'get',
    params: query_model
  })
}
