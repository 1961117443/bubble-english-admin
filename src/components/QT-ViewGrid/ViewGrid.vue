<template>
    <div class="QT-common-layout">
      <div class="QT-common-layout-center">
        <el-row class="QT-common-search-box" :gutter="16">
          <el-form @submit.native.prevent="">
            <slot name="search" :query="query"></slot>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()"
                  >查询</el-button
                >
                <el-button icon="el-icon-refresh-right" @click="reset()"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="QT-common-layout-main QT-flex-main">
          <QT-table v-loading="listLoading" :data="list">
            <template #actions>
              <div class="QT-common-head">
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addOrUpdateHandle()"
                    v-has="'btn_add'"
                    >新增</el-button
                  >
                </div>
              </div>
            </template>
            <slot name="columns"></slot>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="addOrUpdateHandle(scope.row.id)"
                  v-has="'btn_edit'"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="handleDel(scope.row.id)"
                  class="QT-table-delBtn"
                  v-has="'btn_remove'"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click="addOrUpdateHandle(scope.row.id, true)"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </QT-table>
          <pagination
            :total="total"
            :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize"
            @pagination="initData"
          />
        </div>
      </div>
      <QT-Form v-if="formVisible" ref="QTForm" @refresh="refresh">
    
      </QT-Form>
      <qt-export-form
        v-if="exportBoxVisible"
        ref="ExportBox"
        @download="download"
      ></qt-export-form>
    </div>
  </template>
  <script>
  import request from "@/utils/request";
  import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
  import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
  import QTForm from "./Form";
  import mixins from "@/mixins/viewgrid/index.js";
  export default {
    components: { QTForm },
    mixins: [mixins],
    data() {
      return {
        query: {
  
        },
      };
    },
    computed: {
      menuId() {
        return this.$route.meta.modelId || "";
      },
    },
    created() {
      // this.initData()
    },
    methods: {
    },
  };
  </script>