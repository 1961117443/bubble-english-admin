import request from '@/utils/request'

// AI 分析任务
export function listJobs(data) {
  return request({
    url: '/api/bubble/Admin/aiJob',
    method: 'get',
    data
  })
}

export function getJob(id) {
  return request({
    url: `/api/bubble/Admin/aiJob/${id}`,
    method: 'get'
  })
}

export function retryJob(id) {
  return request({
    url: `/api/bubble/Admin/aiJob/${id}/actions/retry`,
    method: 'post'
  })
}
