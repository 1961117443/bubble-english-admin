<template>
  <div class="BubbleAiJobDetail-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>任务详情</span>
        <div style="float:right">
          <el-button size="small" icon="el-icon-back" @click="$router.back()">返回</el-button>
          <el-button size="small" type="primary" :disabled="loading" @click="load">刷新</el-button>
          <el-button size="small" type="warning" plain :disabled="job && job.status==='processing'" @click="doRetry">重试</el-button>
        </div>
      </div>

      <el-skeleton v-if="loading" rows="6" animated />
      <div v-else-if="job">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="任务ID">{{ job.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="tagType(job.status)" size="mini">{{ statusText(job.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="视频ID">{{ job.videoId }}</el-descriptions-item>
          <el-descriptions-item label="模型">{{ job.model || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ job.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ job.elapsedMs ? (job.elapsedMs + 'ms') : '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">输出预览（JSON）</el-divider>
        <el-input type="textarea" :rows="16" v-model="jsonText" readonly />

        <el-divider content-position="left">日志</el-divider>
        <el-input type="textarea" :rows="10" v-model="logText" readonly />
      </div>

      <el-empty v-else description="未找到任务" />
    </el-card>
  </div>
</template>

<script>
import { getJob, retryJob } from '@/api/extend/bubble/aiJob'

export default {
  name: 'BubbleAiJobDetail',
  data() {
    return {
      loading: false,
      job: null,
      jsonText: '',
      logText: ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      const id = this.$route.query.id || this.$route.params.id
      if (!id) return
      this.loading = true
      try {
        const res = await getJob(id)
        this.job = (res && res.data) || null
        this.jsonText = this.job && this.job.outputJson ? this.pretty(this.job.outputJson) : ''
        this.logText = this.job && this.job.log ? String(this.job.log) : ''
      } finally {
        this.loading = false
      }
    },
    async doRetry() {
      if (!this.job) return
      await this.$confirm('确定重试该任务吗？').catch(() => null)
      try {
        await retryJob(this.job.id)
        this.$message.success('已提交重试')
        this.load()
      } catch (e) {
        // ignore
      }
    },
    pretty(v) {
      try {
        if (typeof v === 'string') {
          const obj = JSON.parse(v)
          return JSON.stringify(obj, null, 2)
        }
        return JSON.stringify(v, null, 2)
      } catch {
        return typeof v === 'string' ? v : JSON.stringify(v, null, 2)
      }
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
