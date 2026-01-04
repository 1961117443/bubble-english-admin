import defaultSettings from '@/settings'
import i18n from '@/lang'
import { getLanguage } from '@/lang/index'
import store from '@/store'

const title = defaultSettings.title

export default function getPageTitle(key, fullName) {
  let t =  store.state.settings.systemTitle || title
  const realTitle = getLanguage() === 'en' ? 'QT' : getLanguage() === 'zhtw' ? 'QT軟件開發平臺' : t
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${realTitle}`
  }
  return fullName ? `${fullName} - ${realTitle}` : realTitle
}