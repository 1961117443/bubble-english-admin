import axios from 'axios'
import { message } from '@/utils/message'
import store from '@/store'
import { getToken,setSaasToken,getSaasToken ,removeSaasToken,setTenant,removeToken } from '@/utils/auth'
import define from '@/utils/define'
import context from '@/main'

let errorCount = 0
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: define.timeout, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {    
    console.log('request..errorCount:',errorCount)
    if (config.url.indexOf('http') > -1) config.baseURL = ''
    // 部分接口timeout时间单独处理
    if (config.url.indexOf('SynThirdInfo') > -1 || config.url.indexOf('extend/Email/Receive') > -1 ||
      config.url.indexOf('Permission/Authority/Data') > -1 || config.url.indexOf('DataSync/Actions/Execute') > -1) {
      config.timeout = 100000
    }
    // do something before request is sent
    config.headers['qt-origin'] = 'pc'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (context.$route.meta.modelId) {
      config.headers['qt-model'] = context.$route.meta.modelId
    }
    if (config.method == 'get') {
      config.params = config.data
    }
    const saasToken = getSaasToken()
    if (saasToken) {
      config.headers['x-saas-token'] = saasToken
    }
    let timestamp = Date.parse(new Date()) / 1000
    if (config.url.indexOf('?') > -1) {
      config.url += `&n=${timestamp}`
    } else {
      config.url += `?n=${timestamp}`
    }
    return config
  },
  error => {
    // do something with request error
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log('response',response,response.responseType)
    const res = response.data
    let config = response.config
    let url = config.url
    if (response.headers['x-saas-token']) {
      // {token} | {tenantid} tenantid不一定存在
      let saasTokens = response.headers['x-saas-token'].split('|')
      setSaasToken(saasTokens[0])
      if (saasTokens.length > 1) {
        setTenant(saasTokens[1])
      }
    }
    if (response.status == 200 && response.config && (response.config.responseType=='blob' || response.config.responseType=='arraybuffer')) {
      return response
    }
    // 特殊接口处理
    if (url.indexOf('/Base/DataSource/Actions/Test') > -1 || (url.indexOf('Model') > -1 && url.indexOf('Config') > -1)) return res
    // 租户登录失败
    if (res.code === 610001) {
      errorCount++
      if (errorCount>10)
      {
        // 清空token
        removeToken()
        // 清空x-saas-token
        removeSaasToken()
        // context.$router.push(`/login`)
        window.location.reload()
        return      
      }
      
      // // context.$router.push(`/login?multiTenancy=1`)
      // return Promise.resolve(res)
    }else if (res.code !== 200) {
      message({
        message: res.msg || '请求出错，请重试',
        type: 'error',
        duration: 1500,
        onClose: () => {
          if (url.indexOf('/api/oauth/Login') < 0 && url.indexOf('/api/oauth/LockScreen') < 0 && (res.code === 600 || res.code === 601 || res.code === 602)) {
            // 600：登录过期,请重新登录  601: 您的帐号在其他地方已登录,被强制踢出 602: Token验证失败
            store.dispatch('user/resetToken').then(() => {
              if (window.location.pathname.indexOf('login') > -1) return
              // setTimeout(() => { location.reload() }, 100);
              context.$router.push(`/login`)
            })
          }
          // 单角色模式，未选择角色
          if (res.code === 40301) {
            // return res
            context.$router.push(`/login-role`)
            return
          }

          // 租户登录失败
          if (res.code === 610001) {
            // 清空x-saas-token
            removeSaasToken()
            // context.$router.push(`/login?multiTenancy=1`)
            return Promise.reject(res)
          }
        }
      })    
      if (store.getters.multiTenancy && !store.getters.tenantLoggedIn) {
        // debugger
        context.$router.push(`/login`)
        return
      }
      if (url.indexOf('/api/oauth/Login') > -1) return Promise.reject(res)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      errorCount=0
      return res
    }
  },
  error => {
    // console.log('123123123',error)
    errorCount++
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }else{
      const {response} = error
      const res = response.data
      // 租户登录失败
      if (res.code === 610001  && errorCount>10) {
        // 清空token
        removeToken()
        // 清空x-saas-token
        removeSaasToken()
        // context.$router.push(`/login`)
        window.location.reload()
        return
        // // context.$router.push(`/login?multiTenancy=1`)
        // return Promise.resolve(res)
      }
    }    
    message({
      message: '请求出错，请重试',
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  }
)

export default service