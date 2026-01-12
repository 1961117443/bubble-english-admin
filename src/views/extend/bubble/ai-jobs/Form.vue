<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main" v-loading="loading">
      <div class="QT-common-page-header">
        <el-page-header @back="goBack" :content="formTitle" />
        <div class="options">
          <el-button
            v-if="dataForm && dataForm.id && dataForm.status === 'failed'"
            type="danger"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="retry"
          >重试</el-button>
          <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>

      <el-form ref="elForm" :model="dataForm" label-width="110px" class="main" :disabled="true">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="任务ID">
              <el-input v-model="dataForm.id" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频ID">
              <el-input v-model="dataForm.videoId" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="状态">
              <el-tag :type="tagType(dataForm.status)" size="mini">{{ statusText(dataForm.status) }}</el-tag>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型">
              <el-input v-model="dataForm.model" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Prompt(自定义)">
              <el-input v-model="dataForm.prompt" type="textarea" :rows="4" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="输出Result">
              <el-input v-model="resultText" type="textarea" :rows="10" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="dataForm.errorMessage">
            <el-form-item label="错误信息">
              <el-input v-model="dataForm.errorMessage" type="textarea" :rows="6" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </transition>
</template>

<script>
import request from '@/utils/request'
import mixins from '@/mixins/viewgrid/form.js'

export default {
  name: 'BubbleAiJobForm',
  mixins: [mixins],
  data() {
    return {
      controller: '/api/bubble/admin/AiJob',
      // 只读详情，不做编辑
      dataForm: {
        id: undefined,
        videoId: '',
        status: '',
        model: '',
        prompt: '',
        outputJson: '',
        errorMessage: ''
      },
      resultText: ''
    }
  },
  methods: {
    // 覆盖 mixin 默认的详情读取（AiJob 的 detail 是 query 参数，不是 /{id}）
    async init(id, readonly) {
      this.dataForm.id = id || undefined
      this.readonly = true
      this.visible = true
      this.loading = true
      try {
        if (!id) {
          this.loading = false
          return
        }
        const res = await request({
          url: `${this.controller}/detail`,
          method: 'GET',
          params: { id }
        })
        this.dataForm = res.data
        this.onInitAfter(this.dataForm, 'update')
      } finally {
        this.loading = false
      }
    },
    async onInit(id, readonly) {
      // 强制只读
      this.readonly = true
    },
    onInitAfter(data) {
      // 后端字段：outputJson
      const raw = data.outputJson || ''
      try {
        if (!raw) {
          this.resultText = ''
        } else if (typeof raw === 'string') {
          // raw 可能就是 JSON 字符串
          const parsed = JSON.parse(raw)
          this.resultText = JSON.stringify(parsed, null, 2)
        } else {
          this.resultText = JSON.stringify(raw, null, 2)
        }
      } catch (e) {
        this.resultText = String(raw)
      }
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
    },
    async retry() {
      await this.$confirm('确定重试该任务？', '提示', { type: 'warning' })
      this.btnLoading = true
      try {
        await request({
          url: `${this.controller}/actions/retry`,
          method: 'POST',
          data: { id: this.dataForm.id }
        })
        this.$message.success('已提交重试')
        this.refreshTableList = true
        // 重新拉取详情
        await this.init(this.dataForm.id, true)
      } finally {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
