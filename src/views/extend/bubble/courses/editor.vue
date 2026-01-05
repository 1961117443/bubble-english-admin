<template>
  <div class="BubbleCourseEditor-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑课程' : '新建课程' }}</span>
        <div style="float:right">
          <el-button size="small" icon="el-icon-back" @click="$router.back()">返回</el-button>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-loading="loading">
        <el-form-item label="课程ID" prop="idStr">
          <el-input v-model="form.idStr" placeholder="例如 course-panda-01" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="主题" prop="theme">
          <el-input v-model="form.theme" placeholder="zoo" />
        </el-form-item>
        <el-form-item label="适龄" prop="ageRange">
          <el-select v-model="form.ageRange" style="width:100%">
            <el-option label="3-4" value="3-4" />
            <el-option label="5-6" value="5-6" />
            <el-option label="7-8" value="7-8" />
            <el-option label="3-6" value="3-6" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问等级" prop="accessLevel">
          <el-select v-model="form.accessLevel" style="width:100%">
            <el-option label="免费 free" value="free" />
            <el-option label="进阶 advanced" value="advanced" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">Units 编排</el-divider>
        <el-form-item label="选择 Units">
          <el-select v-model="selectedUnitIds" multiple filterable remote reserve-keyword :remote-method="remoteUnits" :loading="unitLoading" placeholder="搜索 text" style="width:100%">
            <el-option v-for="u in unitOptions" :key="u.id" :label="u.text + ' (' + u.type + ')'
              " :value="u.id" />
          </el-select>
          <div class="tip">选择后会写入 course.units（最小结构：id/type/text/meaning/minAge/assets）。</div>
        </el-form-item>

        <el-form-item label="Units 排序">
          <el-table :data="form.units" size="mini" border>
            <el-table-column prop="type" label="类型" width="110" />
            <el-table-column prop="text" label="文本" min-width="200" />
            <el-table-column prop="minAge" label="minAge" width="90" />
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="move(scope.$index, -1)">上移</el-button>
                <el-button type="text" size="mini" @click="move(scope.$index, 1)">下移</el-button>
                <el-button type="text" size="mini" style="color:#f56c6c" @click="removeUnit(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-divider content-position="left">流程模板</el-divider>
        <el-form-item label="Word Steps">
          <el-input v-model="form.flowWord" placeholder="listen,play" />
        </el-form-item>
        <el-form-item label="Sentence Steps">
          <el-input v-model="form.flowSentence" placeholder="listen,speak" />
        </el-form-item>

        <el-divider content-position="left">奖励</el-divider>
        <el-form-item label="星星" prop="rewardStars">
          <el-input-number v-model="form.rewardStars" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="金币" prop="rewardCoins">
          <el-input-number v-model="form.rewardCoins" :min="0" :max="999" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="save">保存</el-button>
          <el-button v-if="id" type="success" plain :loading="saving" @click="publish">发布</el-button>
          <el-button v-if="id" type="warning" plain :loading="saving" @click="unpublish">下架</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCourse, createCourse, updateCourse, publishCourse, unpublishCourse } from '@/api/extend/bubble/course'
import { listUnits } from '@/api/extend/bubble/unit'

export default {
  name: 'BubbleCourseEditor',
  data() {
    return {
      id: this.$route.query.id || '',
      loading: false,
      saving: false,
      form: {
        idStr: '',
        title: '',
        theme: '',
        ageRange: '3-6',
        accessLevel: 'free',
        units: [],
        flowWord: 'listen,play',
        flowSentence: 'listen,speak',
        rewardStars: 2,
        rewardCoins: 8
      },
      rules: {
        idStr: [{ required: true, message: '请输入课程ID', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      selectedUnitIds: [],
      unitOptions: [],
      unitLoading: false
    }
  },
  watch: {
    selectedUnitIds: {
      handler() {
        this.syncUnitsFromSelected()
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
        const res = await getCourse(this.id)
        const d = res.data || res
        this.form.idStr = d.idStr || d.id || this.id
        this.form.title = d.title || ''
        this.form.theme = d.theme || ''
        this.form.ageRange = d.ageRange || '3-6'
        this.form.accessLevel = (d.access && d.access.level) || d.accessLevel || 'free'
        this.form.units = d.units || []
        this.form.flowWord = (d.flow && d.flow.byUnitType && d.flow.byUnitType.word && d.flow.byUnitType.word.join(',')) || 'listen,play'
        this.form.flowSentence = (d.flow && d.flow.byUnitType && d.flow.byUnitType.sentence && d.flow.byUnitType.sentence.join(',')) || 'listen,speak'
        this.form.rewardStars = (d.reward && d.reward.stars) || 2
        this.form.rewardCoins = (d.reward && d.reward.coin) || 8
        this.selectedUnitIds = this.form.units.map(u => u.id)
      } finally {
        this.loading = false
      }
    },
    async remoteUnits(keyword) {
      if (!keyword) return
      this.unitLoading = true
      try {
        const res = await listUnits({ keyword, page: 1, pageSize: 20 })
        this.unitOptions = (res.data && res.data.list) || res.data || []
      } finally {
        this.unitLoading = false
      }
    },
    async syncUnitsFromSelected() {
      // 已存在的保持顺序；新增的追加
      const existing = this.form.units || []
      const keep = existing.filter(u => this.selectedUnitIds.includes(u.id))
      const addIds = this.selectedUnitIds.filter(id => !existing.some(u => u.id === id))
      if (addIds.length === 0) {
        this.form.units = keep
        return
      }

      // 拉一次单位详情（用 listUnits 关键词为空也行，后端最好支持 ids 查询；这里简化）
      // 先从 options 里取
      const addUnits = addIds.map(id => {
        const o = this.unitOptions.find(x => x.id === id)
        return o ? this.toCourseUnit(o) : { id, type: 'word', text: '', meaning: '', minAge: 3, assets: {} }
      })

      this.form.units = [...keep, ...addUnits]
    },
    toCourseUnit(u) {
      return {
        id: u.id,
        type: u.type,
        text: u.text,
        meaning: u.meaning,
        minAge: u.minAge,
        assets: u.assets || {}
      }
    },
    move(index, delta) {
      const arr = this.form.units
      const to = index + delta
      if (to < 0 || to >= arr.length) return
      const t = arr[index]
      arr.splice(index, 1)
      arr.splice(to, 0, t)
    },
    removeUnit(index) {
      const u = this.form.units[index]
      this.form.units.splice(index, 1)
      this.selectedUnitIds = this.form.units.map(x => x.id)
      // 保留 select 不强制清空 option
    },
    buildPayload() {
      return {
        idStr: this.form.idStr,
        title: this.form.title,
        theme: this.form.theme,
        ageRange: this.form.ageRange,
        access: { level: this.form.accessLevel, theme: this.form.theme },
        units: this.form.units,
        flow: {
          byUnitType: {
            word: this.form.flowWord.split(',').map(s => s.trim()).filter(Boolean),
            sentence: this.form.flowSentence.split(',').map(s => s.trim()).filter(Boolean)
          }
        },
        reward: { stars: this.form.rewardStars, coin: this.form.rewardCoins }
      }
    },
    save() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const payload = this.buildPayload()
          if (this.id) await updateCourse(this.id, payload)
          else {
            const res = await createCourse(payload)
            this.id = (res.data && res.data.id) || payload.idStr
          }
          this.$message.success('保存成功')
        } finally {
          this.saving = false
        }
      })
    },
    async publish() {
      this.saving = true
      try {
        await publishCourse(this.id)
        this.$message.success('已发布')
      } finally {
        this.saving = false
      }
    },
    async unpublish() {
      this.saving = true
      try {
        await unpublishCourse(this.id)
        this.$message.success('已下架')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip { color: #909399; font-size: 12px; margin-top: 6px; }
</style>
