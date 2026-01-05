import request from '@/utils/request'

// 视频库
export function listVideos(data) {
  return request({
    url: '/api/bubble/Admin/video/list',
    method: 'get',
    data
  })
}

export function getVideo(id) {
  return request({
    url: `/api/bubble/Admin/video/${id}`,
    method: 'get'
  })
}

export function createVideo(data) {
  return request({
    url: '/api/bubble/Admin/video',
    method: 'post',
    data
  })
}

export function updateVideo(id, data) {
  return request({
    url: `/api/bubble/Admin/video/${id}`,
    method: 'put',
    data
  })
}

export function deleteVideo(id) {
  return request({
    url: `/api/bubble/Admin/video/${id}`,
    method: 'delete'
  })
}

// 发起AI分析
export function analyzeVideo(id) {
  return request({
    url: `/api/bubble/Admin/video/${id}/actions/analyze`,
    method: 'post'
  })
}
