<template>
  <div class="BubbleVideo-container app-container">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>视频库</span>
        <div style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="openCreate">上传视频</el-button>
        </div>
      </div>

      <el-form :inline="true" :model="query" size="small" class="qt-search">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="标题/备注" clearable @keyup.enter.native="load" />
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="query.theme" placeholder="如 zoo" clearable style="width:160px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width:160px">
            <el-option label="已上传" value="uploaded" />
            <el-option label="分析中" value="analyzing" />
            <el-option label="已完成" value="done" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" v-loading="loading" border size="mini">
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="theme" label="主题" width="120" />
        <el-table-column prop="durationSec" label="时长" width="100">
          <template slot-scope="scope">
            <span>{{ formatDuration(scope.row.durationSec) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110">
          <template slot-scope="scope">
            <el-tag :type="statusTagType(scope.row.status)" size="mini">{{ statusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openDetail(scope.row)">详情</el-button>
            <el-button type="text" size="mini" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" :disabled="scope.row.status==='analyzing'" @click="doAnalyze(scope.row)">AI分析</el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="qt-page">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.page"
          @size-change="onSizeChange"
          @current-change="onPageChange" />
      </div>
    </el-card>

    <!-- 创建/编辑 -->
    <el-dialog :title="form.id ? '编辑视频' : '上传视频'" :visible.sync="formVisible" width="620px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="例如：熊猫" />
        </el-form-item>
        <el-form-item label="主题" prop="theme">
          <el-input v-model="form.theme" placeholder="例如：zoo" />
        </el-form-item>
        <el-form-item label="适龄" prop="ageRange">
          <el-select v-model="form.ageRange" placeholder="例如 3-6" style="width:100%">
            <el-option label="3-4" value="3-4" />
            <el-option label="5-6" value="5-6" />
            <el-option label="7-8" value="7-8" />
            <el-option label="3-6" value="3-6" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频文件" prop="videoFile">
          <UploadFileSingle v-model="form.videoFile" type="bubbleVideo" accept="video/*" />
          <div class="tip">上传后返回文件名，后端可据此获取文件流并进行AI分析。</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="可选" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible=false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
        <el-button v-if="form.id" :disabled="saving" @click="doAnalyze(form)" type="success" plain>保存并AI分析</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="视频详情" :visible.sync="detailVisible" width="780px" :close-on-click-modal="false">
      <div v-if="detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
          <el-descriptions-item label="主题">{{ detail.theme }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(detail.status)" size="mini">{{ statusText(detail.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="适龄">{{ detail.ageRange }}</el-descriptions-item>
          <el-descriptions-item label="文件">{{ detail.videoFile }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.createdAt }}</el-descriptions-item>
        </el-descriptions>
        <div style="margin-top:12px" v-if="detail.previewUrl">
          <video :src="detail.previewUrl" controls style="width:100%;max-height:380px;background:#000" />
        </div>
        <div style="margin-top:12px">
          <el-button type="primary" size="small" :disabled="detail.status==='analyzing'" @click="doAnalyze(detail)">发起AI分析</el-button>
          <el-button size="small" @click="openJobs(detail)">查看AI任务</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible=false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import UploadFileSingle from '@/components/Upload/UploadFileSingle.vue'
import { listVideos, createVideo, updateVideo, deleteVideo, analyzeVideo, getVideo } from '@/api/extend/bubble/video'

export default {
  name: 'BubbleVideoIndex',
  components: { UploadFileSingle },
  data() {
    return {
      loading: false,
      saving: false,
      rows: [],
      total: 0,
      query: { page: 1, pageSize: 10, keyword: '', theme: '', status: '' },

      formVisible: false,
      form: { id: '', title: '', theme: '', ageRange: '3-6', videoFile: '', remark: '' },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        theme: [{ required: true, message: '请输入主题Key', trigger: 'blur' }],
        ageRange: [{ required: true, message: '请选择适龄', trigger: 'change' }],
        videoFile: [{ required: true, message: '请先上传视频文件', trigger: 'change' }]
      },

      detailVisible: false,
      detail: null
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await listVideos(this.query)
        // 兼容常见返回：{data:{list,total}} 或 {data:{rows,total}} 或 {data:list}
        const data = res.data || {}
        const list = data.list || data.rows || data.items || (Array.isArray(data) ? data : [])
        this.rows = list
        this.total = data.total || list.length || 0
      } catch (e) {
        this.$message.error(e.message || '加载失败')
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.query = { page: 1, pageSize: 10, keyword: '', theme: '', status: '' }
      this.load()
    },
    onSizeChange(v) {
      this.query.pageSize = v
      this.query.page = 1
      this.load()
    },
    onPageChange(v) {
      this.query.page = v
      this.load()
    },

    openCreate() {
      this.form = { id: '', title: '', theme: '', ageRange: '3-6', videoFile: '', remark: '' }
      this.formVisible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },
    openEdit(row) {
      this.form = { id: row.id, title: row.title, theme: row.theme, ageRange: row.ageRange || '3-6', videoFile: row.videoFile || '', remark: row.remark || '' }
      this.formVisible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },
    async save() {
      this.$refs.formRef.validate(async ok => {
        if (!ok) return
        this.saving = true
        try {
          if (this.form.id) {
            await updateVideo(this.form.id, this.form)
          } else {
            await createVideo(this.form)
          }
          this.$message.success('保存成功')
          this.formVisible = false
          this.load()
        } catch (e) {
          this.$message.error(e.message || '保存失败')
        } finally {
          this.saving = false
        }
      })
    },

    async openDetail(row) {
      this.detailVisible = true
      this.detail = null
      try {
        const res = await getVideo(row.id)
        this.detail = res.data || row
      } catch (e) {
        this.detail = row
      }
    },

    async doDelete(row) {
      try {
        await this.$confirm('确定删除该视频记录？（不会删除文件存储）', '提示', { type: 'warning' })
        await deleteVideo(row.id)
        this.$message.success('已删除')
        this.load()
      } catch (_) {}
    },

    async doAnalyze(row) {
      const id = row.id || this.form.id
      if (!id) {
        this.$message.warning('请先保存视频')
        return
      }
      try {
        await analyzeVideo(id)
        this.$message.success('已提交AI分析任务')
        this.load()
        if (this.detailVisible && this.detail && this.detail.id === id) {
          const res = await getVideo(id)
          this.detail = res.data
        }
      } catch (e) {
        this.$message.error(e.message || '提交失败')
      }
    },

    openJobs(row) {
      // 路由由后端动态配置，这里只提供跳转意图
      this.$router.push({ path: '/extend/bubble/ai-jobs', query: { videoId: row.id } })
    },

    statusText(v) {
      if (v === 'uploaded') return '已上传'
      if (v === 'analyzing') return '分析中'
      if (v === 'done') return '已完成'
      if (v === 'failed') return '失败'
      return v || '-'
    },
    statusTagType(v) {
      if (v === 'done') return 'success'
      if (v === 'analyzing') return 'warning'
      if (v === 'failed') return 'danger'
      return ''
    },
    formatDuration(sec) {
      if (!sec && sec !== 0) return '-'
      const s = parseInt(sec, 10)
      const m = Math.floor(s / 60)
      const r = s % 60
      return `${m}:${String(r).padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.qt-search { margin-bottom: 10px; }
.qt-page { margin-top: 10px; text-align: right; }
.tip { color: #909399; font-size: 12px; margin-top: 6px; }
</style>
