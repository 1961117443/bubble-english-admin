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
          <el-col :span="8">
            <el-form-item label="类型" prop="type">
              <el-select v-model="dataForm.type" placeholder="请选择" clearable style="width: 100%">
                <el-option label="单词" value="word" />
                <el-option label="句子" value="sentence" />
                <el-option label="知识" value="knowledge" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="minAge" prop="minAge">
              <el-input-number v-model="dataForm.minAge" :min="3" :max="8" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源视频" prop="sourceVideoId">
              <el-input v-model="dataForm.sourceVideoId" placeholder="可选" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Text" prop="text">
              <el-input v-model="dataForm.text" placeholder="例如: panda" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="释义" prop="meaning">
              <el-input v-model="dataForm.meaning" placeholder="例如: 熊猫" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Assets" prop="assetsJson">
              <el-input v-model="dataForm.assetsJson" type="textarea" :rows="6" placeholder='JSON，例如 {"audio":"/xx.mp3","image":"/xx.png"}' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </transition>
</template>

<script>
import mixins from '@/mixins/viewgrid/form.js'

export default {
  name: 'BubbleAdminUnitForm',
  mixins: [mixins],
  data() {
    return {
      dataForm: {
        id: undefined,
        type: 'word',
        text: '',
        meaning: '',
        minAge: 3,
        assetsJson: '',
        sourceVideoId: ''
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        text: [{ required: true, message: '请输入Text', trigger: 'blur' }],
        minAge: [{ required: true, message: '请输入minAge', trigger: 'change' }]
      }
    }
  },
  methods: {
    onInitAfter(data) {
      // 兼容后端返回 JSON 对象
      if (data.assetsJson && typeof data.assetsJson === 'object') {
        this.dataForm.assetsJson = JSON.stringify(data.assetsJson, null, 2)
      }
    },
    onSubmitBefore(payload) {
      if (payload.assetsJson && typeof payload.assetsJson === 'string') {
        const t = payload.assetsJson.trim()
        if (t) {
          try {
            payload.assetsJson = JSON.parse(t)
          } catch (e) {
            this.$message.warning('AssetsJson 不是合法 JSON，将按字符串提交')
          }
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
