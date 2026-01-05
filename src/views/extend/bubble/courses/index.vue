<template>
  <div class="BubbleCourses-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>课程管理（Course v2）</span>
        <div style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="openCreate">新建课程</el-button>
        </div>
      </div>

      <el-form :inline="true" :model="query" size="small" class="qt-search">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="课程名/ID" clearable @keyup.enter.native="load" />
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="query.theme" placeholder="zoo" clearable style="width:160px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" style="width:160px">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" v-loading="loading" border size="mini">
        <el-table-column prop="title" label="课程名" min-width="200" />
        <el-table-column prop="courseId" label="CourseId" width="160" />
        <el-table-column prop="theme" label="主题" width="120" />
        <el-table-column prop="status" label="状态" width="110">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==='published'?'success':''" size="mini">
              {{ scope.row.status==='published'?'已发布':'草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170" />
        <el-table-column label="操作" width="360" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="goEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="preview(scope.row)">预览</el-button>
            <el-button type="text" size="mini" v-if="scope.row.status!=='published'" @click="publish(scope.row)">发布</el-button>
            <el-button type="text" size="mini" v-else @click="unpublish(scope.row)">下架</el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="qt-page">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.page"
          @size-change="onSizeChange"
          @current-change="onPageChange" />
      </div>
    </el-card>

    <el-dialog title="课程预览" :visible.sync="previewVisible" width="860px" :close-on-click-modal="false">
      <div v-if="previewData">
        <el-alert type="info" :closable="false" show-icon>
          <div>预览仅用于运营检查：根据年龄段模拟过滤 units，并展示 flow.byUnitType 的 stepTemplate。</div>
        </el-alert>
        <div style="margin-top:10px">
          <el-radio-group v-model="previewAge" size="small" @change="buildPreview">
            <el-radio-button label="3-4" />
            <el-radio-button label="5-6" />
            <el-radio-button label="7-8" />
          </el-radio-group>
        </div>
        <el-descriptions :column="2" border size="small" style="margin-top:10px">
          <el-descriptions-item label="课程">{{ previewData.title }}</el-descriptions-item>
          <el-descriptions-item label="主题">{{ previewData.theme }}</el-descriptions-item>
          <el-descriptions-item label="Units数">{{ previewUnits.length }}</el-descriptions-item>
          <el-descriptions-item label="Flow">{{ JSON.stringify(previewData.flow && previewData.flow.byUnitType || {}) }}</el-descriptions-item>
        </el-descriptions>
        <el-table :data="previewUnits" size="mini" border style="margin-top:10px">
          <el-table-column prop="unitIndex" label="#" width="60" />
          <el-table-column prop="type" label="类型" width="110" />
          <el-table-column prop="text" label="文本" min-width="220" />
          <el-table-column prop="meaning" label="释义" min-width="220" />
          <el-table-column prop="minAge" label="minAge" width="90" />
          <el-table-column label="步骤" min-width="220">
            <template slot-scope="scope">
              <span>{{ stepsFor(scope.row.type).join(' → ') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewVisible=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listCourses, deleteCourse, publishCourse, unpublishCourse, getCourse } from '@/api/extend/bubble/course'

export default {
  name: 'BubbleCourses',
  data() {
    return {
      query: { keyword: '', theme: '', status: '', page: 1, pageSize: 20 },
      rows: [], total: 0, loading: false,
      previewVisible: false, previewData: null, previewAge: '3-4', previewUnits: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    reset() {
      this.query = { keyword: '', theme: '', status: '', page: 1, pageSize: 20 }
      this.load()
    },
    onSizeChange(v) { this.query.pageSize = v; this.load() },
    onPageChange(v) { this.query.page = v; this.load() },
    async load() {
      this.loading = true
      try {
        const res = await listCourses(this.query)
        this.rows = (res.data && res.data.list) || res.data || []
        this.total = (res.data && res.data.total) || this.rows.length
      } finally {
        this.loading = false
      }
    },
    openCreate() {
      this.$router.push({ path: '/extend/bubble/courses/editor', query: {} })
    },
    goEdit(row) {
      this.$router.push({ path: '/extend/bubble/courses/editor', query: { id: row.id } })
    },
    async remove(row) {
      await this.$confirm('确定删除该课程？')
      await deleteCourse(row.id)
      this.$message.success('已删除')
      this.load()
    },
    async publish(row) {
      await publishCourse(row.id)
      this.$message.success('已发布')
      this.load()
    },
    async unpublish(row) {
      await unpublishCourse(row.id)
      this.$message.success('已下架')
      this.load()
    },
    async preview(row) {
      const res = await getCourse(row.id)
      this.previewData = res.data
      this.previewAge = '3-4'
      this.buildPreview()
      this.previewVisible = true
    },
    buildPreview() {
      const course = this.previewData
      const ageMax = this.previewAge === '3-4' ? 4 : this.previewAge === '5-6' ? 6 : 8
      const units = (course && course.units) || []
      this.previewUnits = units
        .filter(u => (u.minAge || 0) <= ageMax)
        .map((u, idx) => ({ ...u, unitIndex: idx + 1 }))
    },
    stepsFor(unitType) {
      const by = (this.previewData && this.previewData.flow && this.previewData.flow.byUnitType) || {}
      const steps = by[unitType] || []
      return steps.map(s => (typeof s === 'string' ? s : (s.type || s.stepType || 'step')))
    }
  }
}
</script>

<style lang="scss" scoped>
.qt-search { margin-bottom: 10px; }
.qt-page { margin-top: 10px; text-align: right; }
</style>
