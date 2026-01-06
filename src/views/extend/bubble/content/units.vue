<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent="">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="query.keyword" placeholder="text/meaning" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="query.type" placeholder="全部" clearable style="width:100%">
                <el-option label="单词" value="word" />
                <el-option label="句子" value="sentence" />
                <el-option label="知识" value="knowledge" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最小年龄">
              <el-input-number v-model="query.minAge" :min="3" :max="8" controls-position="right" style="width:100%" />
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
                <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" v-has="'btn_add'">新增</el-button>
              </div>
            </div>
          </template>

          <el-table-column prop="type" label="类型" width="110" align="left">
            <template slot-scope="scope">
              <span>{{ typeText(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="text" label="Text" min-width="200" align="left" />
          <el-table-column prop="meaning" label="释义" min-width="200" align="left" />
          <el-table-column prop="minAge" label="minAge" width="90" align="left" />
          <el-table-column prop="sourceVideoId" label="来源视频" width="120" align="left" />
          <el-table-column prop="createdAt" label="创建时间" width="170" align="left" />

          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, true)">详情</el-button>
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)" v-has="'btn_edit'">编辑</el-button>
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
import QTForm from './editor.vue'
import mixins from '@/mixins/viewgrid/index.js'

export default {
  name: 'BubbleAdminUnits',
  components: { QTForm },
  mixins: [mixins],
  data() {
    return {
      controller: '/api/bubble/admin/Unit',
      query: {
        keyword: '',
        type: '',
        minAge: 3
      }
    }
  },
  methods: {
    typeText(v) {
      if (v === 'word') return '单词'
      if (v === 'sentence') return '句子'
      if (v === 'knowledge') return '知识'
      return v || '-'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
