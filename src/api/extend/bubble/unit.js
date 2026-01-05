import request from '@/utils/request'

// 内容单元（units）
export function listUnits(data) {
  return request({
    url: '/api/bubble/Admin/unit',
    method: 'get',
    data
  })
}

export function getUnit(id) {
  return request({
    url: `/api/bubble/Admin/unit/${id}`,
    method: 'get'
  })
}

export function createUnit(data) {
  return request({
    url: '/api/bubble/Admin/unit',
    method: 'post',
    data
  })
}

export function updateUnit(id, data) {
  return request({
    url: `/api/bubble/Admin/unit/${id}`,
    method: 'put',
    data
  })
}

export function deleteUnit(id) {
  return request({
    url: `/api/bubble/Admin/unit/${id}`,
    method: 'delete'
  })
}
