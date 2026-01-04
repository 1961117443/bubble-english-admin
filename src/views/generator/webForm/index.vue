<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="query.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属分类">
              <el-select v-model="category" placeholder="请选择所属分类" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="QT-common-layout-main QT-flex-main">
        <div class="QT-common-head">
          <topOpts @add="openAddBox()" addText="新建模板" />
          <div class="QT-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-qt icon-qt-Refresh QT-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <QT-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="150" />
          <el-table-column prop="enCode" label="编码" min-width="200" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="webType" label="模式" width="70" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.webType == 1">表单</span>
              <span v-if="scope.row.webType == 2">列表</span>
              <span v-if="scope.row.webType == 3">流程</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorUser" label="创建人" width="150" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="qt.tableDateFormat"
            width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="qt.tableDateFormat"
            width="120" />
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="toggleWebType(scope.row)">更改模式
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制模板</el-dropdown-item>
                    <el-dropdown-item @click.native="download(scope.row)">下载代码</el-dropdown-item>
                    <el-dropdown-item @click.native="qtPreview(scope.row)">预览代码</el-dropdown-item>
                    <el-dropdown-item @click.native="qtDownload(scope.row)">生成代码</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </QT-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <AddBox :visible.sync="addVisible" :webType="currWebType" @add="handleAdd" />
    <Preview v-if="previewVisible" ref="preview" @close="previewVisible=false" />
    <DownloadForm v-if="downloadFormVisible" ref="downloadForm"
      @close="downloadFormVisible=false" />
    <qt-download-form v-if="qtDownloadFormVisible" ref="qtDownloadLocalForm" @ok="handleDownloadLocal" />
    <qt-download-form v-if="qtPreviewVisible" ref="qtPreview" @ok="handlePreview" />
  </div>
</template>

<script>
import Form from './Form'
import AddBox from '@/views/generator/AddBox'
import DownloadForm from '../DownloadForm'
import Preview from '../Preview'
import mixin from '@/mixins/generator/index'
import QtDownloadForm from '../QtDownloadForm.vue'
import { DownloadCodeLocal } from '@/api/onlineDev/visualDev'
export default {
  name: 'generator-webForm',
  mixins: [mixin],
  components: { Form, AddBox, DownloadForm, Preview,QtDownloadForm },
  data() {
    return {
      query: { keyword: '', type: 4 },
      previewVisible: false,
      downloadFormVisible: false,
      sort: 'webForm',
      qtDownloadFormVisible:false,
      editRow: undefined,
      qtPreviewVisible:false
    }
  },
  methods: {
    download(row) {
      this.downloadFormVisible = true
      this.$nextTick(() => {
        this.$refs.downloadForm.init(row.tables, row.id,undefined,row)
      })
    },
    preview(row) {
      this.previewVisible = true
      this.qtPreviewVisible = false
      this.$nextTick(() => {
        this.$refs.preview.init(row.tables, row.id)
      })
    },
    qtPreview(row){
      this.qtPreviewVisible = true
      this.editRow = row
      this.$nextTick(() => {
        this.$refs.qtPreview.init(row.tables, row.id,undefined,row)
      })
    },
    handlePreview(q){
      this.qtPreviewVisible = false
      let row = this.editRow
      if (row) {
        this.previewVisible = true
        this.$nextTick(() => {
          this.$refs.preview.init(row.tables, row.id,q)
        })
      }
    },
    qtDownload(row){
      this.qtDownloadFormVisible = true
      this.editRow = row
      this.$nextTick(() => {
        this.$refs.qtDownloadLocalForm.init(row.tables, row.id,undefined,row)
      })
    },
    handleDownloadLocal(q){
      this.qtDownloadFormVisible = false
      let row = this.editRow
      if (row) {
        DownloadCodeLocal(row.id,q).then(res=> this.$message.success(res.msg))
      }
    }
  }
}
</script>