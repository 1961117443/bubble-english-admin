<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent="">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="query.keyword" placeholder="主题Key / 名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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

          <el-table-column prop="themeKey" label="主题Key" align="left" min-width="140" />
          <el-table-column prop="name" label="主题名称" align="left" min-width="160" />
          <el-table-column label="适龄" align="left" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.minAge }}-{{ scope.row.maxAge }}岁</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="left" min-width="220" show-overflow-tooltip />
          <el-table-column prop="updatedAt" label="更新时间" align="left" width="170" />

          <el-table-column label="操作" fixed="right" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)" v-has="'btn_edit'">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id)" class="QT-table-delBtn" v-has="'btn_remove'">删除</el-button>
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, true)">详情</el-button>
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
import QTForm from "./Form.vue";
import mixins from "@/mixins/viewgrid/index.js";

export default {
  name: "BubbleThemeIndex",
  components: { QTForm },
  mixins: [mixins],
  data() {
    return {
      controller: "/api/bubble/admin/Theme",
      query: {
        keyword: ""
      }
    };
  },
  methods: {
    async loadData() {
      // 主题页暂无字典数据
    },
    // 可选：列表数据请求前加工 query
    beforeQuery(q) {
      return true;
    }
  }
};
</script>
