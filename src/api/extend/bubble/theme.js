import request from '@/utils/request'

// 主题（world / theme）
export function listThemes(data) {
  return request({
    url: '/api/bubble/Admin/theme',
    method: 'get',
    data
  })
}

export function createTheme(data) {
  return request({
    url: '/api/bubble/Admin/theme',
    method: 'post',
    data
  })
}

export function updateTheme(id, data) {
  return request({
    url: `/api/bubble/Admin/theme/${id}`,
    method: 'put',
    data
  })
}

export function deleteTheme(id) {
  return request({
    url: `/api/bubble/Admin/theme/${id}`,
    method: 'delete'
  })
}
