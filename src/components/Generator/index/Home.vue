
<template>
  <div class="container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex" class="components-part">
            <div class="components-title">{{ item.title }}</div>
            <draggable class="components-draggable" :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent" draggable=".components-item" filter=".disabled" :sort="false"
              @end="onEnd">
              <div v-for="(element, index) in item.list" :key="index" class="components-item"
                :class="{'disabled':element.__config__.dragDisabled}"
                @click="addComponent(element)">
                <div class="components-body">
                  <i :class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board">
      <div class="action-bar">
        <div class="action-bar-right">
          <el-button class="delete-btn unActive-btn" icon="icon-qt el-icon-c-scale-to-original" type="text"
            @click="defaultLayout" size="medium">PC端默认布局</el-button>
          <el-button icon="icon-qt icon-qt-pc" :class="{'unActive-btn':showType!='pc'}" type="text"
            @click="showType='pc'" size="medium">桌面端</el-button>
          <el-button icon="icon-qt icon-qt-mobile" :class="{'unActive-btn':showType!='app'}"
            type="text" @click="showType='app'" size="medium">移动端</el-button>
          <el-button class="unActive-btn" icon="el-icon-video-play" type="text" @click="preview"
            size="medium">预览</el-button>
          <el-button icon="el-icon-view" type="text" @click="showJson" size="medium">
            查看json</el-button>
          <el-button class="delete-btn unActive-btn" icon="icon-qt icon-qt-clean" type="text"
            @click="empty" size="medium">清空</el-button>
        </div>
      </div>
      <el-scrollbar class="center-scrollbar" v-show="showType==='pc'">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form :size="formConf.size" :label-position="formConf.labelPosition"
            :disabled="formConf.disabled" :label-width="formConf.labelWidth + 'px'">
            <draggable class="drawing-board" :list="drawingList" :animation="340"
              group="componentsGroup" @end='onCenterEnd'>
              <draggable-item v-for="(element, index) in drawingList" :key="element.renderKey"
                :drawing-list="drawingList" :element="element" :index="index" :active-id="activeId"
                :form-conf="formConf" @activeItem="activeFormItem" @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete" :put="shouldClone" :end='onTableEnd' />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              <img src="@/assets/images/emptyElement.png" alt="" class="empty-img">
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
      <div id="ipad" v-show="showType==='app'">
        <div class="outeripad">
          <div class="ipadbody">
            <el-scrollbar class="center-scrollbar">
              <el-row class="center-board-row" :gutter="formConf.gutter">
                <el-form :size="formConf.size" :label-position="formConf.labelPosition"
                  :disabled="formConf.disabled" :label-width="formConf.labelWidth + 'px'">
                  <draggable class="drawing-board" :list="drawingList" :animation="340"
                    group="componentsGroup" @end='onCenterEnd'>
                    <draggable-item-app v-for="(element, index) in drawingList"
                      :key="element.renderKey" :drawing-list="drawingList" :element="element"
                      :index="index" :active-id="activeId" :form-conf="formConf"
                      @activeItem="activeFormItem" @copyItem="drawingItemCopy"
                      @deleteItem="drawingItemDelete" :put="shouldClone" :end='onTableEnd' />
                  </draggable>
                  <div v-show="!drawingList.length" class="empty-info app-empty-info">
                    <img src="@/assets/images/emptyElement.png" alt="" class="empty-img">
                  </div>
                </el-form>
              </el-row>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <right-panel :active-data="activeData" :form-conf="formConf" :show-field="!!drawingList.length"
      @tag-change="tagChange" :modelType="modelType" :webType="webType"
      @relationChange="relationChange" :drawingList="drawingList"
      @comChange="handleComChange" />
    <json-drawer size="550px" :visible.sync="jsonDrawerVisible" :jsonData="formData"
      @refresh="refreshJson" />
    <Preview :visible.sync="previewVisible" :form-data="formData" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import render from '@/components/Generator/render/render'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'
import Preview from '../preview'
import {
  inputComponents, selectComponents, systemComponents, layoutComponents, formConf
} from '@/components/Generator/generator/config'
import { noVModelList, noTableAllowList, webPeculiarList, onlinePeculiarList } from '@/components/Generator/generator/comConfig'
import {
  exportDefault, beautifierConf, isNumberStr, titleCase, deepClone
} from '@/components/Generator/utils'
import drawingDefalut from '@/components/Generator/generator/drawingDefalut'
import DraggableItem from './DraggableItem'
import DraggableItemApp from './DraggableItemApp'
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/components/Generator/utils/db'

const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData
const idGlobal = getIdGlobal()

export default {
  components: {
    draggable,
    render,
    JsonDrawer,
    RightPanel,
    DraggableItem,
    DraggableItemApp,
    Preview
  },
  provide() {
    return {
      leftComponents:this.leftComponents
    }
  },
  props: ['conf', 'modelType', 'webType', 'dbType'],
  data() {
    return {
      idGlobal: 100,
      formConf: deepClone(formConf),
      inputComponents,
      selectComponents,
      systemComponents,
      layoutComponents,
      labelWidth: 100,
      drawingList: [],
      drawingData: {},
      activeId: null,
      drawerVisible: false,
      previewVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: {},
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      isDrawingListChange: true,
      showTip: true,
      activeItem: {},
      activeTableItem: {},
      showType: 'pc',
      leftComponents: [
        {
          title: '基础控件',
          list: inputComponents
        },
        {
          title: '高级控件',
          list: selectComponents
        },
        {
          title: '系统控件',
          list: systemComponents
        },
        {
          title: '布局控件',
          list: layoutComponents
        }
      ]
    }
  },
  computed: {
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      // if (
      //   this.activeData.placeholder === undefined
      //   || !this.activeData.__config__.tag
      //   || oldActiveId !== this.activeId
      // ) {
      //   return
      // }
      // this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val)
        if (val.length === 0) this.idGlobal = 100
        // if (!this.isDrawingListChange) {
        //   this.isDrawingListChange = true
        //   return
        // }
        this.$emit('drawingListChange')
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
        this.formConf.idGlobal = val
        // this.saveIdGlobalDebounce(val)
      },
      immediate: true
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      this.isDrawingListChange = false
      this.drawingList = deepClone(this.conf.fields)
      Object.assign(this.formConf, this.conf)
      this.idGlobal = this.formConf.idGlobal
      if (this.drawingList.length) this.activeFormItem(this.drawingList[0])
    } else {
      this.drawingList = []
      this.idGlobal = 100
    }
    if (this.modelType == 1 || this.modelType == 6) this.leftComponents[1].list = [...this.leftComponents[1].list, ...onlinePeculiarList, ...webPeculiarList]
    if (this.webType != 2 || this.modelType == 3 || this.modelType == 6) this.formConf.popupType = 'fullScreen'
  },
  mounted() {
    // fix: firefox 下 拖拽 会新打卡一个选项卡
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = event => {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    // 供父组件使用 获取表单JSON
    getData() {
      return new Promise((resolve, reject) => {
        if (!this.drawingList.length) {
          reject({ msg: '表单不允许为空', target: 1 })
          return
        }
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            const e = list[i]
            const config = e.__config__
            if (this.$store.getters.hasTable && config.layout === "colFormItem" && !noVModelList.includes(config.qtKey) && !e.__vModel__) {
              reject({ msg: `请选择${config.label}的控件字段`, target: 1 })
              break
            }
            if (config.qtKey === 'billRule') {
              if (!config.rule) {
                reject({ msg: '单据组件“选择模板”属性为必填项', target: 1 })
                break
              }
            }
            if (config.qtKey === 'relationForm') {
              if (!e.modelId) {
                reject({ msg: '关联表单控件“关联功能”属性为必填项', target: 1 })
                break
              }
              if (!e.relationField) {
                reject({ msg: '关联表单控件“显示字段”属性为必填项', target: 1 })
                break
              }
            }
            if (config.qtKey === 'popupSelect') {
              if (!e.interfaceId) {
                reject({ msg: '弹窗选择控件“远端数据”属性为必填项', target: 1 })
                break
              }
              if (!e.propsValue) {
                reject({ msg: '弹窗选择控件“储存字段”属性为必填项', target: 1 })
                break
              }
              if (!e.relationField) {
                reject({ msg: '弹窗选择控件“显示字段”属性为必填项', target: 1 })
                break
              }
            }
            if (config.layout === 'rowFormItem' && !config.children.length) {
              reject({ msg: `您的${config.label}控件中没有组件`, target: 1 })
              break
            }
            if (config && config.children && Array.isArray(config.children)) {
              loop(config.children)
            }
          }
        }
        loop(this.drawingList)
        this.AssembleFormData()
        if (this.formData.hasPrintBtn && !this.formData.printId) {
          reject({ msg: `请选择打印模板`, target: 1 })
        }
        resolve({ formData: this.formData, target: 1 })
      })
    },
    //  阻止表格中嵌套行容器
    shouldClone(to, from, target, event, conf) {
      const targetConf = target._underlying_vm_
      const isRowContainer = conf.__config__.cmpType === 'common' && conf.__config__.rowType === 'layout'
      if (isRowContainer) return true
      if (conf.cmpType === 'custom') return false
      if (conf.__config__.rowType === 'table') {
        if (noTableAllowList.includes(targetConf.__config__.qtKey)) {
          // if (this.showTip) {
          //   this.$message.warning(`子表内暂不支持使用该组件`)
          //   this.showTip = false
          // }
          return false
        }
        if (targetConf.__config__.layout === 'rowFormItem') return false
        if (this.$store.getters.hasTable) {
          if (!conf.__config__.tableName) {
            if (this.showTip) {
              this.$message.warning(`子表请先关联数据表`)
              this.showTip = false
            }
            return false
          }
        }
        this.activeItem = targetConf
        this.activeTableItem = conf
      }
      return true
    },
    activeFormItem(element) {
      this.activeData = element
      this.activeId = element.__config__.formId
    },
    onEnd(obj) {
      this.showTip = true
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
      if (obj.to.className.indexOf('table') > -1) {
        this.$set(this.activeItem.__config__, 'isSubTable', true)
        if (this.$store.getters.hasTable) {
          this.$set(this.activeItem.__config__, 'relationTable', this.activeTableItem.__config__.tableName)
          this.activeItem.__vModel__ = ''
        }
      }
    },
    onCenterEnd(obj) {
      this.showTip = true
      if (obj.from == obj.to) return
      if (obj.to.className.indexOf('table') > -1) {
        this.$set(this.activeItem.__config__, 'isSubTable', true)
        if (this.$store.getters.hasTable) {
          this.$set(this.activeItem.__config__, 'relationTable', this.activeTableItem.__config__.tableName)
          this.activeItem.__vModel__ = ''
        }
      }
    },
    onTableEnd(obj, target, conf) {
      if (obj.from == obj.to) return
      if (obj.to.className.indexOf('table') < 0) {
        this.$set(this.activeItem.__config__, 'isSubTable', false)
        if (this.$store.getters.hasTable) this.activeItem.__vModel__ = ''
      } else {
        this.$set(this.activeItem.__config__, 'isSubTable', true)
        if (this.$store.getters.hasTable) {
          this.$set(this.activeItem.__config__, 'relationTable', this.activeTableItem.__config__.tableName)
          this.activeItem.__vModel__ = ''
        }
      }
    },
    addComponent(item) {
      if (item.__config__.dragDisabled) return
      const clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      const clone = deepClone(origin)
      const config = clone.__config__
      config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone)
      // clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        if (!this.$store.getters.hasTable) {
          // 分割线和按钮不加vModel
          if (noVModelList.indexOf(config.qtKey) < 0) {
            item.__vModel__ = this.toggleVmodelCase(`${config.qtKey}Field${this.idGlobal}`)
          }
        } else {
          if (noVModelList.indexOf(config.qtKey) < 0) {
            item.__vModel__ = ""
          }
        }
      } else if (config.layout === 'rowFormItem') {
        if (config.qtKey === 'table') {
          item.__vModel__ = this.toggleVmodelCase(`${config.qtKey}Field${this.idGlobal}`);
        }
        config.componentName = `row${this.idGlobal}`
        !Array.isArray(config.children) && (config.children = [])
        // delete config.label // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem))
      }
      return item
    },
    toggleVmodelCase(str) {
      const dbType = this.dbType || ''
      if (dbType.toLowerCase() === 'Oracle'.toLowerCase() || dbType.toLowerCase() === 'DM8'.toLowerCase()) {
        return str.toUpperCase()
      }
      if (dbType.toLowerCase() === 'PostgreSQL'.toLowerCase() || dbType.toLowerCase() === 'KingBaseES'.toLowerCase()) {
        return str.toLowerCase()
      }
      return str
    },
    AssembleFormData() {
      this.formData = {
        ...this.formConf,
        fields: deepClone(this.drawingList),
      }
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
        this.drawingList = []
        this.idGlobal = 100
      }).catch(() => { })
    },
    drawingItemCopy(item, parent) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      parent.push(clone)
      this.activeFormItem(clone)
    },
    drawingItemDelete(index, parent) {
      parent.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    preview() {
      this.AssembleFormData()
      this.previewVisible = true
    },
    showJson() {
      this.AssembleFormData()
      this.jsonDrawerVisible = true
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
        })
      }
    },
    refreshJson(data) {
      if (typeof(data) == "string") {
        data = JSON.parse(data)
      }
      // console.log('refreshJson:', data)
      this.drawingList = deepClone(data.fields)
      delete data.fields
      this.formConf = data
    },
    relationChange(vmodel) {
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const config = list[i].__config__
          if (list[i].relationField && list[i].relationField === list[i].__vModel__) {
            list[i].showField = ''
          }
          if (config && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(this.drawingList)
    },
    defaultLayout(){      
      //需要忽略的字段
      const ignoreList = ['id','creatorTime','creatorUserId','lastModifyTime','lastModifyUserId','deleteMark','deleteTime','deleteUserId']

      const load = ()=>{
        // let allTable = this.$store.state.generator.allTable
        // let item = allTable.filter(o => o.typeId == '1')[0]
        // if (!item || !item.table) return ''
        // return item.table
        // console.log(this.$store.state.generator.allTable)
        // 最终是要生成字段到 drawingList 中，可以通过调用 this.addComponent(element) 来生成，element的元素是在 this.item 里面获取
        
        const hasSub = this.$store.state.generator.allTable.length > 1
        //主表
        const mainTable = this.$store.state.generator.allTable.find(x=>x.typeId == "1")
        if (mainTable) {
            mainTable.fields.forEach(f=>{
              if(ignoreList.indexOf(f.field) > -1){
                return
              }
              // console.log(f.field)
              const ele = this.getDefaultElement(f)
              if (ele) {
                this.addComponent(ele)
                this.activeData.__vModel__ = f.field
                this.activeData.__config__.label  = f.fieldName
                this.activeData.__config__.tableName  = mainTable.table
                this.activeData.__config__.span  = hasSub ? 8 : 12
              }
            })
        }

        //添加子表
        const comTable = this.selectComponents.find(x=>x.__config__.qtKey == "table")
        const childTable = []
        this.$store.state.generator.allTable
        .filter(x=>x.typeId!="1")
        .forEach(t=>{
          //创建表格控件
          const subTable = deepClone(comTable)
          this.drawingList.push(subTable)
          subTable.__config__.showTitle = false
          subTable.__config__.tableName = t.table
          subTable.__config__.span = 24
          subTable.__vModel__ =  t.table
          //创建字段集合
          t.fields.forEach(f=>{
            if(ignoreList.indexOf(f.field) > -1){
              return
            }
            // console.log(f.field)
            const ele = this.getDefaultElement(f)
            if (ele) {
              if (ele.__config__.dragDisabled) return
              const clone = this.cloneComponent(ele)

              clone.__vModel__ = f.field
              clone.__config__.label  = f.fieldName
              clone.__config__.tableName  =  mainTable.table
              clone.__config__.isSubTable= true
              clone.__config__.relationTable=t.table


              subTable.__config__.children.push(clone)
            }
          })
        })
      }

      if (this.drawingList.length > 0) {
        this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
          this.drawingList = []
          this.idGlobal = 100
          load()
        }).catch(() => { })
      }else{
        load()
      }
    },
    getDefaultElement(field){
      return this.inputComponents.find(x=>x.__config__.qtKey == "comInput")
    },
    // 切换控件类型
    handleComChange(o,n){
      console.log('handleComChange',o,n)
      // debugger
      // 先找出原来的控件的位置
      if (o) {
        let  drawingList  =  this.drawingList
        //如果是字表字段
        if (o.__config__.isSubTable) {
          console.log(o.__config__.relationTable)
           const t = this.drawingList.find(x=> x.__config__.qtKey == "table" && x.__config__.tableName == o.__config__.relationTable)
           console.log(t)
           if (t) {
            drawingList =  t.__config__.children
           }
           
        }

        

        const index = drawingList.findIndex(x=> x.__config__.formId == o.__config__.formId)
        // console.log('index',index)
        if (index > -1) {
          drawingList.splice(index,1)

          // 添加新的控件
          if (n) {
            const clone = this.cloneComponent(n)
            console.log('clone',clone)
            // clone.__vModel__ = o.__vModel__
            // // 把原来组件的属性复制到新组件
            // clone.__vModel__ = o.__vModel__
            // clone.__config__.formId  = o.__config__.formId
            // clone.__config__.label  = o.__config__.label
            // clone.__config__.span  = o.__config__.span

            // if (o.__config__.isSubTable) {
            //   clone.__config__.isSubTable = true
            //   clone.__config__.relationTable = o.__config__.relationTable
            // }

            this.copyComponent(clone,o)

            drawingList.splice(index, 0,clone);
            this.activeFormItem(clone)
          }
        }else{
          const result = this.findComponent(drawingList,o)
          console.log(result)
          if (result && n) {
            const {index,list} = result
            if (index && list) {
              const clone = this.cloneComponent(n)
              console.log('clone',clone)
              this.copyComponent(clone,o)
 
              list.splice(index, 1);
              list.splice(index, 0,clone);
              this.activeFormItem(clone)
            }
          }
        }
      }
    },
    copyComponent(clone,o){
      clone.__vModel__ = o.__vModel__
      // 把原来组件的属性复制到新组件
      clone.__vModel__ = o.__vModel__
      clone.__config__.formId  = o.__config__.formId
      clone.__config__.label  = o.__config__.label
      clone.__config__.span  = o.__config__.span

      if (o.__config__.isSubTable) {
        clone.__config__.isSubTable = true
        clone.__config__.relationTable = o.__config__.relationTable
      }
    },
    findComponent(items,o){
      for (let i = 0; i < items.length; i++) {
        const {__config__} = items[i]
        if (__config__) {
          // 如果有子集，遍历子集
          if (__config__.children && __config__.children.length > 0) {
            return this.findComponent(__config__.children,o)
          }
          if (__config__.formId == o.__config__.formId) {
            return {
              component:items[i],
              index:i,
              list:items
            }
          }
        }
      }
    }
  }
}
</script>
<style lang='scss'>
@import "../styles/index";
@import "../styles/home";
</style>
