import { constantRoutes } from '@/router'
/* Layout */
import Layout from '@/layout'
import baseRouters from '@/router/modules/base'
import plain from '@/layout/plain/index.vue'
import blend from '@/layout/blend/index.vue'
import functional from '@/layout/functional/index.vue'
import classic from '@/layout/classic/index.vue'

const state = {
  routes: [],
  addRoutes: [],
  layoutRoutes:[]
}

const layoutData = {
  plain,blend,functional,classic
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_LAYOUT_ROUTES: (state, routes) => {
    // console.log('SET_LAYOUT_ROUTES',routes)
    const layoutList = []
    if (routes.length>0) {
      for (let index = 0; index < routes.length; index++) {
        const ele = routes[index];
        if (ele.meta && ele.meta.layoutType) {
          let path = '/'+ele.meta.layoutType
          let route = layoutList.find(x=> x.path == path)
          if (!route) {
            route = {
              path: path,
              component: layoutData[ele.meta.layoutType],
              children:[]
            }
            layoutList.push(route)
          }
          route.children.push(ele)
        }
      }
    }
    state.layoutRoutes = layoutList
  }
}

const actions = {
  generateRoutes({ commit }, route) {
    return new Promise(resolve => {
      // console.log(...exts)
      let accessedRoutes
      let dtRoutes = {
        path: '/',
        component: Layout,
        // redirect: '/home',
        redirect: '/dashboard',
        children: [
          ...baseRouters,
          ...route,
          {
            path: '/404',
            component: (resolve) => require(['@/views/error-page/404'], resolve),
            hidden: true
          },
        ]
      };
      accessedRoutes = [
        dtRoutes,
        ...state.layoutRoutes,
        {
          path: '*',
          redirect: '/404',
          hidden: true
        }
      ]
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true, //需要加上所属的模块名
  state,
  mutations,
  actions
}