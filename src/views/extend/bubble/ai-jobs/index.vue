<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent="">
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="query.status" clearable placeholder="全部" style="width: 100%">
                <el-option label="排队中" value="queued" />
                <el-option label="处理中" value="processing" />
                <el-option label="成功" value="success" />
                <el-option label="失败" value="failed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="视频ID">
              <el-input v-model="query.videoId" placeholder="可选" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="QT-common-layout-main QT-flex-main" v-loading="listLoading">
        <QT-table v-loading="listLoading" :data="list">
          <template #actions>
            <div class="QT-common-head">
              <div>
                <el-alert
                  title="AI 拆解任务（只读）。失败任务可重试，详情可查看 Prompt / 输出 JSON / 错误信息。"
                  type="info"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>
          </template>

          <el-table-column prop="id" label="任务ID" min-width="170" />
          <el-table-column prop="videoId" label="视频ID" min-width="120" />
          <el-table-column prop="status" label="状态" width="110">
            <template slot-scope="scope">
              <el-tag :type="tagType(scope.row.status)" size="mini">{{ statusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="retryCount" label="重试" width="80" />
          <el-table-column prop="createdAt" label="创建时间" width="170" />
          <el-table-column prop="updatedAt" label="更新时间" width="170" />

          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="openDetail(scope.row)">详情</el-button>
              <el-button
                type="text"
                :disabled="scope.row.status !== 'failed'"
                @click="retry(scope.row)"
              >重试</el-button>
            </template>
          </el-table-column>
        </QT-table>

        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
          hide-on-single-page
        />
      </div>
    </div>

    <QT-Form v-if="formVisible" ref="QTForm" @refresh="refresh" />
  </div>
</template>

<script>
import request from '@/utils/request'
import mixins from '@/mixins/viewgrid/index.js'
import QTForm from './Form.vue'

export default {
  name: 'BubbleAiJobs',
  components: { QTForm },
  mixins: [mixins],
  data() {
    return {
      controller: '/api/bubble/admin/BubbleAdminAiJob',
      query: {
        status: '',
        videoId: ''
      }
    }
  },
  methods: {
    openDetail(row) {
      this.addOrUpdateHandle(row.id, true)
    },
    async retry(row) {
      await this.$confirm('确定重试该任务？', '提示', { type: 'warning' })
      await request({
        url: `${this.controller}/actions/retry`,
        method: 'POST',
        data: { id: row.id }
      })
      this.$message.success('已提交重试')
      this.initData()
    },
    statusText(v) {
      if (v === 'queued') return '排队中'
      if (v === 'processing') return '处理中'
      if (v === 'success') return '成功'
      if (v === 'failed') return '失败'
      return v || '-'
    },
    tagType(v) {
      if (v === 'success') return 'success'
      if (v === 'processing' || v === 'queued') return 'warning'
      if (v === 'failed') return 'danger'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
