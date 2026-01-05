import request from '@/utils/request'

// 课程（course v2）
export function listCourses(data) {
  return request({
    url: '/api/bubble/Admin/course',
    method: 'get',
    data
  })
}

export function getCourse(id) {
  return request({
    url: `/api/bubble/Admin/course/${id}`,
    method: 'get'
  })
}

export function createCourse(data) {
  return request({
    url: '/api/bubble/Admin/course',
    method: 'post',
    data
  })
}

export function updateCourse(id, data) {
  return request({
    url: `/api/bubble/Admin/course/${id}`,
    method: 'put',
    data
  })
}

export function deleteCourse(id) {
  return request({
    url: `/api/bubble/Admin/course/${id}`,
    method: 'delete'
  })
}

export function publishCourse(id) {
  return request({
    url: `/api/bubble/Admin/course/${id}/actions/publish`,
    method: 'post'
  })
}

export function unpublishCourse(id) {
  return request({
    url: `/api/bubble/Admin/course/${id}/actions/unpublish`,
    method: 'post'
  })
}
