// 基础路由
const baseRouter = [
  // 2024.3.31 暂时去掉，没有好的首页，后续再做调整，暂时用门户代替
  // {
  //   path: '/home',
  //   component: (resolve) => require(['@/views/dashboard'], resolve),
  //   name: 'home',
  //   meta: {
  //     title: 'home',
  //     icon: 'icon-qt icon-qt-nav-home',
  //     affix: true,
  //     zhTitle: '首页'
  //   }
  // },
  {
    path: '/dashboard',
    component: (resolve) => require(['@/views/basic/dashboard'], resolve),
    name: 'dashboard',
    meta: {
      title: 'dashboard',
      icon: 'icon-qt icon-qt-generator-kanban',
      affix: true,
      zhTitle: '门户展示'
    }
  },
  {
    path: '/messageRecord',
    component: (resolve) => require(['@/views/basic/messageRecord'], resolve),
    name: 'messageRecord',
    meta: {
      title: 'messageRecord',
      affix: false,
      zhTitle: '消息中心',
      icon: 'icon-qt icon-qt-sysNotice',
    }
  },
  {
    path: '/previewModel',
    component: (resolve) => require(['@/views/basic/dynamicModel'], resolve),
    name: 'previewModel',
    meta: {
      title: 'previewModel',
      affix: false,
      zhTitle: '功能预览',
      icon: 'icon-qt icon-qt-btn-preview',
    }
  },
  {
    path: '/profile',
    component: (resolve) => require(['@/views/basic/profile'], resolve),
    name: 'profile',
    meta: {
      title: 'profile',
      affix: false,
      zhTitle: '个人信息',
      icon: 'icon-qt icon-qt-user',
    }
  },
  {
    path: '/emailDetail',
    component: (resolve) => require(['@/views/example/email/DetailPage'], resolve),
    name: 'emailDetail',
    meta: {
      title: 'emailDetail',
      affix: false,
      zhTitle: '查看邮件',
      icon: 'icon-qt icon-qt-emailExample',
    }
  },
  {
    path: '/workFlowDetail',
    component: (resolve) => require(['@/views/workFlow/workFlowDetail'], resolve),
    name: 'workFlowDetail',
    meta: {
      title: 'workFlowDetail',
      affix: false,
      zhTitle: '流程详情',
      icon: 'icon-qt icon-qt-workFlow',
    }
  }
]
export default baseRouter