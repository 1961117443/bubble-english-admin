import Vue from 'vue'

const qt = require('./utils/qt').default

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import 'wow.js/css/libs/animate.css'
import 'animate.css'
import Element from 'element-ui'
import './styles/element-variables.scss'
import './assets/scss/common.scss'

import '@/styles/index.scss' // global css
import './assets/scss/theme.scss' // 主题

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './permission' // permission control
import './utils/error-log' // error log
import { message } from './utils/message';

import * as filters from './filters' // global filters

// 自定义按钮权限指令
import permission from "@/directive/permission";
Vue.use(permission)

// 引入百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: '3c89500fb8187121042f7150d51b512b'
})

// 全局修改element默认配置
// el-form 表单
// clearable 可清除 默认显示小叉号
Element.Form.props.labelSuffix = {type: String, default: ':'}
Element.InputNumber.props.controls = {type: Boolean, default: false}
// Element.Input.props.clearable = {type: Boolean, default: true}
// Element.Select.props.clearable = {type: Boolean, default: true}
// Element.Cascader.props.clearable = {type: Boolean, default: true}
// // placeholder 默认空
// Element.Select.props.placeholder = {type: String, default: ''}
// Element.Cascader.props.placeholder = {type: String, default: ''}
// // el-table 表格
// min-width 默认最小列宽 120px
Element.TableColumn.props.minWidth = {type: String, default: '120'}
// show-overflow-tooltip 默认 true
Element.TableColumn.props.showOverflowTooltip = {type: Boolean, default: true}
// 解决弹窗导致的页面抖动问题
Element.Dialog.props.lockScroll.default = false;


Vue.use(Element, {
  size: qt.storageGet('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 批量引入组件
import components from './components'
Vue.use(components)

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import { hiPrintPlugin } from './utils/hiprint'
Vue.use(hiPrintPlugin)

// 添加实例属性
Object.assign(Vue.prototype, {
  define: require('./utils/define'), // 常量
  qt, // 公共方法
  formValidate: require('./utils/formValidate').default, // 表单验证
  $message: message,
  $request: require('./utils/request').default
})

// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default vm