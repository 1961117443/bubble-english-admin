import QTTreeSelect from '@/components/QT-treeSelect'
import topOperation from '@/components/QT-topOperation/index'
import tableOperation from '@/components/QT-tableOperation'
import Pagination from '@/components/Pagination'
import QTTable from '@/components/QT-table'
import qtFormTipItem from '@/components/QT-form-tip-item'
import UserBox from '@/components/QT-userBox'
import Screenfull from '@/components/Screenfull'
import ColumnSettings from '@/components/ColumnSettings'
import QTQuill from '@/components/QTEditor/quill'
import UserSelect from '@/components/QT-userSelect'
import uploadBtn from '@/components/QT-uploadBtn'
// 代码生成器专供
import QTText from '@/components/Generator/components/QTText'
import QTBarcode from '@/components/Generator/components/QTBarcode'
import QTQrcode from '@/components/Generator/components/QTQrcode'
import QTButton from '@/components/Generator/components/QTButton'
import QTUploadFz from '@/components/Generator/components/Upload/UploadFz'
import QTUploadImg from '@/components/Generator/components/Upload/UploadImg'
import PopupSelect from '@/components/Generator/components/PopupSelect'
import PopupAttr from '@/components/Generator/components/PopupAttr'
import NumRange from '@/components/Generator/components/NumRange'
import ComSelect from '@/components/Generator/components/ComSelect'
import DepSelect from '@/components/Generator/components/DepSelect'
import PosSelect from '@/components/Generator/components/PosSelect'
import DicSelect from '@/components/Generator/components/DicSelect'
import BillRule from '@/components/Generator/components/BillRule'
import QTInputTable from '@/components/Generator/components/InputTable'
import QTAddress from '@/components/Generator/components/Address'
import GroupTitle from '@/components/Generator/components/GroupTitle'
import RelationForm from '@/components/Generator/components/RelationForm'
import RelationFormAttr from '@/components/Generator/components/RelationFormAttr'
import Calculate from '@/components/Generator/components/Calculate'
import QTSelect from '@/components/QT-select'
import QTSelect2 from '@/components/QT-select/select.jsx'
import QTImportForm from '@/components/QT-ImportForm/ImportForm.vue'
import QTExportForm from '@/components/QT-ExportForm/ExportBox.vue'
import ElSpace from '@/components/Space'
import PrintBtn from '@/components/PrintBrowse/PrintBtn'
import ImgColumn from '@/components/QT-table/ImgColumn.vue'
import singleImg from '@/components/Upload/SingleImg'
import QTLabel from '@/components/QT-label'
import QTLableUserSelect from '@/components/QT-label/UserSelect.vue'
export default {
  install(Vue, options) {
    Vue.component('QTTreeSelect', QTTreeSelect)
    Vue.component('topOpts', topOperation)
    Vue.component('tableOpts', tableOperation)
    Vue.component('Pagination', Pagination)
    Vue.component('QTTable', QTTable)
    Vue.component('qtFormTipItem', qtFormTipItem)
    Vue.component('uploadBtn', uploadBtn)
    Vue.component('UserBox', UserBox)
    Vue.component('QTText', QTText)
    Vue.component('QTBarcode', QTBarcode)
    Vue.component('QTQrcode', QTQrcode)
    Vue.component('QTButton', QTButton)
    Vue.component('QTUploadFz', QTUploadFz)
    Vue.component('QTUploadImg', QTUploadImg)
    Vue.component('PopupSelect', PopupSelect)
    Vue.component('PopupAttr', PopupAttr)
    Vue.component('NumRange', NumRange)
    Vue.component('ComSelect', ComSelect)
    Vue.component('DepSelect', DepSelect)
    Vue.component('PosSelect', PosSelect)
    Vue.component('UserSelect', UserSelect)
    Vue.component('DicSelect', DicSelect)
    Vue.component('BillRule', BillRule)
    Vue.component('QTInputTable', QTInputTable)
    Vue.component('QTAddress', QTAddress)
    Vue.component('GroupTitle', GroupTitle)
    Vue.component('RelationForm', RelationForm)
    Vue.component('RelationFormAttr', RelationFormAttr)
    Vue.component('Calculate', Calculate)
    Vue.component('QTQuill', QTQuill)
    Vue.component('Screenfull', Screenfull)
    Vue.component('ColumnSettings', ColumnSettings)
    Vue.component('qt-select', QTSelect)
    Vue.component('qt-select2', QTSelect2)
    Vue.component('qt-import-form', QTImportForm)
    Vue.component('qt-export-form', QTExportForm)
    Vue.component('el-space', ElSpace)
    Vue.component('QtPrintBtn', PrintBtn)
    Vue.component('QtImageColumn', ImgColumn)
    Vue.component('single-img', singleImg)
    Vue.component('qt-label', QTLabel)
    Vue.component('QtLableUserSelect', QTLableUserSelect)
  }
}