<template>
  <div class="tableContainer" ref="QTTableInner">
    <template v-if="!newStyle">
      <el-alert
        ref="QTTableActionsRef"
        v-if="$slots.actions"
        type="info"
        class="table-actions"
        :center="false"
        :closable="false">
        <template slot="title">
          <slot name="actions" />
        </template>
      </el-alert>
      <el-alert
        v-if="hasC && !customSelectedRows"
        type="success"
        :closable="false">
        <template slot="title">
          <span>当前选中<el-tag>{{ selectedRows.length }}</el-tag>条记录
            <el-button style="margin-left: 10px;" type="danger" size="mini" @click="handleClear()">清空</el-button>
            <el-button v-if="selectedRows.length>0" style="margin-left: 10px;" :type="showCheck?'warning':'primary'" size="mini" @click="showCheck = !showCheck">{{ showCheck?'继续':'查看' }}</el-button>
          </span>
        </template>
      </el-alert>
    </template>
    <div class="tableContainer-header" v-else>      
      <div class="tableContainer-header-left">
        <slot name="actions" />
      </div>  
      <div class="tableContainer-header-right">
        <div v-if="hasC && !customSelectedRows" style="padding-right: 10px;">
          <span>当前选中<el-tag>{{ selectedRows.length }}</el-tag>条记录
            <el-button v-if="selectedRows.length>0" style="margin-left: 10px;" type="danger" size="mini" @click="handleClear()">清空</el-button>
            <el-button v-if="selectedRows.length>0" style="margin-left: 10px;" :type="showCheck?'warning':'primary'" size="mini" @click="showCheck = !showCheck">{{ showCheck?'继续':'查看' }}</el-button>
          </span>
        </div>
        <el-tooltip v-if="customColumn" effect="dark" content="设置" placement="top">
          <el-link icon="icon-qt icon-qt-options QT-common-head-icon" :underline="false"
            @click="showDrawer" style="padding-right: 10px;" />
        </el-tooltip>
      </div>    
    </div>
    <el-table v-show="!showCheck"  v-if="!refreshTable" :data="data" ref="QTTable" class="QT-common-table"
      :height="cheight" :element-loading-text="$t('common.loadingText')" v-bind="$attrs"
      v-on="$listeners" :border="border" 
      :row-style="rowStyle"
      @current-change="row=> selectedRow = row"
      @row-dblclick="handleRowDblClick"
      @select="handleRowSelect"
      @select-all="handleSelectAll"
      @header-dragend="headerDragend"
      :style="{height: cheight}"
    >
      <el-table-column prop="selection" type="selection" :width="selectionWidth" v-if="hasC" align="center" fixed="left" />
      <el-table-column prop="index" type="index" :width="indexWidth" label="序号" v-if="hasNO"
        align="center" />
      <qt-table-column :columns="columns" :columnList="columnList" v-if="customColumn" :disabled="disabled" />
      <template v-else>
        <slot />
      </template>
      
      <el-table-column align="center" fixed="right" width="36" v-if="customColumn && !newStyle  && !hideCC">
        <template slot="header">
          <el-link icon="icon-qt icon-qt-options QT-common-head-icon" :underline="false"
            @click="showDrawer" />
        </template>
      </el-table-column>
     
      <template slot="empty">
        <el-empty description="暂无数据" :image-size="120"></el-empty>
      </template>
    </el-table>
    <el-table v-show="showCheck" v-if="!refreshTable" ref="qtTableCRef" :data="selectedRows" :height="cheight" class="QT-common-table"
      :border="border" @select="handleRowSelect">
      <el-table-column prop="index" type="index" min-width="50" label="序号" v-if="hasNO"
        align="center" />
      <qt-table-column :columns="columns" :columnList="columnList" v-if="customColumn" :disabled="true" />
      <template v-else>
        <slot />
      </template>
      <!-- <el-table-column align="center" fixed="right" width="36" v-if="customColumn">
        <template slot="header">
          <el-link icon="icon-qt icon-qt-options QT-common-head-icon" :underline="false"
            @click="showDrawer" />
        </template>
      </el-table-column> -->
      <template slot="empty">
        <el-empty description="暂无数据" :image-size="120"></el-empty>
      </template>
      <el-table-column label="#" fixed="right" width="60" align="center">
        <template slot-scope="scope">
          <el-button type="text"
              @click="cancelSelectedRow(scope.row,scope.$index)"
              class="QT-table-delBtn"
              >取消</el-button
            >
        </template>
      </el-table-column>
    </el-table>
    <ColumnSettings v-if="drawerVisible" ref="columnSettings" :defaultColumns="defaultColumns"
      :columnList="columnList" @setColumn="setColumn" @close="setColumnClose" />
  </div>
</template>

<script>
import qtTableColumn from './Column'
import ColumnSettings from './ColumnSettings'
export default {
  name: 'QT-table',
  components: { qtTableColumn, ColumnSettings },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 序号 默认有
    hasNO: {
      type: Boolean,
      default: true
    },
    // 多选框 默认无
    hasC: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    customColumn: {
      type: Boolean,
      default: true
    },
    hideCC: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String,Number],
    },
    selectedRows:{
      type:Array,
      default:()=>[]
    },    
    // 自定义选中展示
    customSelectedRows: {
      type: Boolean,
      default: false
    },
    // 表格是否占满空白位置
    full:{
      type :Boolean,
      default:false
    },

    // 是否只读
    disabled:{
      type :Boolean,
      default:false
    },
    // 表格id
    tableKey:{
      type :String
    },
    // 序号宽度
    indexWidth:{
      tyep:Number,
      default: 50
    },
    // 选择列宽度
    selectionWidth:{
      tyep:Number,
      default: 50
    }
    // pagination:{
    //   type: Object,
    //   default:()=>{
    //     return {
    //       pageSize: 10,
    //       currentPage: 1,
    //       total: 0
    //   }
    // }}
  },
  data() {
    return {
      columnList: [],
      hasSlotContent: false,
      columns: [],
      defaultColumns: [],
      drawerVisible: false,
      refreshTable: false,
      selectedRow: undefined,
      showCheck:false,
      innerHeight:0,
      actionsHeight:0
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    },
    // actionsHeight(){
    //   this.doLayout()
    // },
    // innerHeight(){
    //   this.$nextTick(() => {
    //     this.$refs.QTTable.doLayout();
    //   })
    // }
  },
  computed: {
    menuId() {
      return this.$route.meta.modelId || ''
    },
    cheight(){
      if (this.height) {
        return this.height
      }

      // if (this.full) {
      //   return `${this.innerHeight}px`
      // }

      // console.log('cheight',this.$slots.actions)

      if (this.newStyle) {
        if (this.hasC || (this.$slots.actions)) {
          return `calc(100% - 60px)`
        }
        
        return '100%'
      }else{
        if (this.hasC) {
          return this.$slots.actions ? `calc(100% - 45px - 60px)` :`calc(100% - 45px)`
        }
        
        // return '100%'
        return this.$slots.actions ? "calc(100% - 60px)" :'100%'
      }
    },
    localTableKey(){
      if (this.tableKey) {
        return this.tableKey
      }
      const columns = this.$slots.default 
      const defaultColumns = columns.map(o => o.componentOptions && o.componentOptions.propsData).filter(item => item)
      const arr =defaultColumns.filter(x=>!!x.prop).map(x=>x.prop).sort()
      const length = arr.length > 5? 5 : arr.length
      const keys  = []
      for (let index = 0; index < length; index++) {
        const col = arr[index];
        keys.push(col)
      }

      return `${this.menuId}_${keys.join('_')}` 
    },
    newStyle(){
      const slots = this.$slots.actions && this.$slots.actions.length>0
      if (slots == true) {
        return true
      }
      return false
    }
  },
  created(){
    this.refreshTable = true
    // console.log('created',this.refreshTable)
  },
  mounted() {
    // console.log(this.localTableKey)
    this.refreshTable = false
    this.getColumns()
    addEventListener('keyup', this.keyUp)
    
    // console.log('mounted',this.refreshTable)
    // const rect = this.$refs.QTTable.$el.getBoundingClientRect(); // 获取元素相关信息（包括坐标）
    // this.innerHeight = window.innerHeight - rect.top - (this.$slots.actions ? 60 :0) - (this.hasC ? 20 :0)
    //         console.log(this.innerHeight)
    //         console.log('左上角X坐标：', rect.left);
    //         console.log('左上角Y坐标：', rect.top);
    //         console.log('右下角X坐标：', rect.right);
    //         console.log('右下角Y坐标：', rect.bottom);
  },
  beforeDestroy(){
    removeEventListener('keyup', this.keyUp)
  },
  beforeUpdate() {
    // const rect = this.$refs.QTTable.$el.getBoundingClientRect(); // 获取元素相关信息（包括坐标）
    // this.innerHeight = window.innerHeight - rect.top - (this.$slots.actions ? 60 :0) - (this.hasC ? 45 :0) - 60
    //         console.log(this.innerHeight)
            // console.log('左上角X坐标：', rect.left);
            // console.log('左上角Y坐标：', rect.top);
            // console.log('右下角X坐标：', rect.right);
            // console.log('右下角Y坐标：', rect.bottom);
    this.getColumns()
  },
  updated() {
    if (this.refreshTable) this.refreshTable = false
  },
  methods: {
    // getHeight(){
    //   if (this.height) {
    //     return this.height
    //   }

    //   console.log('cheight',this.actionsHeight)
     
    //   if (this.hasC) {
    //     return this.actionsHeight>0 ? `calc(100% - 45px - ${this.actionsHeight}px)` :`calc(100% - 45px)`
    //   }
      
    //   // return '100%'
    //   return this.actionsHeight>0? `calc(100% - ${this.actionsHeight}px)` :'100%'
    // },
    showDrawer() {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.$refs.columnSettings.init(this.columnList, this.columns)
      })
    },
    checkForSlotContent() {
      let checkForContent = (hasContent, node) => {
        return hasContent || node.tag || (node.text && node.text.trim())
      }
      return this.$slots && this.$slots.default && this.$slots.default.reduce(checkForContent, false)
    },
    getColumns() {
      if (!this.customColumn) return
      this.hasSlotContent = this.checkForSlotContent()
      if (!this.hasSlotContent) return
      this.columns = this.$slots.default
      let defaultColumns = this.columns.map(o => o.componentOptions && o.componentOptions.propsData).filter(item => item)
      this.defaultColumns = defaultColumns.filter(o => o.prop)
      let list = [...this.defaultColumns]
      const cacheList = this.qt.storageGet(this.localTableKey)
      // console.log(cacheList)
      if (!cacheList) {
        this.columnList = list.map(item => {
          return {
            ...item,
            columnVisible: true
          }
        })
      } else {
        let columnList = cacheList.map(item => {
          let isShow = false
          list.forEach(item2 => {
            if (item.prop === item2.prop) isShow = true
          })
          return isShow ? item : null
        }).filter(item => item)
        this.columnList = this.mergeArray(columnList, list)
      }
    },
    mergeArray(arr1, arr2) {
      let arr = [...arr1]
      for (let i = 0; i < arr2.length; i++) {
        let flag = true
        inner: for (let j = 0; j < arr1.length; j++) {
          if (arr2[i].prop == arr1[j].prop) {
            flag = false
            break inner
          }
        }
        if (flag) arr.push(arr2[i])
      }
      return arr
    },
    doLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          // console.log('table...doLayout')
          this.$refs && this.$refs.QTTable && this.$refs.QTTable.doLayout()

          // console.log(this.$refs.QTTable.$el.getBoundingClientRect())
          const rect = this.$refs.QTTable.$el.getBoundingClientRect(); // 获取元素相关信息（包括坐标）
      
          //   // console.log('左上角X坐标：', rect.left);
          //   // console.log('左上角Y坐标：', rect.top);
          //   // console.log('右下角X坐标：', rect.right);
          //   // console.log('右下角Y坐标：', rect.bottom);
            this.innerHeight = window.innerHeight - rect.top - (this.$slots.actions ? 60 :0) - (this.hasC ? 20 :0)
          //   console.log(this.innerHeight)

          if (this.hasC && this.selectedRows && this.selectedRows.length > 0) {
            const recordKey = this.getRecordKey()
            this.selectedRows.forEach(ele=>{
              const row = this.data.find(x=>x[recordKey] == ele[recordKey])
              if (row) {
                this.$refs.QTTable.toggleRowSelection(row,true)
              }
            }) 
          }
        })
      }, 50)
    },
    setColumn(list) {
      // this.loading = true
      this.qt.storageSet({ [this.localTableKey]: list })
      this.columnList = list
      this.$forceUpdate()
      this.refreshTable = true
    },
    rowStyle({ row, rowIndex }) {
      // console.log('rowStyle...123123123',this.$attrs)
      Object.defineProperty(row, "rowIndex", { // 给每行添加不可枚举属性rowIndex来标识当前行
        value: rowIndex,
        writable: true,
        enumerable: false
      });
      if (this.$attrs['row-style']) {
        // console.log(this.$attrs['row-style'])
        return this.$attrs['row-style']({ row, rowIndex })
      }
    },
    keyUp(e){
      let refsElTable = this.$refs.QTTable
      if (!refsElTable || !refsElTable.highlightCurrentRow) {
        return
      }
      // 表格为空，不执行下方 
      if (this.refreshTable || !this.data || this.data.length == 0) return
      
      if (e.keyCode == 40) { // 下键
        this.$nextTick(() => {
          let selectedIndex = !!this.selectedRow ? this.selectedRow.rowIndex : 0;
          // 如果选中的是最后一行了，直接返回
          if (selectedIndex == this.data.length - 1) {
            return
          }
          selectedIndex++
          refsElTable.setCurrentRow(this.data.find(a=>a.rowIndex == selectedIndex))
        })
      } else if (e.keyCode == 38) { // 上键
        this.$nextTick(() => {
          let selectedIndex = !this.selectedRow ? -1 :this.selectedRow.rowIndex;
          
          // 如果选中的是第一行，直接返回
          if (selectedIndex == 0) {
            return
          }
          selectedIndex--
          refsElTable.setCurrentRow(this.data.find(a=>a.rowIndex == selectedIndex))
        })
      }
    },
    init(){
      this.$emit('pagination',{ pageNum: this.pagination.pageNum,pageSize:this.pagination.pageSize})
    },
    // 行选择相关 //////////////////
    getRecordKey(){
      let recordKey = 'id' 
      let rowKey;
      if (this.$attrs['row-key']) {
        rowKey=this.$attrs['row-key']
      }
      if (this.$refs.QTTable && this.$refs.QTTable.rowKey) {
        rowKey= this.$refs.QTTable.rowKey
      }
      
      // if (this.$refs.QTTable && !!this.$refs.QTTable.rowKey) {
        if (!!rowKey) {
        recordKey = typeof(rowKey) == 'function' ? rowKey(row) : rowKey
      }
      return recordKey
    },
    handleRowDblClick(row){
      if (this.hasC) {
        const { QTTable} = this.$refs
        if (QTTable) {
          QTTable.toggleRowSelection(row,true)
          this.handleRowSelectCore(row,true)
        }
      }
      this.$emit('row-dblclick',row)
    },
    handleRowSelect(selection, row){
      const recordKey = this.getRecordKey()
      const isChecked  = selection.findIndex(a=>a[recordKey]  == row[recordKey] ) >-1
      this.handleRowSelectCore(row,isChecked)
    },
    handleRowSelectCore(row,checked){
      const recordKey = this.getRecordKey()
      // console.log('handleRowSelectCore',recordKey, this.selectedRows)
      const index = this.selectedRows.findIndex(a=> a[recordKey] == row[recordKey])
      if (checked) {
        index==-1 && this.selectedRows.push(row)
      }else{        
        if (index>-1) {
          this.selectedRows.splice(index,1)
        }
      }
    },
    clearSelection(){
      if(this.$refs.QTTable){
        this.$refs.QTTable.clearSelection();
      }      
      this.selectedRows.splice(0)
      this.showCheck = false
    },
    toggleRowSelection(row,flag){
      if(this.$refs.QTTable){
        this.$refs.QTTable.toggleRowSelection(row,flag);
      }    
    },
    handleSelectAll(selection){
      // console.log(selection)
      const isChecked = selection.length > 0
      if (selection.length>0) {
        selection.forEach(ele=>this.handleRowSelectCore(ele,true))
      }else{
        this.data.forEach(ele=>this.handleRowSelectCore(ele,false))
      }
    },
    cancelSelectedRow(row,index){
      this.selectedRows.splice(index,1)
      const recordKey = this.getRecordKey()
      const ele  = this.data.find(a=>a[recordKey]  == row[recordKey] )
      if (ele) {
        this.$refs.QTTable.toggleRowSelection(ele,false)
      }
    },
    headerDragend(newWidth, oldWidth, column, event){
      const cacheList = this.qt.storageGet(this.localTableKey) || this.columnList.map(item=>item)
      if (cacheList) {
        const col = cacheList.find(o => o.prop == column.property)
        if (col) {
          // this.$set(col,'width',newWidth)
          col.width = `${Math.ceil(newWidth)}`
          this.qt.storageSet({ [this.localTableKey]: cacheList })
        }
        // console.log('headerDragend',this.columnList)
      }
    },
    handleClear(){
      this.clearSelection();
    },
    setColumnClose(flag){
      if (flag) {
       this.$emit('columnChange')
      }
    }
  }
}
</script>
<style lang="scss">
.el-tabs--top{
  .tableContainer{
    .tableContainer-header{
      margin-top: -15px;
    }    
  }
}
.tableContainer {
  flex: 1 0 0;
  height: 100%;
  overflow: hidden;

  .table-actions{
    padding: 0;
    max-height: 60px;

    .el-alert__content{
      padding: 0;
      width: 100%;
      // display: inherit;
    }
  }

  &-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    // padding: 0px 10px;
    // &-left{
    //   padding-left: 10px;
    // }

    &-right{
      display: flex;
    }
  }

  .el-tag+.el-tag {
      margin-left: 10px;
  }
}

.elDialog {
  margin: 0 !important;
  width: 240px !important;
}

.elDialog .el-dialog__header {
  padding: 0;
}

.elDialog .el-dialog__body {
  padding: 0;
}

.elDialog .el-dialog__footer {
  padding: 0;
}

.column-list {
  height: calc(100% - 46px);
  padding: 0;

  .column-item-header {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #999;
    border-bottom: 1px solid #d9d9d9;
  }

  .column-item {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #303133;
    cursor: pointer;

    &:hover {
      background: #f2f4f6;
    }

    &.sortable-chosen {
      border: 1px dashed #1890ff;
    }
  }

  .column-item-icon {
    width: 14px;
    margin-right: 5px;
    color: #909399;
    cursor: move;
  }

  .el-switch {
    transform: scale(0.8);
  }

  .column-item-label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    flex: 1 0 0;
  }

  .column-item-value {
    flex: 1 0 0;
    text-align: right;
  }
}
</style>
