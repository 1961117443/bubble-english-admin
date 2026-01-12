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
              <el-upload
                class="uploader"
                action="#"
                :auto-upload="false"
                :limit="1"
                :file-list="fileList"
                accept="video/*"
                :on-change="onFileChange"
                :on-remove="onFileRemove"
              >
                <el-button size="small" icon="el-icon-upload">选择视频</el-button>
                <div slot="tip" class="tip">
                  说明：这里不走通用文件中心上传，而是随“保存”一起上传到 BubbleEnglish 的本地目录，确保 ASR/AI 可直接读取。
                </div>
              </el-upload>
              <div v-if="dataForm.fileUrl" class="tip">已保存的文件：{{ dataForm.fileUrl }}</div>
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
import request from '@/utils/request'

export default {
  name: 'BubbleAdminVideoForm',
  mixins: [mixins],
  data() {
    return {
      controller: '/api/bubble/admin/Video',
      fileList: [],
      fileRaw: null,
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
  },
  methods: {
    onFileChange(file, fileList) {
      // 仅保留最后一个
      this.fileList = (fileList || []).slice(-1)
      this.fileRaw = file && file.raw ? file.raw : null
      // 给校验字段一个“已选择”占位（实际保存后会变成后端返回的 fileUrl）
      if (this.fileRaw) this.dataForm.fileUrl = this.fileRaw.name
    },
    onFileRemove() {
      this.fileList = []
      this.fileRaw = null
      this.dataForm.fileUrl = ''
    },
    // 覆盖 mixin 的提交：新增使用 multipart 上传 + 创建；编辑仍走 JSON
    dataFormSubmit() {
      this.$refs['elForm'].validate(async (valid) => {
        if (!valid) return

        this.btnLoading = true
        try {
          if (!this.dataForm.id) {
            if (!this.fileRaw) {
              this.$message.error('请先选择视频文件')
              return
            }
            const fd = new FormData()
            fd.append('title', this.dataForm.title || '')
            fd.append('themeKey', this.dataForm.themeKey || '')
            fd.append('ageRange', this.dataForm.ageRange || '')
            fd.append('remark', this.dataForm.remark || '')
            fd.append('file', this.fileRaw)

            const res = await request({
              url: `${this.controller}/actions/createWithUpload`,
              method: 'POST',
              data: fd,
              headers: { 'Content-Type': 'multipart/form-data' }
            })

            this.$message({
              message: res.msg || '保存成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('refresh', true)
              }
            })
          } else {
            // 编辑：沿用原来的 JSON 更新
            const data = JSON.parse(JSON.stringify(this.dataForm))
            const { submit } = this.getApi()
            await request({
              url: `${submit}/${this.dataForm.id}`,
              method: 'PUT',
              data
            })
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('refresh', true)
              }
            })
          }
        } finally {
          this.btnLoading = false
        }
      })
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
