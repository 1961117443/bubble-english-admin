<template>
  <div class="BubbleUnits-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>内容单元（Units）</span>
        <div style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="openCreate">新增</el-button>
        </div>
      </div>

      <el-form :inline="true" :model="query" size="small" class="qt-search">
        <el-form-item label="类型">
          <el-select v-model="query.type" clearable placeholder="全部" style="width:160px">
            <el-option label="word" value="word" />
            <el-option label="sentence" value="sentence" />
            <el-option label="knowledge" value="knowledge" />
          </el-select>
        </el-form-item>
        <el-form-item label="最小年龄">
          <el-select v-model="query.minAge" clearable placeholder="全部" style="width:160px">
            <el-option label="3" :value="3" />
            <el-option label="4" :value="4" />
            <el-option label="5" :value="5" />
            <el-option label="6" :value="6" />
            <el-option label="7" :value="7" />
            <el-option label="8" :value="8" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="text/meaning" clearable @keyup.enter.native="load" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" border size="mini" v-loading="loading">
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column prop="text" label="文本" min-width="220" />
        <el-table-column prop="meaning" label="释义" min-width="220" />
        <el-table-column prop="minAge" label="minAge" width="90" />
        <el-table-column label="资源" width="140">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.assets && scope.row.assets.audio" size="mini">audio</el-tag>
            <el-tag v-if="scope.row.assets && scope.row.assets.image" size="mini" type="success">image</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="qt-page">
        <el-pagination background layout="total, prev, pager, next, sizes" :total="total"
          :page-size="query.pageSize" :current-page="query.page" @size-change="onSizeChange" @current-change="onPageChange" />
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog :title="form.id ? '编辑Unit' : '新增Unit'" :visible.sync="formVisible" width="720px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="word" value="word" />
            <el-option label="sentence" value="sentence" />
            <el-option label="knowledge" value="knowledge" />
          </el-select>
        </el-form-item>
        <el-form-item label="text" prop="text">
          <el-input v-model="form.text" />
        </el-form-item>
        <el-form-item label="meaning">
          <el-input v-model="form.meaning" />
        </el-form-item>
        <el-form-item label="minAge" prop="minAge">
          <el-input-number v-model="form.minAge" :min="3" :max="8" />
        </el-form-item>

        <el-divider content-position="left">Assets</el-divider>
        <el-form-item label="audio">
          <el-input v-model="form.assets.audio" placeholder="/static/audio/xxx.mp3 或 文件名" />
        </el-form-item>
        <el-form-item label="image">
          <el-input v-model="form.assets.image" placeholder="/static/img/xxx.png 或 文件名" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible=false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUnits, createUnit, updateUnit, deleteUnit } from '@/api/extend/bubble/unit'

export default {
  name: 'bubbleUnits',
  data() {
    return {
      query: { page: 1, pageSize: 10, type: '', minAge: null, keyword: '' },
      rows: [],
      total: 0,
      loading: false,
      formVisible: false,
      saving: false,
      form: this.emptyForm(),
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        text: [{ required: true, message: '请输入 text', trigger: 'blur' }],
        minAge: [{ required: true, message: '请输入 minAge', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    emptyForm() {
      return { id: '', type: 'word', text: '', meaning: '', minAge: 3, assets: { audio: '', image: '' } }
    },
    async load() {
      this.loading = true
      try {
        const res = await listUnits(this.query)
        const data = res.data || res
        this.rows = data.items || data.list || data || []
        this.total = data.total || this.rows.length || 0
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.query = { page: 1, pageSize: 10, type: '', minAge: null, keyword: '' }
      this.load()
    },
    onSizeChange(ps) { this.query.pageSize = ps; this.query.page = 1; this.load() },
    onPageChange(p) { this.query.page = p; this.load() },

    openCreate() {
      this.form = this.emptyForm()
      this.formVisible = true
    },
    openEdit(row) {
      this.form = {
        id: row.id,
        type: row.type,
        text: row.text,
        meaning: row.meaning,
        minAge: row.minAge,
        assets: { ...(row.assets || {}) }
      }
      if (!this.form.assets) this.form.assets = { audio: '', image: '' }
      this.formVisible = true
    },
    save() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const payload = { ...this.form, assets: { ...(this.form.assets || {}) } }
          if (payload.id) await updateUnit(payload.id, payload)
          else await createUnit(payload)
          this.$message.success('已保存')
          this.formVisible = false
          this.load()
        } finally {
          this.saving = false
        }
      })
    },
    doDelete(row) {
      this.$confirm(`确定删除该Unit：${row.text}？`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteUnit(row.id)
          this.$message.success('已删除')
          this.load()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.qt-search { margin-bottom: 10px; }
.qt-page { margin-top: 10px; text-align: right; }
</style>
