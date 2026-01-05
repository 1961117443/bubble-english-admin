import request from '@/utils/request'

// 权益/售卖配置（后台运营）
export function getEntitlementConfig() {
  return request({
    url: '/api/bubble/Admin/entitlement/config',
    method: 'get'
  })
}

export function saveEntitlementConfig(data) {
  return request({
    url: '/api/bubble/Admin/entitlement/config',
    method: 'post',
    data
  })
}
