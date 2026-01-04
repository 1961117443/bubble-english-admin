<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main">
      <div class="QT-common-page-header">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button type="primary" :loading="loading" @click="handleConfirm()">
            {{$t('common.confirmButton')}}</el-button>
          <el-button @click="goBack">{{$t('common.cancelButton')}} </el-button>
        </div>
      </div>
      <div class="authorize">
        <el-tabs type="border-card" v-model="activeTab" class="QT-el_tabs">
          <el-tab-pane v-for="item in types" :key="item.name" :label="item.label" :name="item.name">
            <el-tree :data="getTreeData(item.name)" :props="defaultProps" default-expand-all highlight-current
              :ref="item.name+'TreeBoxRef'" :expand-on-click-node="false" 
              show-checkbox
              :check-strictly="checkStrictly"
              check-on-click-node
              class="QT-common-el-tree" node-key="id"
              v-loading="loading">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>

import {getUserAuthorizeList} from '@/api/permission/user'
import { set } from 'nprogress'
export default {
  data() {
    return {
      treeData: [],
      info: [],
      activeTab: 'module',
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      loading: false,
      types: [
        { label: "菜单权限", name: "module" },
        { label: "功能权限", name: "button" },
        { label: "表单字段", name: "column" },
        { label: "显示字段", name: "form" },
        { label: "数据权限", name: "resource" },
      ],
      id:'',
      fullName:'',
      type:'',
      title:'',
      checkStrictly:true,
      dataForm:{
        module:[],
        button:[],
        column:[],
        form:[],
        resource:[],
        objectType:'User'
      }
    }
  },
  watch: {
    // activeTab(val) {
    //   this.treeData = this.info[val]
    // }
  },
  created() {
    
  },
  methods: {
    async init(id, fullName, type){
      this.id = id
      this.fullName = fullName
      this.type = type
      this.title = '禁用用户权限-'+fullName

      //清空数据
      this.types.forEach(t=>this.dataForm[t.name] = [])

      await this.getList()
      await this.getDisableList()
    },
    // 用户权限
    async getList() {
      this.loading = true
      await getUserAuthorizeList(this.id).then(res => {
        this.info = res.data;
        this.treeData = this.info.module
        this.loading = false
      })
    },
    // 禁用的用户权限
    async getDisableList(){
      this.loading = true
      try {
        await this.$request.post(`/api/permission/Authority/Disable/Data/${this.id}/Values/All`,{
          type:this.dataForm.objectType
        }).then(res=> {
          this.types.forEach(t=>this.dataForm[t.name] = res.data[t.name])
        })

        // 设置选中状态
        this.checkStrictly = true
        this.types.forEach(t=>{
          this.$refs[`${t.name}TreeBoxRef`][0].setCheckedKeys(this.dataForm[t.name])
        })
        this.checkStrictly = false

        this.loading = false
      } catch (error) {
        console.log(error)
        this.$message.error('数据加载异常！')
      }
    },
    goBack() {
      this.$emit("close");
    },
    getTreeData(type){
      return this.info[type]
    },
    async handleConfirm(){
       // 获取授权数据
       this.types.forEach(item=>{
        const parentIds = [];// this.$refs[`${item.name}TreeBoxRef`][0].getHalfCheckedKeys()
        const childrenIds = this.$refs[`${item.name}TreeBoxRef`][0].getCheckedKeys()
        let newIds = [...parentIds, ...childrenIds] //, ...this.dataForm.module

        this.dataForm[item.name] = [...new Set(newIds)]
      })

      console.log(this.dataForm)
      this.loading = true
      try {
        await this.$request({
          url:`/api/permission/Authority/Disable/Data/${this.id}`,
          method:'put',
          data:this.dataForm
        })
        this.goBack()
        this.loading = false
      } catch (error) {
        console.log(error)
        this.$message.error('数据加载异常！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.authorize {
  height: 100%;
  overflow: hidden;
  >>> .el-tabs__nav-scroll {
    padding-top: 0 !important;
  }
  >>> .el-tabs__content {
    overflow: auto;
    overflow-x: hidden;
    .el-tab-pane {
      height: auto !important;
    }
    .QT-common-el-tree {
      padding: 0;
    }
  }
}
</style>
