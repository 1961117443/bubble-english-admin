<template>
  <div class="BubbleAiJob-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>AI 分析任务</span>
      </div>

      <el-form :inline="true" :model="query" size="small" class="qt-search">
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" style="width:160px">
            <el-option label="处理中" value="processing" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频ID">
          <el-input v-model="query.videoId" placeholder="可选" style="width:200px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" v-loading="loading" border size="mini">
        <el-table-column prop="id" label="任务ID" min-width="160" />
        <el-table-column prop="videoId" label="视频ID" min-width="140" />
        <el-table-column prop="status" label="状态" width="110">
          <template slot-scope="scope">
            <el-tag :type="tagType(scope.row.status)" size="mini">{{ statusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="模型" width="140" />
        <el-table-column prop="cost" label="成本" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openDetail(scope.row)">详情</el-button>
            <el-button type="text" size="mini" :disabled="scope.row.status!=='failed'" @click="retry(scope.row)">重试</el-button>
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

    <el-dialog title="任务详情" :visible.sync="detailVisible" width="820px" :close-on-click-modal="false">
      <AiJobDetail v-if="detailVisible" :job-id="detailId" />
    </el-dialog>
  </div>
</template>

<script>
import { listJobs, retryJob } from '@/api/extend/bubble/aiJob'
import AiJobDetail from './parts/JobDetail.vue'

export default {
  name: 'BubbleAiJobs',
  components: { AiJobDetail },
  data() {
    return {
      loading: false,
      rows: [],
      total: 0,
      query: { page: 1, pageSize: 10, status: '', videoId: '' },
      detailVisible: false,
      detailId: ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await listJobs(this.query)
        const data = res.data || res
        this.rows = data.list || data.items || []
        this.total = data.total || 0
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.query = { page: 1, pageSize: 10, status: '', videoId: '' }
      this.load()
    },
    onPageChange(p) { this.query.page = p; this.load() },
    onSizeChange(s) { this.query.pageSize = s; this.query.page = 1; this.load() },
    openDetail(row) {
      this.detailId = row.id
      this.detailVisible = true
    },
    async retry(row) {
      await this.$confirm('确定重试该任务？失败日志将保留。', '提示')
      await retryJob(row.id)
      this.$message.success('已提交重试')
      this.load()
    },
    statusText(v) {
      if (v === 'processing') return '处理中'
      if (v === 'success') return '成功'
      if (v === 'failed') return '失败'
      return v || '-'
    },
    tagType(v) {
      if (v === 'success') return 'success'
      if (v === 'processing') return 'warning'
      if (v === 'failed') return 'danger'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.qt-search { margin-bottom: 10px; }
.qt-page { margin-top: 10px; text-align: right; }
</style>
