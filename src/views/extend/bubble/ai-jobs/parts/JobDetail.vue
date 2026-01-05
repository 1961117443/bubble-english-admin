<template>
  <div class="BubbleAiJobDetail">
    <el-skeleton :loading="loading" animated>
      <template>
        <el-descriptions v-if="job" :column="2" border size="small">
          <el-descriptions-item label="任务ID">{{ job.id }}</el-descriptions-item>
          <el-descriptions-item label="视频ID">{{ job.videoId }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="tagType(job.status)" size="mini">{{ statusText(job.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="模型">{{ job.model || '-' }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ job.durationMs || '-' }}ms</el-descriptions-item>
          <el-descriptions-item label="成本">{{ job.cost || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ job.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ job.updatedAt }}</el-descriptions-item>
        </el-descriptions>

        <div style="margin-top:12px">
          <el-tabs v-model="tab">
            <el-tab-pane label="输出预览" name="output">
              <el-input type="textarea" :rows="12" v-model="outputText" readonly />
            </el-tab-pane>
            <el-tab-pane label="日志" name="log">
              <el-input type="textarea" :rows="12" v-model="logText" readonly />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { getJob } from '@/api/extend/bubble/aiJob'
export default {
  name: 'BubbleAiJobDetailPart',
  props: { jobId: { type: [String, Number], required: true } },
  data() {
    return { loading: false, job: null, tab: 'output' }
  },
  computed: {
    outputText() {
      if (!this.job) return ''
      const v = this.job.outputJson || this.job.output || this.job.result
      try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2) } catch (e) { return String(v || '') }
    },
    logText() {
      if (!this.job) return ''
      return this.job.log || this.job.logs || this.job.error || ''
    }
  },
  watch: { jobId: { immediate: true, handler() { this.load() } } },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await getJob(this.jobId)
        this.job = res.data || res
      } finally {
        this.loading = false
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
