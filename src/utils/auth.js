import qt from '@/utils/qt'

export function getToken() {
  return qt.storageGet('token')
}

export function setToken(token) {
  return qt.storageSet({ token })
}

export function removeToken() {
  return qt.storageRemove('token')
}

export function getLock() {
  return qt.storageGet('lock')
}

export function setLock(lock) {
  return qt.storageSet({ lock })
}
export function removeLock() {
  return qt.storageRemove('lock')
}

/**
 * 获取租户信息
 * @returns 
 */
export function getTenant() {
  return qt.storageGet('tenant')
}

/**
 * 设置租户信息
 * @param {*} tenant 
 * @returns 
 */
export function setTenant(tenant) {
  return qt.storageSet({ tenant })
}

/**
 * 获取租户信息
 * @returns 
 */
export function getSaasToken() {
  return qt.storageGet('saasToken')
}

/**
 * 设置租户信息
 * @param {*} saasToken 
 * @returns 
 */
export function setSaasToken(saasToken) {
  return qt.storageSet({ saasToken })
}


/**
 * 移除租户信息
 * @param {*} saasToken 
 * @returns 
 */
export function removeSaasToken() {
  return qt.storageRemove('saasToken')
}
