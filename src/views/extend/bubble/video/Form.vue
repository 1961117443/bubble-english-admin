<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main" v-loading="loading">
      <div class="QT-common-page-header">
        <el-page-header @back="goBack" :content="formTitle" />
        <div class="options">
          <template v-if="!readonly">
            <el-button type="primary" @click="dataFormSubmit(true)" :loading="btnLoading" :disabled="btnLoading">保存</el-button>
          </template>
          <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>

      <el-form ref="elForm" :model="dataForm" :rules="rules" label-width="100px" class="main" :disabled="readonly">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="dataForm.title" placeholder="例如：熊猫" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题Key" prop="themeKey">
              <el-input v-model="dataForm.themeKey" placeholder="例如：zoo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适龄" prop="ageRange">
              <el-select v-model="dataForm.ageRange" placeholder="请选择" clearable style="width: 100%">
                <el-option label="3-4" value="3-4" />
                <el-option label="5-6" value="5-6" />
                <el-option label="7-8" value="7-8" />
                <el-option label="3-6" value="3-6" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频文件" prop="fileUrl">
              <UploadFileSingle v-model="dataForm.fileUrl" type="bubbleVideo" accept="video/*" />
              <div class="tip">上传后返回文件名（或URL），后端据此进行 AI 分析。</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="dataForm.remark" type="textarea" :rows="3" placeholder="可选" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </transition>
</template>

<script>
import mixins from '@/mixins/viewgrid/form.js'
import UploadFileSingle from '@/components/Upload/UploadFileSingle.vue'

export default {
  name: 'BubbleAdminVideoForm',
  components: { UploadFileSingle },
  mixins: [mixins],
  data() {
    return {
      dataForm: {
        id: undefined,
        title: '',
        themeKey: '',
        ageRange: '3-6',
        fileUrl: '',
        remark: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        themeKey: [{ required: true, message: '请输入主题Key', trigger: 'blur' }],
        ageRange: [{ required: true, message: '请选择适龄', trigger: 'change' }],
        fileUrl: [{ required: true, message: '请先上传视频文件', trigger: 'change' }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}
</style>
