<template>
  <div class="BubbleProjectSettings-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>项目设置（占位）</span>
      </div>
      <el-alert type="warning" :closable="false" title="该页面用于配置 AI 模型、并发、默认 Prompt 模板等。当前仅做占位，后端接口就绪后再接入。" />
      <el-form label-width="120px" style="margin-top:12px" :model="form">
        <el-form-item label="默认模型">
          <el-input v-model="form.model" placeholder="例如 gpt-4.1 / deepseek" />
        </el-form-item>
        <el-form-item label="最大并发">
          <el-input-number v-model="form.concurrency" :min="1" :max="50" />
        </el-form-item>
        <el-form-item label="默认 Prompt">
          <el-input v-model="form.prompt" type="textarea" :rows="6" placeholder="占位" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSave">保存（占位）</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'bubbleProjectSettings',
  data() {
    return { form: { model: '', concurrency: 5, prompt: '' } }
  },
  methods: {
    onSave() {
      this.$message.success('已保存（占位）')
      console.log('[bubble.project.settings] save', this.form)
    }
  }
}
</script>
