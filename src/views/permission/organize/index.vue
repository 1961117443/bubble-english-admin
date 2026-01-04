<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-center  QT-flex-main">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')"
                clearable @keyup.enter.native="search()" />
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
          <topOpts @add="addOrUpdateHandle()" />
          <div class="QT-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text"
                icon="icon-qt icon-qt-btn-expand QT-common-head-icon" :underline="false"
                @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text"
                icon="icon-qt icon-qt-btn-collapse QT-common-head-icon" :underline="false"
                @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-qt icon-qt-Refresh QT-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <QT-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable"
          :default-expand-all="expands" :tree-props="{children: 'children', hasChildren: ''}">
          <el-table-column prop="fullName" label="名称" />
          <el-table-column prop="enCode" label="编码" />
          <el-table-column prop="description" label="说明" />
          <el-table-column prop="creatorTime" :formatter="qt.tableDateFormat" label="创建时间"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini" type="text">
                      {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openGradeForm(scope.row)">
                      分级管理
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </QT-table>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="closeForm" />
    <gradeForm v-if="gradeFormVisible" ref="gradeForm" @close="gradeFormVisible=false" />
    <DeleteForm ref="deleteFormRef" @delete="deleteHandle"></DeleteForm>
  </div>
</template>

<script>
import {
  getOrganizeList,
  delOrganize,
  delOrganizeByWay
} from '@/api/permission/organize'
import Form from './Form'
import GradeForm from './GradeForm'
import DeleteForm from './DeleteForm.vue'

export default {
  name: 'permission-organize',
  components: { Form, GradeForm,DeleteForm },
  data() {
    return {
      listQuery: {
        keyword: ''
      },
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      gradeFormVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      getOrganizeList(this.listQuery).then(res => {
        this.treeList = res.data.list
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    search() {
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    toggleExpand() {
      this.refreshTable = false;
      this.expands = !this.expands;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    openGradeForm(row) {
      this.gradeFormVisible = true
      this.$nextTick(() => {
        this.$refs.gradeForm.init(row.id, row.fullName)
      })
    },
    handleDel(id) {
      this.$refs.deleteFormRef.showDialog(id)
      // this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
      //   type: 'warning'
      // }).then(() => {
      //   delOrganize(id).then(res => {
      //     this.$message({
      //       type: 'success',
      //       message: res.msg,
      //       duration: 1500,
      //       onClose: () => {
      //         this.$store.commit('generator/SET_COMPANY_TREE', [])
      //         this.$store.commit('generator/SET_DEP_TREE', [])
      //         this.initData()
      //       }
      //     })
      //   })
      // }).catch(() => { })
    },
    deleteHandle(id,way){
      delOrganizeByWay(id,way).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.$store.commit('generator/SET_COMPANY_TREE', [])
              this.$store.commit('generator/SET_DEP_TREE', [])
              this.initData()
            }
          })
        })
    }
  }
}
</script>
