<template>
  <div class="BubbleDashboard-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix"><span>BubbleEnglish 内容运营</span></div>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card><div class="kpi"><div class="kpi-title">视频</div><div class="kpi-value">{{ kpi.video }}</div></div></el-card>
        </el-col>
        <el-col :span="8">
          <el-card><div class="kpi"><div class="kpi-title">AI任务</div><div class="kpi-value">{{ kpi.job }}</div></div></el-card>
        </el-col>
        <el-col :span="8">
          <el-card><div class="kpi"><div class="kpi-title">课程</div><div class="kpi-value">{{ kpi.course }}</div></div></el-card>
        </el-col>
      </el-row>
      <el-alert style="margin-top:12px" type="warning" title="当前面板为占位，可在后端提供统计接口后接入。" :closable="false" />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BubbleDashboard',
  data() {
    return { kpi: { video: '-', job: '-', course: '-' } }
  }
}
</script>

<style lang="scss" scoped>
.kpi{display:flex;justify-content:space-between;align-items:center}
.kpi-title{color:#909399}
.kpi-value{font-size:22px;font-weight:700}
</style>
