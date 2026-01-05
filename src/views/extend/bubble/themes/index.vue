<template>
  <div class="BubbleThemes-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>主题管理</span>
        <div style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="openCreate">新增主题</el-button>
        </div>
      </div>

      <el-table :data="rows" border size="mini" v-loading="loading">
        <el-table-column prop="themeKey" label="ThemeKey" width="160" />
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="minAge" label="最小年龄" width="100" />
        <el-table-column prop="maxAge" label="最大年龄" width="100" />
        <el-table-column prop="courseCount" label="课程数" width="90" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="form.id ? '编辑主题' : '新增主题'" :visible.sync="visible" width="520px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="ThemeKey" prop="themeKey">
          <el-input v-model="form.themeKey" placeholder="如 zoo / farm / body" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="中文标题" />
        </el-form-item>
        <el-form-item label="适龄" prop="age">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-input-number v-model="form.minAge" :min="1" :max="12" controls-position="right" style="width:100%" />
            </el-col>
            <el-col :span="12">
              <el-input-number v-model="form.maxAge" :min="1" :max="12" controls-position="right" style="width:100%" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="3" v-model="form.description" placeholder="可选" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listThemes, createTheme, updateTheme, deleteTheme } from '@/api/extend/bubble/theme'

export default {
  name: 'BubbleThemes',
  data() {
    return {
      loading: false,
      rows: [],
      visible: false,
      saving: false,
      form: {
        id: null,
        themeKey: '',
        title: '',
        minAge: 3,
        maxAge: 6,
        description: ''
      },
      rules: {
        themeKey: [{ required: true, message: '请输入 themeKey', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    }
  },
  created() { this.load() },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await listThemes({})
        if(res.data && res.data.items) {
          this.rows = res.data.items
        }
      } finally {
        this.loading = false
      }
    },
    openCreate() {
      this.form = { id: null, themeKey: '', title: '', minAge: 3, maxAge: 6, description: '' }
      this.visible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },
    openEdit(row) {
      this.form = { ...row }
      this.visible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },
    save() {
      this.$refs.formRef.validate(async ok => {
        if (!ok) return
        this.saving = true
        try {
          if (this.form.id) await updateTheme(this.form.id, this.form)
          else await createTheme(this.form)
          this.$message.success('保存成功')
          this.visible = false
          await this.load()
        } finally {
          this.saving = false
        }
      })
    },
    doDelete(row) {
      this.$confirm('确定删除该主题？', '提示', { type: 'warning' }).then(async () => {
        await deleteTheme(row.id)
        this.$message.success('已删除')
        await this.load()
      }).catch(() => { })
    }
  }
}
</script>