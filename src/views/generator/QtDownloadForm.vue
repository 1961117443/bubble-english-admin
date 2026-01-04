<template>
  <el-dialog title="输出设置" :close-on-click-modal="false" :visible.sync="visible"
    class="QT-dialog QT-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" label-width="100px" :model="dataForm">
      <el-form-item label="模块命名" prop="module" v-if="type!=3"
        :rules="[{ required: true,message: '请选择模块命名', trigger: 'change' }]">
        <el-select v-model="dataForm.module" placeholder="请选择模块命名" filterable allow-create
          default-first-option clearable>
          <el-option v-for="item in moduleList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="功能描述" prop="description"
        :rules="[{ required: true,message: '功能描述不能为空', trigger: 'blur' }]">
        <el-input v-model="dataForm.description" placeholder="功能描述" />
      </el-form-item>
      <el-form-item label="功能类名" prop="className"
        :rules="[{ required: true,message: '功能类名不能为空', trigger: 'blur' }]">
        <el-input v-model="dataForm.className" placeholder="功能类名" />
      </el-form-item>
      <el-form-item :label="item.placeholderText" :prop="'subClassName.' + i + '.fullName'"
        v-for="(item,i) in dataForm.subClassName" :key="i" :rules="item.rules">
        <el-input v-model="item.fullName" :placeholder="item.placeholderText" />
      </el-form-item>
      <el-form-item label="Api文件夹" prop="folderApi">
        <el-input v-model="dataForm.folderApi" placeholder="Api项目文件夹" />
      </el-form-item>
      <el-form-item label="Web文件夹" prop="folderWeb">
        <el-input v-model="dataForm.folderWeb" placeholder="Web项目文件夹" />
      </el-form-item>
      <slot :data="dataForm"></slot>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAreasName, DownloadCode } from '@/api/onlineDev/visualDev'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        module: '',
        description: '',
        subClassName: [],
        className: '',
        folderApi: '',
        folderWeb:''
      },
      id: '',
      type: '',
      tables: [],
      moduleList: []
    }
  },
  methods: {
    init(tables, id, type,row) {
      if (!tables || !id) {
        this.visible = false
        return
      }
      this.id = id
      this.type = type || 0
      this.tables = JSON.parse(tables)
      this.getAreasName()
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        let mainTable = this.tables.filter(o => o.typeId == '1')[0].table
        this.dataForm.className = mainTable
        if (row) {
          if (row.description) {
            this.dataForm.description = row.description
          }else if(row.fullName){
            this.dataForm.description = row.fullName
          }
        }
        if (!this.dataForm.description) {
          this.dataForm.description = mainTable
        }        
        let subClassName = this.tables.filter(o => o.typeId != '1')
        this.dataForm.subClassName = subClassName.map(o => ({
          fullName: o.table,
          placeholderText: '子表类名',
          rules: { required: true, message: `${o.placeholderText}不能为空`, trigger: 'blur' }
        }))

        const module = this.qt.storageGet('codeGenerate_module')
        if (module) {
          this.dataForm.module = module
        }
        const folderApi = this.qt.storageGet('codeGenerate_folderApi')
        if (folderApi) {
          this.dataForm.folderApi = folderApi
        }
        const folderWeb = this.qt.storageGet('codeGenerate_folderWeb')
        if (folderWeb) {
          this.dataForm.folderWeb = folderWeb
        }
      })
    },
    getAreasName() {
      getAreasName().then(res => {
        this.moduleList = res.data
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let subClassName = this.dataForm.subClassName.map(o => o.fullName)
          let query = {
            ...this.dataForm,
            module: this.dataForm.module,
            className: this.dataForm.className,
            subClassName: subClassName.join(','),
            description: this.dataForm.description
          }
          this.qt.storageSet({ 'codeGenerate_module': query.module})          
          query.folderApi && this.qt.storageSet({ 'codeGenerate_folderApi': query.folderApi})
          query.folderWeb && this.qt.storageSet({ 'codeGenerate_folderWeb': query.folderWeb})
          this.$emit('ok',query)
          // DownloadCode(this.id, query).then(res => {
          //   if (!res.data || !res.data.url) return
          //   this.qt.downloadFile(res.data.url)
          //   this.$emit('close')
          // })
        }
      })
    }
  }
}
</script>