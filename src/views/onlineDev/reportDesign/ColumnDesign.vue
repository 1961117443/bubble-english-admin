<template>
  <div class="columnDesign-container">
    <div class="main-board">
      <div class="search-box" v-if="false">
        <h4 class="cap">查询字段</h4>
        <el-table :data="columnData.searchList" class="QT-common-table" ref="dragTableSearch"
          :row-key="row=>row.__vModel__">
          <el-table-column align="center" label="拖动" width="50">
            <template>
              <i class="drag-handler icon-qt icon-qt-darg" style="cursor: move;font-size:20px"
                title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="__config__.label" label="列名" />
          <el-table-column prop="__vModel__" label="字段" />
          <el-table-column prop="searchType" label="类型">
            <template slot-scope="scope">
              {{scope.row.searchType===3?'范围查询':scope.row.searchType===2?'模糊查询':'等于查询'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-divider></el-divider> -->
      <div class="column-box">
        <h4 class="cap">列表字段</h4>
        <el-table :data="columnData.columnList" class="QT-common-table" ref="dragTable"
          :row-key="row=>row.prop">
          <el-table-column align="center" label="拖动" width="50">
            <template>
              <i class="drag-handler icon-qt icon-qt-darg" style="cursor: move;font-size:20px"
                title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.label" />
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="字段" />
          <el-table-column prop="sortable" label="排序" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.sortable" />
            </template>
          </el-table-column>
          <el-table-column prop="hidden" label="隐藏" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.hidden" />
            </template>
          </el-table-column>
          <el-table-column prop="query" label="查询" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.query" />
            </template>
          </el-table-column>
          <el-table-column prop="summary" label="合计" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.summary" />
            </template>
          </el-table-column>
          <el-table-column prop="editable" label="可编辑" width="80" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.editable" />
              <el-button v-if="scope.row.editable" style="padding:0px 5px;" type="text" size="medium" icon="el-icon-setting" @click="editableFormHandle(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="qtKey" label="查询控件">
            <template slot-scope="scope">
              <el-select v-if="scope.row.query" v-model="scope.row.__config__.qtKey" placeholder="请选择控件类型">
                <el-option-group
                  v-for="(group,index) in leftComponents"
                  :key="index"
                  :label="group.title">
                  <el-option
                    v-for="item in group.list"
                    :key="item.__config__.qtKey"
                    :label="item.__config__.label"
                    :value="item.__config__.qtKey"
                    :disabled="item.__config__.dragDisabled">
                  </el-option>
                </el-option-group>
              </el-select>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="searchType" label="查询类型">
            <template slot-scope="scope">
              <span v-if="scope.row.query">{{scope.row.searchType===3?'范围查询':scope.row.searchType===2?'模糊查询':'等于查询'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="conditionalType" label="查询类型">
            <template slot-scope="scope">
              <el-select v-if="scope.row.query" v-model="scope.row.conditionalType" placeholder="请选择控件类型">
                <el-option
                    v-for="item in conditionalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="dataOptions" label="数据选项" width="100">
            <template slot-scope="scope">
              <el-button @click="dataTypeHandle(scope.row)">配置</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="defaultValue" label="默认值" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.defaultValue" placeholder="默认值" />
            </template>
          </el-table-column>
          <el-table-column prop="align" label="对齐">
            <template slot-scope="scope">
              <el-select v-model="scope.row.align" placeholder="请选择">
                <el-option v-for="item in alignOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.width" placeholder="宽度" :min="0" :precision="0"
                controls-position="right" style="width:100%" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-board" v-if="false">
      <el-tabs v-model="currentTab" class="top-tabs">
        <el-tab-pane label="查询字段" name="search" />
        <el-tab-pane label="列表字段" name="field" />
        <el-tab-pane label="列表属性" name="column" />
      </el-tabs>
      <div class="field-box">
        <div class="searchList" v-show="currentTab==='search'">
          <el-table :data="searchOptions" class="QT-common-table" height="100%"
            @selection-change="searchSelectionChange" ref="searchTable">
            <el-table-column prop="__config__.label" label="查询字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <div class="columnList" v-show="currentTab==='field'">
          <el-table :data="columnOptions" class="QT-common-table" height="100%"
            @selection-change="columnSelectionChange" ref="columnTable">
            <el-table-column prop="label" label="列表字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <el-scrollbar class="right-scrollbar" v-show="currentTab==='column'">
          <div class="setting-box">
            <el-form :model="columnData" label-width="100px">
              <!-- <el-divider>列表布局</el-divider> -->
              <div class="typeList">
                <div class="item" v-for="(item, index) in typeList" :key="index"
                  @click="columnData.type=item.value">
                  <div class="item-img" :class="{'checked':columnData.type==item.value}">
                    <img :src="item.url" alt="">
                    <div class="icon-checked" v-if="columnData.type==item.value">
                      <i class="el-icon-check"></i>
                    </div>
                  </div>
                  <p class="item-name">{{item.name}}</p>
                </div>
              </div>
              <template v-if="columnData.type==2">
                <el-divider>左侧设置</el-divider>
                <el-form-item label="左侧标题">
                  <el-input v-model="columnData.treeTitle" placeholder="树形标题"></el-input>
                </el-form-item>
                <el-form-item label="数据来源">
                  <el-select v-model="columnData.treeDataSource" placeholder="请选择数据来源"
                    @change="dataTypeChange">
                    <el-option label="数据字典" value="dictionary"></el-option>
                    <el-option label="远端数据" value="api"></el-option>
                    <el-option label="组织数据" value="organize"></el-option>
                    <el-option label="部门数据" value="department"></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="columnData.treeDataSource==='dictionary'">
                  <el-form-item label="数据字典">
                    <DicSelect v-model="columnData.treeDictionary" placeholder="请选择数据字典" />
                  </el-form-item>
                  <el-form-item label="主键字段">
                    <el-select v-model="columnData.treePropsValue" placeholder="请选择主键字段">
                      <el-option label="id" value="id"></el-option>
                      <el-option label="enCode" value="enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="columnData.treeDataSource==='api'">
                  <el-form-item label="数据接口">
                    <QT-TreeSelect :options="dataInterfaceSelector"
                      v-model="columnData.treePropsUrl" placeholder="请选择数据接口" lastLevel
                      lastLevelKey='categoryId' lastLevelValue='1' clearable />
                  </el-form-item>
                  <el-form-item label="主键字段">
                    <el-input v-model="columnData.treePropsValue" placeholder="主键字段" />
                  </el-form-item>
                  <el-form-item label="显示字段">
                    <el-input v-model="columnData.treePropsLabel" placeholder="显示字段" />
                  </el-form-item>
                  <el-form-item label="子级字段">
                    <el-input v-model="columnData.treePropsChildren" placeholder="子级字段" />
                  </el-form-item>
                </template>
                <el-form-item label="关联字段">
                  <el-select v-model="columnData.treeRelation" placeholder="请选择关联字段">
                    <el-option :label="item.__config__.label" :value="item.__vModel__"
                      v-for="(item, index) in list" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="columnData.type==3">
                <el-divider>分组设置</el-divider>
                <el-form-item label="分组字段">
                  <el-select v-model="columnData.groupField" placeholder="请选择分组字段">
                    <el-option :label="item.__config__.label" :value="item.__vModel__"
                      v-for="(item, i) in list" :key="i"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-divider>排序设置</el-divider>
              <el-form-item label="排序字段">
                <el-select v-model="columnData.defaultSidx" placeholder="请选择排序字段" clearable>
                  <el-option :label="item.__config__.label" :value="item.__vModel__"
                    v-for="(item, i) in list" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序类型">
                <el-select v-model="columnData.sort" placeholder="请选择排序类型">
                  <el-option label="升序" value="asc"></el-option>
                  <el-option label="降序" value="desc"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="columnData.type !==3">
                <el-divider>分页设置</el-divider>
                <el-form-item label="列表分页">
                  <el-switch v-model="columnData.hasPage"></el-switch>
                </el-form-item>
                <el-form-item label="分页条数">
                  <el-radio-group v-model="columnData.pageSize">
                    <el-radio-button :label="20">20条</el-radio-button>
                    <el-radio-button :label="50">50条</el-radio-button>
                    <el-radio-button :label="100">100条</el-radio-button>
                    <el-radio-button :label="500">500条</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </template>
              <el-divider>按钮配置</el-divider>
              <p class="btn-cap mb-10">系统按钮区</p>
              <el-checkbox-group v-model="btnsList" class="btnsList">
                <el-checkbox :label="item.value" v-for="item in btnsOption" :key="item.value">
                  <span class="btn-label">{{ item.value | btnText }}</span>
                  <el-input v-model="item.label" />
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="columnBtnsList" class="btnsList columnBtnList">
                <el-checkbox :label="item.value" v-for="item in columnBtnsOption" :key="item.value">
                  <span class="btn-label">{{ item.value | btnText }}</span>
                  <el-input v-model="item.label" />
                </el-checkbox>
              </el-checkbox-group>
              <template v-if="modelType==1">
                <p class="btn-cap mt-10 mb-10">自定义按钮区</p>
                <div class="custom-btns-list">
                  <draggable :list="columnData.customBtnsList" :animation="340" group="customItem"
                    handle=".option-drag">
                    <div v-for="(item, index) in columnData.customBtnsList" :key="index"
                      class="custom-item">
                      <div class="custom-line-icon option-drag">
                        <i class="icon-qt icon-qt-darg" />
                      </div>
                      <p class="custom-line-value">{{item.value}}</p>
                      <el-input v-model="item.label" placeholder="按钮名称" size="small" />
                      <el-button class="custom-btn" @click="editFunc(item)">事件</el-button>
                      <div class="close-btn custom-line-icon"
                        @click="columnData.customBtnsList.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                  </draggable>
                </div>
                <div>
                  <el-button type="text" icon="el-icon-plus" @click="addCustomBtn">添加按钮</el-button>
                </div>
              </template>
              <el-divider>权限设置</el-divider>
              <el-form-item label="按钮权限">
                <el-switch v-model="columnData.useBtnPermission"></el-switch>
              </el-form-item>
              <el-form-item label="列表权限">
                <el-switch v-model="columnData.useColumnPermission"></el-switch>
              </el-form-item>
              <el-form-item label="数据权限">
                <el-switch v-model="columnData.useDataPermission"></el-switch>
              </el-form-item>
              <el-form-item label="表单权限">
                <el-switch v-model="columnData.useFormPermission"></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <form-script :visible.sync="formScriptVisible" :value="activeItem.func"
      @updateScript="updateScript" />
    <data-type-dialog v-if="dataTypeDialogVisible" ref="DataTypeDialogRef" @ok="resetColumn"></data-type-dialog>
    <EditableDialogVue v-if="editableDialogVisible" ref="EditableDialogRef" @ok="editableDialogVisible=false"></EditableDialogVue>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import draggable from 'vuedraggable'
import FormScript from '@/components/ColumnDesign/FormScript'
import { getDrawingList } from '@/components/Generator/utils/db'
import { noColumnShowList, noSearchList, useInputList, useDateList } from '@/components/Generator/generator/comConfig'
import { getDataInterfaceSelector } from '@/api/systemData/dataInterface'
import {
  inputComponents, selectComponents, systemComponents, layoutComponents, formConf
} from '@/components/Generator/generator/config'
import { deepClone } from '@/utils'
import DataTypeDialog from './DataTypeDialog.vue'
import EditableDialogVue from './EditableDialog.vue'
const getSearchType = item => {
  const qtKey = item.__config__.qtKey
  // 等于-1  模糊-2  范围-3
  const fuzzyList = [...useInputList]
  const RangeList = [...useDateList, 'time', 'date', 'numInput', 'calculate']
  if (RangeList.includes(qtKey)) return 3
  if (fuzzyList.includes(qtKey)) return 2
  return 1
}

const defaultFunc = '({ data, index, request, toast, refresh }) => {\r\n   \r\n}'

const defaultColumnData = {
  searchList: [], // 查询字段
  columnList: [], // 字段列表
  defaultColumnList: [], // 所有可选择字段列表
  type: 1, //列表类型
  defaultSidx: '', // 默认排序字段
  sort: 'desc',   // 排序类型
  hasPage: true,  // 列表分页
  pageSize: 20,  // 分页条数
  treeTitle: '左侧标题', // 树形标题
  treeDataSource: 'dictionary',  // 树形数据来源
  treeDictionary: '',//数据字典
  treeRelation: '',  // 关联字段
  treePropsUrl: '',  // 数据选择
  treePropsValue: 'id',  // 主键字段
  treePropsChildren: 'children',  // 子级字段
  treePropsLabel: 'fullName',  // 显示字段
  groupField: '',  // 分组字段
  useColumnPermission: false,
  useFormPermission: false,
  useBtnPermission: false,
  useDataPermission: false,
  customBtnsList: [],
  btnsList: [
    { value: 'add', icon: 'el-icon-plus', label: '新增' }
  ],  // 按钮
  columnBtnsList: [
    { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
    { value: 'remove', icon: 'el-icon-delete', label: '删除' }
  ] // 列按钮
}

const defaultColumnItem ={
  label: '',
  prop: '',
  align: 'left',
  qtKey: '',
  sortable: false,
  width: null,
  __config__:{
    qtKey:''
  },
  __vModel__: '',
  conditionalType:'',
  __slot__:{
    options:[]
  }
}
export default {
  name: 'columnDesign',
  props: {
    conf: {
      type: Object,
      default: () => { }
    },
    modelType: ''
  },
  components: { draggable, FormScript,DataTypeDialog,EditableDialogVue },
  data() {
    return {
      currentTab: 'column',
      alignOptions: ['left', 'center', 'right'],
      list: [],
      searchList: [],
      columnList: [],
      columnData: JSON.parse(JSON.stringify(defaultColumnData)),
      btnsOption: [
        { value: 'add', icon: 'el-icon-plus', label: '新增' },
        { value: 'download', icon: 'el-icon-download', label: '导出' },
        { value: 'batchRemove', icon: 'el-icon-delete', label: '批量删除' },
      ],
      columnBtnsOption: [
        { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
        { value: 'remove', icon: 'el-icon-delete', label: '删除' },
        { value: 'detail', icon: 'el-icon-tickets', label: '详情' }
      ],
      columnOptions: [],
      searchOptions: [],
      btnsList: [],
      columnBtnsList: [],
      typeList: [
        { url: require('@/assets/images/generator/columnType1.png'), value: 1, name: '普通表格' },
        { url: require('@/assets/images/generator/columnType2.png'), value: 2, name: '左侧树形+普通表格' },
        { url: require('@/assets/images/generator/columnType3.png'), value: 3, name: '分组表格' },
      ],
      dataInterfaceSelector: [],
      formScriptVisible: false,
      activeItem: {},
      leftComponents: [
        {
          title: '基础控件',
          list: inputComponents
        },
        // {
        //   title: '高级控件',
        //   list: selectComponents
        // },
        // {
        //   title: '系统控件',
        //   list: systemComponents
        // },
        // {
        //   title: '布局控件',
        //   list: layoutComponents
        // }
      ],
      conditionalOptions:[
        { value: 'Equal', label: '等于' },
        { value: 'NoEqual', label: '不等于' }, 
        { value: 'GreaterThan', label: '大于' },
        { value: 'GreaterThanOrEqual', label: '大于等于' },
        { value: 'LessThan', label: '小于' },
        { value: 'LessThanOrEqual', label: '小于等于' },
        { value: 'Like', label: '包含' },
        { value: 'NoLike', label: '不包含' },
        { value: 'In', label: '包含范围' },
        { value: 'NotIn', label: '不包含范围' },
        { value: 'LikeLeft', label: '左包含' },
        { value: 'LikeRight', label: '右包含' },
      ],
      dataTypeDialogVisible:false,
      editableDialogVisible:false
    }
  },
  filters: {
    btnText(key) {
      let text = ''
      switch (key) {
        case 'download':
          text = '导出'
          break;
        case 'batchRemove':
          text = '批量删除'
          break;
        case 'edit':
          text = '编辑'
          break;
        case 'remove':
          text = '删除'
          break;
        case 'detail':
          text = '详情'
          break;
        default:
          text = '新增'
          break;
      }
      return text
    }
  },
  watch: {
    btnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.btnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.btnsOption[i].value) {
            list.push(this.btnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.btnsList = list
    },
    columnBtnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.columnBtnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.columnBtnsOption[i].value) {
            list.push(this.columnBtnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.columnBtnsList = list
    },
  },
  created() {
    this.getDataInterfaceSelector()
    if (this.modelType == 4) {
      this.typeList = this.typeList.filter(o => o.value != 3)
    }
    // let list = []
    // const loop = (data, parent) => {
    //   if (!data) return
    //   if (data.__config__ && data.__config__.qtKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
    //     loop(data.__config__.children, data)
    //   }
    //   if (Array.isArray(data)) data.forEach(d => loop(d, parent))
    //   if (data.__config__ && data.__config__.qtKey) {
    //     const visibility = !data.__config__.visibility || (Array.isArray(data.__config__.visibility) && data.__config__.visibility.includes('pc'))
    //     if (data.__config__.layout === "colFormItem" && data.__vModel__ && visibility) {
    //       list.push(data)
    //     }
    //   }
    // }
    // loop(getDrawingList())    
    // let columnOptions = list.filter(o => noColumnShowList.indexOf(o.__config__.qtKey) < 0)
    // let searchOptions = list.filter(o => noSearchList.indexOf(o.__config__.qtKey) < 0)

    const table = getDrawingList()
    // console.log('column design create', table.fields)
    let list=table.fields
    let noColumnShowList = []
    let noSearchList = []
    let columnOptions = list.filter(o => noColumnShowList.indexOf(o.field) < 0)
    let searchOptions = list.filter(o => noSearchList.indexOf(o.field) < 0)
    this.columnOptions = columnOptions.map(o => (Object.assign({}, defaultColumnItem, {
      label: o.fieldName || o.field,
      prop: o.field,
      align: 'left',
      qtKey: o.field,
      sortable: false,
      width: null,
      __config__:{
        qtKey:''
      },
      __vModel__: o.field,
    })));
    //this.searchOptions = searchOptions.map(o => ({
    //  label: o.fieldName,
   //   prop: o.field,
   //   qtKey: o.field,
   //   value: '',
   //   searchType: 1, // getSearchType(o),
   //   ...o,
    //  __vModel__: o.field,
    //}));
    if (typeof this.conf === 'object' && this.conf !== null) {
      this.columnData = Object.assign({}, defaultColumnData, this.conf)

      if (this.columnData.columnList) {
        this.columnData.columnList = this.columnData.columnList.map(x=>({
          __config__:{
            qtKey:x.qtKey
          },
          __vModel__ :x.prop,
          ...x
        }))
      }
    }
    if (!this.columnOptions.length) this.columnData.columnList = []
    if (!this.searchOptions.length) this.columnData.searchList = []
    this.setBtnValue(this.columnData.btnsList, this.btnsOption)
    this.setBtnValue(this.columnData.columnBtnsList, this.columnBtnsOption)
    this.btnsList = this.columnData.btnsList.map(o => o.value)
    this.columnBtnsList = this.columnData.columnBtnsList.map(o => o.value)

    if (this.columnData.columnList.length === 0 && this.columnOptions.length > 0) {
      this.columnData.columnList = this.columnOptions
    }
    this.columnOptions.forEach(o =>{
      if (!this.columnData.columnList.some(x=>x.prop===o.prop)) {
        this.columnData.columnList.push(deepClone(o))
      }
    })

    // 删掉不存在的字段
    for(let i = this.columnData.columnList.length - 1; i >= 0; i--){
      if(!this.columnOptions.some(o=>o.prop===this.columnData.columnList[i].prop)){
        this.columnData.columnList.splice(i, 1)
      }
    }
    // this.$set(this.columnData, 'columnList', this.columnOptions)
  },
  mounted() {
    this.setSort()
    this.$nextTick(() => {
      this.setListValue(this.columnData.columnList, this.columnOptions, 'column')
      this.setListValue(this.columnData.searchList, this.searchOptions, "search")
    })
  },
  methods: {
    setBtnValue(replacedData, data, key) {
      key = key ? key : 'value'
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            data[ii] = replacedData[i]
            break inter
          }
        }
      }
    },
    setListValue(replacedData, data, type) {
      const key = type === 'column' ? 'prop' : '__vModel__'
      let res = []
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            if (type === 'column') {
              data[ii].align = replacedData[i].align
              data[ii].width = replacedData[i].width
              data[ii].sortable = replacedData[i].sortable
            }
            res.push(data[ii])
            break inter
          }
        }
      }
      res.forEach(row => {
        if (this.$refs[type + 'Table']) {
          this.$refs[type + 'Table'].toggleRowSelection(row, true)
        }
      })
    },
    /**
      * 供父组件使用 获取列表JSON
    */
    getData() {
      return new Promise((resolve, reject) => {
        if (!this.columnData.columnList.length) {
          reject({ msg: '列表字段不允许为空', target: 1 })
          return
        }
        if (this.columnData.type == 2) {
          if (this.columnData.treeDataSource === 'dictionary' && !this.columnData.treeDictionary) {
            reject({ msg: '请选择数据字典', target: 1 })
            return
          }
          if (this.columnData.treeDataSource === 'api') {
            if (!this.columnData.treePropsValue){
              reject({ msg: '请输入主键字段', target: 1 })
              return
            }
            if (!this.columnData.treePropsLabel) {
              reject({ msg: '请输入显示字段', target: 1 })
              return
            }
            if (!this.columnData.treePropsChildren) {
              reject({ msg: '请输入子级字段', target: 1 })
              return
            }
          }
          if (!this.columnData.treeRelation) {
            reject({ msg: '请选择关联字段', target: 1 })
            return
          }
        }
        if (this.columnData.type == 3) {
          if (!this.columnData.groupField) {
            reject({ msg: '请选择分组字段', target: 1 })
            return
          }
        }
        this.columnData.defaultColumnList = this.columnOptions.map(o => ({
          ...o,
          checked: this.columnData.columnList.some(i => i.prop === o.prop)
        }))
        this.columnData.searchList = this.columnData.columnList.filter(o => o.query)
        // return this.columnData
       // console.log(this.columnData)

        resolve({ columnData: this.columnData, target: 1 })
      })
      
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.columnList.splice(evt.oldIndex, 1)[0]
          this.columnData.columnList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
      // const el2 = this.$refs.dragTableSearch.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      // Sortable.create(el2, {
      //   ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
      //   setData: function (dataTransfer) {
      //     dataTransfer.setData('Text', '')
      //   },
      //   onEnd: evt => {
      //     const targetRow = this.columnData.searchList.splice(evt.oldIndex, 1)[0]
      //     this.columnData.searchList.splice(evt.newIndex, 0, targetRow)
      //   },
      //   handle: '.drag-handler',
      // })
    },
    searchSelectionChange(val) {
      this.$set(this.columnData, 'searchList', val)
    },
    columnSelectionChange(val) {
      this.$set(this.columnData, 'columnList', val)
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    dataTypeChange() {
      this.columnData.treePropsValue = 'id'
      this.columnData.treePropsChildren = 'children'
      this.columnData.treePropsLabel = 'fullName'
    },
    addCustomBtn() {
      const id = this.qt.idGenerator()
      this.columnData.customBtnsList.push({
        value: 'btn_' + id,
        label: '按钮' + id,
        func: ''
      })
    },
    editFunc(item) {
      if (!item.func) item.func = defaultFunc
      this.activeItem = item
      this.$nextTick(() => {
        this.formScriptVisible = true
      })
    },
    updateScript(func) {
      this.activeItem.func = func
    },
    dataTypeHandle(row){
      this.dataTypeDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.DataTypeDialogRef.init(row)
      })
    },
    resetColumn(data){
      this.dataTypeDialogVisible = false
      // const index = this.columnData.columnList.findIndex(x=>x.prop == data.prop)
      // if (index>-1) {
      //   console.log('resetColumn', data,this.columnData.columnList[index])
      // }
    },
    editableFormHandle(row){
      this.editableDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.EditableDialogRef.init(row)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/components/ColumnDesign/index.scss';

.columnDesign-container{
  padding-top: 0;

  .main-board{
    margin: 0;
  }
}
</style>
