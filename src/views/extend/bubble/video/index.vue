<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent="">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="query.keyword" placeholder="标题/备注" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主题">
              <el-input v-model="query.themeKey" placeholder="如 zoo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="query.status" placeholder="全部" clearable style="width: 100%">
                <el-option label="已上传" value="uploaded" />
                <el-option label="分析中" value="analyzing" />
                <el-option label="已完成" value="done" />
                <el-option label="失败" value="failed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="QT-common-layout-main QT-flex-main" v-loading="listLoading">
        <QT-table v-loading="listLoading" :data="list">
          <template #actions>
            <div class="QT-common-head">
              <div>
                <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" v-has="'btn_add'">上传视频</el-button>
              </div>
            </div>
          </template>

          <el-table-column prop="title" label="标题" min-width="180" align="left" />
          <el-table-column prop="themeKey" label="主题" width="120" align="left" />
          <el-table-column prop="durationSec" label="时长" width="110" align="left">
            <template slot-scope="scope">
              <span>{{ formatDuration(scope.row.durationSec) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="left">
            <template slot-scope="scope">
              <el-tag :type="statusTagType(scope.row.status)" size="mini">{{ statusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="170" align="left" :formatter="qt.tableDateFormatFull" />

          <el-table-column label="操作" fixed="right" width="360">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, true)">详情</el-button>
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)" v-has="'btn_edit'">编辑</el-button>
              <el-dropdown trigger="click" @command="(cmd) => onAction(cmd, scope.row)" style="margin: 0 6px;">
                <span class="el-dropdown-link">
                  <el-button type="text">流水线<i class="el-icon-arrow-down el-icon--right" /></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="asr">1) ASR 字幕</el-dropdown-item>
                  <el-dropdown-item command="analyze">2) AI 分析</el-dropdown-item>
                  <el-dropdown-item command="unitAudio">3) Unit 音频</el-dropdown-item>
                  <el-dropdown-item divided command="run">一键 Run(ASR→AI→音频)</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="text" :disabled="scope.row.status === 'analyzing'" @click="analyze(scope.row)">AI分析(旧)</el-button>
              <el-button type="text" class="QT-table-delBtn" @click="handleDel(scope.row.id)" v-has="'btn_remove'">删除</el-button>
            </template>
          </el-table-column>
        </QT-table>

        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
          hide-on-single-page
        />
      </div>
    </div>

    <QT-Form v-if="formVisible" ref="QTForm" @refresh="refresh" />
  </div>
</template>

<script>
import QTForm from './Form.vue'
import mixins from '@/mixins/viewgrid/index.js'

export default {
  name: 'BubbleAdminVideoIndex',
  components: { QTForm },
  mixins: [mixins],
  data() {
    return {
      controller: '/api/bubble/admin/Video',
      pipelineController: '/api/bubble/admin/Pipeline',
      query: {
        keyword: '',
        themeKey: '',
        status: ''
      }
    }
  },
  methods: {
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
      return `${m}:${r.toString().padStart(2, '0')}`
    },
    async analyze(row) {
      await this.$confirm('确认发起 AI 分析？', '提示', { type: 'warning' })
      await this.$request({
        url: `${this.controller}/actions/analyze`,
        method: 'post',
        data: { videoId: row.id }
      })
      this.$message.success('已提交 AI 分析')
      this.initData()
    },
    async onAction(cmd, row) {
      if (!row || !row.id) return
      const videoId = row.id
      if (cmd === 'asr') {
        await this.$confirm('确认生成 ASR 字幕（whisper）？', '提示', { type: 'warning' })
        await this.$request({
          url: `${this.pipelineController}/actions/asr`,
          method: 'post',
          data: { videoId }
        })
        this.$message.success('已提交 ASR 任务')
        this.initData()
        return
      }
      if (cmd === 'analyze') {
        await this.$confirm('确认发起 AI 分析（Pipeline）？', '提示', { type: 'warning' })
        await this.$request({
          url: `${this.pipelineController}/actions/analyze`,
          method: 'post',
          data: { videoId }
        })
        this.$message.success('已提交 AI 分析任务')
        this.initData()
        return
      }
      if (cmd === 'unitAudio') {
        await this.$confirm('确认生成 Unit 音频（sentence切片 + word TTS）？', '提示', { type: 'warning' })
        await this.$request({
          url: `${this.pipelineController}/actions/unit-audio`,
          method: 'post',
          data: { videoId }
        })
        this.$message.success('已提交 Unit 音频任务')
        return
      }
      if (cmd === 'run') {
        await this.$confirm('确认一键 Run（ASR→AI→音频）？', '提示', { type: 'warning' })
        await this.$request({
          url: `${this.pipelineController}/actions/run`,
          method: 'post',
          data: { videoId }
        })
               this.$message.success('已提交流水线 Run')
        this.initData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
