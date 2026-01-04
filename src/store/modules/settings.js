import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import qt from '@/utils/qt'
import request from '@/utils/request'
import { getSystemConfigGlobal } from '@/api/system/sysConfig'
const {
  showSettings,
  tagsView,
  tagsIcon,
  showLanguage,
  showSearch,
  useCache,
  fixedHeader,
  sidebarLogo,
  themeClass,
  slideClass,
  layoutType,
  sysConfig
} = defaultSettings

const state = {
  theme: variables.theme,
  loginNeedCode: qt.storageGet('loginNeedCode') === null ? false : qt.storageGet('loginNeedCode'),
  showSettings: showSettings,
  tagsView: qt.storageGet('tagsView') === null ? tagsView : qt.storageGet('tagsView'),
  tagsIcon: qt.storageGet('tagsIcon') === null ? tagsIcon : qt.storageGet('tagsIcon'),
  showLanguage: qt.storageGet('showLanguage') === null ? showLanguage : qt.storageGet('showLanguage'),
  showSearch: qt.storageGet('showSearch') === null ? showSearch : qt.storageGet('showSearch'),
  useCache: qt.storageGet('useCache') === null ? useCache : qt.storageGet('useCache'),
  fixedHeader: qt.storageGet('fixedHeader') === null ? fixedHeader : qt.storageGet('fixedHeader'),
  sidebarLogo: qt.storageGet('sidebarLogo') === null ? sidebarLogo : qt.storageGet('sidebarLogo'),
  themeClass: qt.storageGet('themeClass') === null ? themeClass : qt.storageGet('themeClass'),
  slideClass: qt.storageGet('slideClass') === null ? slideClass : qt.storageGet('slideClass'),
  layoutType: qt.storageGet('layoutType') === null ? layoutType : qt.storageGet('layoutType'),
  sysConfig: qt.storageGet('sysConfig') === null ? sysConfig : qt.storageGet('sysConfig'),
  systemTitle: '',
  globalConfig: {},
  loadGlobal:false,
  loginConfig: null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      qt.storageSet({
        [key]: value
      })
    }
  },
  SET_SYSTEM_TITLE: (state, systemTitle) => {
    state.systemTitle = systemTitle
  },
  SET_GLOBAL_CONFIG: (state, globalConfig) => {
    state.loadGlobal = true
    state.globalConfig = globalConfig
  },
  SET_LOGIN_CONFIG(state, loginConfig){
    state.loginConfig = loginConfig
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  loadSysLoginConfig({ commit }, data){
    return new Promise((resolve, reject) => {
      if (!state.loginConfig) {
        request.get("/api/system/SysConfig/login").then(res => {
          if (res.data) {
            commit('SET_LOGIN_CONFIG', res.data)
            resolve(res.data)
          }else{
            reject(res.message || '网络异常，请稍后再试！')
          }          
        })
          .catch(error => {
            // reject(error)
            commit('SET_LOGIN_CONFIG', null)
          })
      } else {
        resolve(state.loginConfig)
      }
    })
  },
  async getSystemTitle({ commit,dispatch }, data) {
    return await dispatch('loadSysLoginConfig').then(res => {
          if (res) {
            let { sysName } = res
            if (!sysName) {
              sysName = defaultSettings.title
            }
            commit('SET_SYSTEM_TITLE', sysName)
            Promise.resolve(sysName)
          }else{
            Promise.reject('网络异常，请稍后再试！')
          }
    })
      .catch(error => {
        Promise.reject(error)
      })
    // return new Promise((resolve, reject) => {
    //   if (!state.systemTitle) {
    //     request.get("/api/system/SysConfig/login").then(res => {
    //       if (res.data) {
    //         let { sysName } = res.data
    //         if (!sysName) {
    //           sysName = defaultSettings.title
    //         }
    //         commit('SET_SYSTEM_TITLE', sysName)
    //         resolve(sysName)
    //       }else{
    //         reject(res.message || '网络异常，请稍后再试！')
    //       }          
    //     })
    //       .catch(error => {
    //         // reject(error)
    //         commit('SET_SYSTEM_TITLE', '')
    //       })
    //   } else {
    //     resolve(state.systemTitle)
    //   }
    // })
  },
  async globalConfig({ commit }, data) {
    return await getSystemConfigGlobal().then(res => {
      commit('SET_GLOBAL_CONFIG', res.data)
      Promise.resolve(res.data)
    })
      .catch(error => {
        Promise.reject(error)
      })
  },
  setSlideClass({ commit,state }, data){
    if (!!data) {
      state.slideClass = data
    }else{
      state.slideClass = (qt.storageGet('slideClass') === null ? slideClass : qt.storageGet('slideClass'))
    }
  },
  setTagsView({ commit,state }, data ){
    // console.log('setTagsView',data)
    if (!!data && (data == 1 || data == 0)) {
      state.tagsView = ( data == 1)
    } else{
      state.tagsView = qt.storageGet('tagsView') === null ? tagsView : qt.storageGet('tagsView')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}