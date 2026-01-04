
import { getSaasToken} from '@/utils/auth'
const getters = {
  token: state => state.user.token,
  theme: state => state.user.theme,
  isLock: state => state.user.isLock,
  menuList: state => state.user.menuList,
  userInfo: state => state.user.userInfo,
  permissionList: state => state.user.permissionList,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  dictionaryList: state => state.base.dictionaryList,
  userList: state => state.base.userList,
  positionList: state => state.base.positionList,
  roleList: state => state.base.roleList,
  socket: state => state.user.socket,
  hasTable: state => state.generator.hasTable,
  leftMenuList: state => state.user.leftMenuList,
  sysConfig: state => state.settings.sysConfig,
  isJt: state=> {
    const { companys,companyId} = state.user.userInfo
    if (!!companys && !!companyId ) {
      const org = companys.find(a=>a.id == companyId)
      if (org) {
        return org.isJt
      }
    }
    return false
  },
  tenantId : state => state.user.tenantId,
  multiTenancy: state => {
    if (state.settings.globalConfig && state.settings.globalConfig.multiTenancy) {
      return state.settings.globalConfig.multiTenancy
    }
    return false
  },
  tenantLoggedIn : state => !!getSaasToken()
}
export default getters