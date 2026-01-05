<template>
  <div class="BubbleUnitEditor-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑 Unit' : '新增 Unit' }}</span>
        <div style="float:right">
          <el-button size="small" icon="el-icon-back" @click="$router.back()">返回</el-button>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width:720px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="word/sentence" style="width:100%">
            <el-option label="word" value="word" />
            <el-option label="sentence" value="sentence" />
            <el-option label="knowledge" value="knowledge" />
          </el-select>
        </el-form-item>
        <el-form-item label="文本" prop="text">
          <el-input v-model="form.text" />
        </el-form-item>
        <el-form-item label="释义/说明">
          <el-input v-model="form.meaning" />
        </el-form-item>
        <el-form-item label="最小年龄" prop="minAge">
          <el-input-number v-model="form.minAge" :min="3" :max="8" />
          <span style="margin-left:10px;color:#909399">（3-8）</span>
        </el-form-item>
        <el-form-item label="图片">
          <UploadFileSingle v-model="form.image" type="bubbleUnitImage" accept="image/*" />
        </el-form-item>
        <el-form-item label="音频">
          <UploadFileSingle v-model="form.audio" type="bubbleUnitAudio" accept="audio/*" />
        </el-form-item>
        <el-form-item label="来源视频ID">
          <el-input v-model="form.videoId" placeholder="可选" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="save">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadFileSingle from '@/components/Upload/UploadFileSingle'
import { getUnit, createUnit, updateUnit } from '@/api/extend/bubble/unit'

export default {
  name: 'bubbleUnitEditor',
  components: { UploadFileSingle },
  data() {
    return {
      id: this.$route.query.id || '',
      loading: false,
      saving: false,
      form: {
        type: 'word',
        text: '',
        meaning: '',
        minAge: 3,
        image: '',
        audio: '',
        videoId: ''
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        text: [{ required: true, message: '请输入文本', trigger: 'blur' }],
        minAge: [{ required: true, message: '请输入最小年龄', trigger: 'change' }]
      }
    }
  },
  created() {
    if (this.id) this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await getUnit(this.id)
        this.form = { ...this.form, ...(res.data || res) }
      } finally {
        this.loading = false
      }
    },
    save() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          if (this.id) {
            await updateUnit(this.id, this.form)
          } else {
            const res = await createUnit(this.form)
            const id = (res.data && res.data.id) || res.id
            if (id) this.id = id
          }
          this.$message.success('已保存')
          this.$router.back()
        } finally {
          this.saving = false
        }
      })
    }
  }
}
</script>
