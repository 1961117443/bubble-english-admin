<template>
  <div class="QT-common-layout">
    <div class="QT-common-layout-left">
      <div class="QT-common-title">
        <h2>{{$t('common.organization')}}</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-qt icon-qt-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div class="QT-common-tree-search-box">
        <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable />
      </div>
      <el-scrollbar class="QT-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
          highlight-current :expand-on-click-node="false" node-key="id"
          @node-click="handleNodeClick" class="QT-common-el-tree" v-if="refreshTree"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text" :title="data.fullName">{{data.fullName}}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="QT-common-layout-center QT-flex-main">
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
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-qt icon-qt-Refresh QT-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <QT-table v-loading="listLoading" :data="tableData">
          <el-table-column prop="fullName" label="岗位名称" width="200" />
          <el-table-column prop="enCode" label="岗位编码" width="150" />
          <el-table-column prop="type" label="岗位类型" width="100" />
          <el-table-column prop="department" label="所属组织" min-width="150" show-overflow-tooltip />
          <el-table-column prop="creatorTime" :formatter="qt.tableDateFormat" label="创建时间"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handleUserRelation(scope.row.id, scope.row.fullName)">
                      {{$t('position.postMember')}}
                    </el-dropdown-item>
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <UserRelationList v-if="userRelationListVisible" ref="UserRelationList"
      @refreshDataList="getOrganizeList" />
    <DeleteForm ref="deleteFormRef" @delete="deleteHandle"></DeleteForm>
  </div>
</template>

<script>
import { getDepartmentSelector } from '@/api/permission/department'
import { getPositionList, delPosition,delPositionByWay } from '@/api/permission/position'
import Form from './Form'
import Diagram from '@/views/permission/user/Diagram'
import UserRelationList from './userRelation'
import DeleteForm from '../organize/DeleteForm.vue'
export default {
  name: 'permission-position',
  components: { Form, UserRelationList, Diagram,DeleteForm },
  data() {
    return {
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      type: '',
      listQuery: {
        organizeId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getOrganizeList(true)
  },
  methods: {
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    getOrganizeList(isInit) {
      this.treeLoading = true
      getDepartmentSelector().then(res => {
        this.treeData = res.data.list
        this.$nextTick(() => {
          this.treeLoading = false
          if (isInit) this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.listLoading = true
      getPositionList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery = {
        ...this.listQuery,
        currentPage: 1,
        pageSize: 20
      }
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    handleNodeClick(data) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      this.type = data.type
      this.reset()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.type === 'department' ? this.listQuery.organizeId : '')
      })
    },
    removeUserRelationList(isRefresh) {
      this.userRelationListVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    handleDel(id) {
      this.$refs.deleteFormRef.showDialog(id)
      // this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
      //   type: 'warning'
      // }).then(() => {
      //   delPosition(id).then(res => {
      //     this.$message({
      //       type: 'success',
      //       message: res.msg,
      //       duration: 1500,
      //       onClose: () => {
      //         this.initData()
      //       }
      //     })
      //   })
      // }).catch(() => { })
    },
    handleUserRelation(id, fullName) {
      this.userRelationListVisible = true
      this.$nextTick(() => {
        this.$refs.UserRelationList.init(id, fullName)
      })
    },
    deleteHandle(id,way){
      delPositionByWay(id,way).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
    }
  }
}
</script>
