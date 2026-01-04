<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="QT-full-dialog"
    :show-close="false" :modal="false">
    <div class="QT-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/qt.png" class="header-logo" />
        <p class="header-txt"> · 在线开发</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple
        :class="'steps steps'+(maxStep+1)" v-if="!loading">
        <el-step title="基础设置" @click.native="stepChick(0)" />
        <!-- <el-step title="表单设计" @click.native="stepChick(1)" /> -->
        <el-step title="列表设计" @click.native="stepChick(1)" v-if="maxStep>=1" />
        <!-- <el-step title="流程设计" @click.native="stepChick(3)" v-if="maxStep>=3" /> -->
      </el-steps>
      <div class="options">
        <el-button @click="prev" :disabled="activeStep<=0">{{$t('common.prev')}}</el-button>
        <el-button @click="next" :disabled="activeStep>=maxStep || loading">{{$t('common.next')}}
        </el-button>
        <el-button type="primary" @click="dataFormSubmit()" :disabled="activeStep!=maxStep"
          :loading="btnLoading">{{$t('common.confirmButton')}}</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <el-row type="flex" justify="center" align="middle" v-if="!activeStep" class="basic-box">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="10" class="basicForm">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px"
            @submit.native.prevent label-position="right">
            <el-form-item label="功能名称" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="功能名称" maxlength="100">
              </el-input>
            </el-form-item>
            <el-form-item label="功能编码" prop="enCode">
              <el-input v-model="dataForm.enCode" placeholder="功能编码" maxlength="50">
              </el-input>
            </el-form-item>
            <el-form-item label="功能分类" prop="category">
              <el-select v-model="dataForm.category" placeholder="选择分类">
                <el-option :key="item.id" :label="item.fullName" :value="item.id"
                  v-for="item in categoryList" />
              </el-select>
            </el-form-item>
            <el-form-item label="功能排序" prop="sortCode">
              <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
                controls-position="right" />
            </el-form-item>
            <el-form-item label="功能状态" prop="state">
              <el-switch v-model="dataForm.state" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="功能说明" prop="description">
              <el-input v-model="dataForm.description" placeholder="功能说明" type="textarea"
                :rows="3" />
            </el-form-item>
            <el-form-item label="数据连接">
              <el-select v-model="dataForm.dbLinkId" placeholder="请选择数据库" @change="onDbChange"
                clearable>
                <el-option-group v-for="group in dbOptions" :key="group.fullName"
                  :label="group.fullName">
                  <el-option v-for="item in group.children" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-alert
              title=""
              type="warning"
              show-icon>
              <p>视图以“qtfunc_”开头，表示特殊的功能，视图需要返回__type和__func这两个字段</p>
              <p>__type表示执行类型，1：执行存储过程，2：调用程序内部方法</p>
              <p>__func表示执行内容，当__type=1时,存储过程名称|参数（多个用逗号相连），当__type=2时,类(FullName):方法</p>
            </el-alert>
            <el-table :data="tables" class="QT-common-table"
              empty-text="点击“新增”可选择 1 条（单视图）">
              <el-table-column type="index" label="序号" width="50" align="center" />
              <el-table-column prop="typeId" label="类别" width="65">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.typeId=='1'">主表</el-tag>
                  <el-tag type="warning" v-else @click="changeTable(scope.row)"
                    style="cursor:pointer" title="点击设置成主表">子表</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="table" label="表名">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.tableName||scope.row.table" placement="top">
                    <span>{{scope.row.table}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="tableField" label="外键字段">
                <template slot-scope="scope" v-if="scope.row.typeId !=='1'">
                  <el-select v-model="scope.row.tableField" placeholder="请选择">
                    <el-option v-for="item in scope.row.fields" :key="item.field"
                      :label="item.field" :value="item.field">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- <el-table-column prop="relationTable" label="关联主表" /> -->
              <!-- <el-table-column prop="relationField" label="关联主键">
                <template slot-scope="scope" v-if="scope.row.typeId !=='1'">
                  <el-select v-model="scope.row.relationField" placeholder="请选择">
                    <el-option v-for="item in mainTableFields" :key="item.field" :label="item.field"
                      :value="item.field">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" fixed="right" width="50">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" class="QT-table-delBtn"
                    @click="delItem(scope.row,scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="openTableBox" v-if="tables.length==0">
              <el-button type="text" icon="el-icon-plus">新增一行</el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <!-- <template v-if="activeStep==1">
        <Generator ref="generator" :conf="formData" :modelType="dataForm.type"
          :webType="dataForm.webType" :dbType="dbType" />
      </template> -->
      <template v-if="activeStep==1">
        <columnDesign ref="columnDesign" :conf="columnData" modelType="2" />
        <!-- <columnDesign ref="columnDesign" :columnData="columnData" :appColumnData="appColumnData"
          :modelType="dataForm.type" :webType="dataForm.webType" /> -->
      </template>
      <template v-if="activeStep==3">
        <Process ref="process" :conf="flowTemplateJson" :flowType="1" />
      </template>
    </div>
    <TableForm :visible.sync="formVisible" ref="tableForm" @closeForm="closeForm"
      :dbLinkId="dataForm.dbLinkId" />
  </el-dialog>
</template>

<script>
import Generator from '@/components/Generator/index/Home'
// import ColumnDesign from '@/components/ColumnDesign'
import ColumnDesign from './ColumnDesign'
import Process from "@/components/Process"
// import TableForm from '@/views/generator/TableForm'
import TableForm from '@/views/generator/ViewForm.vue'
import mixin from '@/mixins/generator/form'
import { getVisualDevInfo, Update, Create } from '@/api/onlineDev/visualDev'
import { saveDrawingList } from '@/components/Generator/utils/db'
export default {
  mixins: [mixin],
  components: { Generator, ColumnDesign, Process, TableForm },
  data() {
    return {
      dataRule: {
        fullName: [
          { required: true, message: '功能名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
        ],
        category: [
          { required: true, message: '功能分类不能为空', trigger: 'change' },
        ]
      }
    }
  },
  methods:{
    init(categoryList, id, type, webType, isToggle) {
      this.categoryList = categoryList
      this.activeStep = 0
      this.tables = []
      this.defaultTable = []
      this.dataForm.id = id || ''
      this.getDbOptions()
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getVisualDevInfo(this.dataForm.id).then(async res => {
            this.dataForm = res.data
            this.dataForm.webType = this.dataForm.webType || 2
            if (isToggle) this.dataForm.webType = webType
            this.maxStep = 1 // parseInt(this.dataForm.webType)
            this.formData = this.dataForm.formData && JSON.parse(this.dataForm.formData)
            this.columnData = this.dataForm.columnData && JSON.parse(this.dataForm.columnData)
            this.appColumnData = this.dataForm.appColumnData && JSON.parse(this.dataForm.appColumnData)
            this.flowTemplateJson = this.dataForm.flowTemplateJson && JSON.parse(this.dataForm.flowTemplateJson)
            this.tables = this.dataForm.tables && JSON.parse(this.dataForm.tables) || []
            this.defaultTable = this.dataForm.tables && JSON.parse(this.dataForm.tables) || []
            await this.updateFields()
            this.loading = false
          }).catch(() => { this.loading = false })
        } else {
          this.dataForm.type = type
          this.dataForm.webType = webType || 2
          this.maxStep = 1 //parseInt(this.dataForm.webType)
        }
      })
    },
    next() {
      if (this.activeStep < 1) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.getDbType()
            const type = this.dataForm.type
            if (!this.tables.length) {
              if (this.defaultTable.length || type == 3 || type == 4) {
                this.$message.warning('请至少选择一个数据表')
                return
              }
              this.$store.commit('generator/SET_TABLE', false)
              this.activeStep += 1
            } else {
              if (!this.exist()) return
              let subTable = this.tables.filter(o => o.typeId == '0')
              this.$store.commit('generator/UPDATE_SUB_TABLE', subTable)
              this.$store.commit('generator/SET_ALL_TABLE', this.tables)
              this.$store.commit('generator/SET_TABLE', true)
              this.$store.commit('generator/UPDATE_FORMITEM_LIST', this.mainTableFields)
              this.activeStep += 1

              console.log(this.tables,this.columnData)
              this.formData = this.tables[0]
              saveDrawingList(this.tables[0])
            }
          }
        })
      // } else if (this.activeStep == 1) {
      //   this.$refs['generator'].getData().then(res => {
      //     this.formData = res.formData
      //     this.activeStep += 1
      //   }).catch(err => {
      //     err.msg && this.$message.warning(err.msg)
      //   })
      } else {
        // console.log( this.$refs['columnDesign'].getData)
        const res = this.$refs['columnDesign'].getData()
        console.log(res)
        // .then(res => {
        //   this.columnData = res.columnData
        //   this.appColumnData = res.appColumnData
        //   this.activeStep += 1
        // }).catch(err => {
        //   err.msg && this.$message.warning(err.msg)
        // })
      }
    }
  }
}
</script>