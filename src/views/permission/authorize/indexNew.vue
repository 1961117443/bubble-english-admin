<template>
  <div class="app-container QT-flex-main authorize-container">
    <div>      
      <el-alert title="确定提交后，不会覆盖已有的权限，如果需要去掉权限，请到角色管理单独进行操作！" type="error" :closable="false" />
    </div>
    <div style="display: flex;justify-content:space-between;height:100%">
      <div class="QT-common-layout-left" style="width: 20%;">
        <div class="QT-common-title">
          <!-- <el-radio-group v-model="radio" @change="loadPermissionData()">
            <el-radio :label="0" border>按角色</el-radio>
            <el-radio :label="1" border>按用户</el-radio>
          </el-radio-group> -->
          <el-tabs v-model="radio" type="card" @tab-click="loadPermissionData()">
            <el-tab-pane label="按角色" name="0"></el-tab-pane>
            <el-tab-pane label="按用户" name="1"></el-tab-pane>
          </el-tabs>
          <span class="options">
            <el-dropdown>
              <el-button plain size="large">
                {{$t('authorize.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="loadPermissionData()">刷新数据</el-dropdown-item>
                <template v-if="radio==0">
                  <el-dropdown-item @click.native="setRoleAllExpand('open')">展开全部</el-dropdown-item>
                  <el-dropdown-item @click.native="setRoleAllExpand('close')">折叠全部</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <el-scrollbar v-if="radio == 0" class="QT-common-el-tree-scrollbar" v-loading="objectTreeLoading">
          <el-tree :data="roleTreeAllData" ref="roleTree" v-loading="objectTreeLoading" show-checkbox default-expand-all
            node-key="onlyId" :props="defaultProps" check-on-click-node :expand-on-click-node="false">
            <span slot-scope="{ node, data }">
              <i :class="data.icon" />
              <span style="padding-left: 4px;">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
        <template v-else >
          <div class="QT-common-tree-search-box">
            <el-input
              placeholder="输入关键字"
              v-model="filterText"
              suffix-icon="el-icon-search"
              clearable
              @keypress.enter.native="getUserList()"
            />
          </div>
          <QT-table v-loading="objectTreeLoading" :data="roleTreeAllData" hasC :selectedRows="userCheckList" :hasNO="false">
            <el-table-column prop="account" label="账号" />
            <el-table-column prop="realName" label="姓名"  />
            <!-- <el-table-column prop="enabledMark" label="状态" width="70" align="center">
              <template slot-scope="scope">
                <el-tag type="success" disable-transitions v-if="scope.row.enabledMark == 1">正常
                </el-tag>
                <el-tag type="warning" disable-transitions v-else-if="scope.row.enabledMark == 2">锁定
                </el-tag>
                <el-tag type="danger" disable-transitions v-else>禁用</el-tag>
              </template>
            </el-table-column> -->
          </QT-table>
          <pagination :total="userListQuery.total" :page.sync="userListQuery.currentPage"
            :limit.sync="userListQuery.pageSize" @pagination="loadPermissionData()" />
        </template>
        
      </div>
      <div class="QT-common-layout-left" style="width: 30%;border-left:10px solid #ebeef5;border-right:10px solid #ebeef5">
        <div class="QT-common-title">
          <!-- <el-radio-group v-model="menuRadio">
            <el-radio label="Web" border>PC端导航菜单</el-radio>
            <el-radio label="App" border>移动端导航菜单</el-radio>
          </el-radio-group> -->
          <el-tabs v-model="menuRadio" type="card">
            <el-tab-pane label="PC端导航菜单" name="Web"></el-tab-pane>
            <el-tab-pane label="移动端导航菜单" name="App"></el-tab-pane>
          </el-tabs>
          <span class="options">
            <el-dropdown style="margin-right: 8px">
              <el-button plain size="large">
                {{$t('authorize.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getAuthorizeList(0)">刷新</el-dropdown-item>
                <el-dropdown-item @click.native="handleCheck('checkAll')"> {{ $t('authorize.checkAll') }}
                </el-dropdown-item>
                <el-dropdown-item @click.native="handleCheck('cancelCheckAll')">
                  {{ $t('authorize.deselectAll') }}</el-dropdown-item>
                <el-dropdown-item @click.native="setAllExpand('open')">{{ $t('authorize.expandAll') }}
                </el-dropdown-item>
                <el-dropdown-item @click.native="setAllExpand('close')">{{ $t('authorize.foldAll') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <el-scrollbar class="QT-common-el-tree-scrollbar" v-loading="moduleTreeLoading">
          <el-tree :data="moduleAuthorizeTree" ref="authorizeTree" v-loading="moduleTreeLoading" show-checkbox default-expand-all
            node-key="id" :check-strictly="checkStrictly" check-on-click-node :props="defaultProps"
            :expand-on-click-node="false" @check-change="selectTreeNodeClick"
            :filter-node-method="filterAuthorizeTree">
            <span slot-scope="{ node, data }">
              <i :class="data.icon" />
              <span style="padding-left: 4px;">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="QT-common-layout-left" style="width: 50%;">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick" style="height: 100%" v-loading="authTreeLoading" >
          <el-tab-pane v-for="item in types" :key="item.name" :label="item.label" :name="item.name" style="height: calc(100% - 50px)">
            <el-scrollbar class="QT-common-el-tree-scrollbar" style="height: 100%;">
              <el-tree :data="getAuthorizeTree(item.name)" :ref="item.name+'AuthorizeTree'" show-checkbox default-expand-all
                node-key="id" :check-strictly="checkStrictly" check-on-click-node :props="defaultProps"
                :expand-on-click-node="false">
                <span slot-scope="{ node, data }">
                  <i :class="data.icon" />
                  <span style="padding-left: 4px;">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane disabled name="99">
            <span slot="label">
              <span class="options">
                <el-dropdown style="margin-right: 20px">                  
                  <el-button plain size="mini">
                    {{$t('authorize.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="authDataRefresh()">刷新</el-dropdown-item>
                    <el-dropdown-item @click.native="handleCheck('checkAll','auth')"> {{ $t('authorize.checkAll') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleCheck('cancelCheckAll','auth')">
                      {{ $t('authorize.deselectAll') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="setAllExpand('open','auth')">{{ $t('authorize.expandAll') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="setAllExpand('close','auth')">{{ $t('authorize.foldAll') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <el-button type="primary" size="mini" :loading="btnLoading" @click="handleConfirm()">确定</el-button>
            </span>            
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleSelectorByPermission } from '@/api/permission/role'
import { getAuthorizeValues, updateBatchAuthorize,getAuthorizeValuesAll } from '@/api/permission/authorize'

export default {
  name: 'permission-authorize',
  data() {
    return {
      radio: 0,
      menuRadio:'Web',
      active: 0,
      filterText:'',
      objectTreeLoading:false,
      moduleTreeLoading:false,
      authTreeLoading:false,
      
      treeLoading: false,
      btnLoading: false,
      checkStrictly: true,
      objectId: 0,
      params: {
        type: 'module',
        moduleIds: ''
      },
      dataForm: {
        roleIds: [],
        module: [],
        button: [],
        column: [],
        form: [],
        resource: [],
        userIds: [],
        objectType :'Role',
        cover:false
      },
      roleTreeAllData: [],
      roleAllIds: [],
      positionTreeData: [],
      authorizeTreeData: [],
      moduleAuthorizeTree: [],
      buttonAuthorizeTree: [],
      columnAuthorizeTree: [],
      formAuthorizeTree: [],
      resourceAuthorizeTree: [],
      moduleAllData: [],
      buttonAllData: [],
      columnAllData: [],
      formAllData: [],
      resourceAllData: [],
      moduleIdsTemp: [],
      defaultProps: { // 配置项（必选）
        value: 'id',
        label: 'fullName',
        children: 'children',
        disabled: 'disabled'
      },
      userListQuery:{
        currentPage:1,
        pageSize:10,
        total:0
      },
      activeName:'',
      //'button','column','form','resource'
      types: [
        { label:'功能权限',name:'button' },
        { label:'表单字段',name:'column' },
        { label:'显示字段',name:'form' },
        { label:'数据权限',name:'resource' }
      ],
      hasLoadAuthData:false,
      userCheckList:[]
    }
  },
  created() {
    this.initData()
  },
  mounted() {
  },
  // computed: {
  //   _moduleAuthorizeTree(){
  //     if (this.menuRadio == 'App') {
  //       return this.moduleAuthorizeTree.filter(item => item.id == '1');
  //     }
  //     return this.moduleAuthorizeTree.filter(item => item.id != '1');
  //   }
  // },
  watch:{
    menuRadio:{
      handler(val){
        this.$refs.authorizeTree.filter(val)
      }
    }
  },
  methods: {
    initData() {
      Object.assign(this.$data, this.$options.data())
      this.getAuthorizeList(0)
      this.loadPermissionData()
    },
    loadPermissionData() {
      // 清空当前选中的授权对象
      if (this.radio == 0) {
        this.dataForm.roleIds = []
        this.dataForm.objectType = 'Role'
        this.getRoleList()
      }else{
        this.userCheckList = []
        this.dataForm.objectType = 'User'
        this.getUserList()
      }
    },
    getAuthorizeTree(name){
      return this[`${name}AuthorizeTree`]
    },
    getRoleList() {
      this.objectTreeLoading = true
      getRoleSelectorByPermission().then(res => {
        let ids = []
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            ids.push(item.onlyId)
            if (item.children && item.children.length) {
              loop(item.children)
            }
          }
        }
        loop(res.data.list)
        this.roleAllIds = ids
        this.roleTreeAllData = res.data.list
        this.objectTreeLoading = false
      }).catch(() => {
        this.objectTreeLoading = false
      })
    },
    // 获取用户列表
    getUserList(){
      this.objectTreeLoading = true
      this.$request({
        url:'/api/permission/Users',
        method:'get',
        data:{
          currentPage: this.userListQuery.currentPage,
          pageSize: this.userListQuery.pageSize,
          keyword:this.filterText
        }        
      }).then(res => {
        // let ids = []
        // const loop = list => {
        //   for (let i = 0; i < list.length; i++) {
        //     const item = list[i]
        //     ids.push(item.onlyId)
        //     if (item.children && item.children.length) {
        //       loop(item.children)
        //     }
        //   }
        // }
        // loop(res.data.list)
        // this.roleAllIds = ids
        this.roleTreeAllData = res.data.list
        this.userListQuery.total = res.data.pagination.total
        // console.log(res)
        this.objectTreeLoading = false
      }).catch(() => {
        this.objectTreeLoading = false
      })
    },
    getAuthorizeList(active) {
      this.treeLoading = true
      if (active==0) {
        this.moduleTreeLoading = true
      }else{
        this.authTreeLoading = true
      }
      // this.authorizeTreeData = []
      getAuthorizeValues(this.objectId, this.params).then(res => {
        switch (active) {
          case 0:
            this.moduleAuthorizeTree = res.data.list
            this.moduleAllData = res.data.all
            // this.authorizeTreeData = this.moduleAuthorizeTree
            const moduleIds = [...this.moduleIdsTemp, ...res.data.ids]
            this.dataForm.module = [...new Set(moduleIds)]
            this.moduleIdsTemp = this.dataForm.module
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.module)
            this.$nextTick(()=>this.$refs.authorizeTree.filter(this.menuRadio))
            break
          case 1:
            this.buttonAuthorizeTree = res.data.list
            this.buttonAllData = res.data.all
            // this.authorizeTreeData = this.buttonAuthorizeTree
            this.dataForm.button = [...this.dataForm.button, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.button)
            break
          case 2:
            this.columnAuthorizeTree = res.data.list
            this.columnAllData = res.data.all
            // this.authorizeTreeData = this.columnAuthorizeTree
            this.dataForm.column = [...this.dataForm.column, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.column)
            break
          case 3:
            this.formAuthorizeTree = res.data.list
            this.formAllData = res.data.all
            // this.authorizeTreeData = this.formAuthorizeTree
            this.dataForm.form = [...this.dataForm.form, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.form)
            break
          case 4:
            this.resourceAuthorizeTree = res.data.list
            this.resourceAllData = res.data.all
            // this.authorizeTreeData = this.resourceAuthorizeTree
            this.dataForm.resource = [...this.dataForm.resource, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.resource)
            break
        }
        this.checkStrictly = false
        
        if (active==0) {
          this.moduleTreeLoading = false
        }else{
          this.authTreeLoading = false
        }
        
      }).catch(() => {
        if (active==0) {
          this.moduleTreeLoading = false
        }else{
          this.authTreeLoading = false
        }
      })
    },
    // 全选/全不选
    handleCheck(val,auth) {
      if (val === 'checkAll') {        
        if (auth) {
          const refName =`${this.activeName}AuthorizeTree`
          const dataName = `${this.activeName}AllData`
          if (this.$refs[refName]) {
            this.$refs[refName][0].setCheckedKeys(this[dataName])
          }
        }else{
          this.$refs.authorizeTree.setCheckedKeys(this.moduleAllData)
        }
      }
      if (val === 'cancelCheckAll') {
        if (auth) {
          const refName =`${this.activeName}AuthorizeTree`
          if (this.$refs[refName]) {
            this.$refs[refName][0].setCheckedKeys([])
          }
        }else if (this.active === 5) {
          this.$refs.roleTree.setCheckedKeys([])
        } else {
          this.$refs.authorizeTree.setCheckedKeys([])
        }
      }
    },
    // 折叠 展开
    setAllExpand(state,auth) {
      let result
      if (state === 'open') {
        result = true
      }
      if (state === 'close') {
        result = false
      }
      let nodes
     
      if (auth) {
        const refName =`${this.activeName}AuthorizeTree`
        if (this.$refs[refName]) {
          nodes=  this.$refs[refName][0].store.nodesMap
        }
      }else if (this.active === 5) {
        nodes = this.$refs.roleTree.store.nodesMap
      } else {
        nodes = this.$refs.authorizeTree.store.nodesMap
      }

      for (let i in nodes) {
        nodes[i].expanded = result
      }
    },
    handleInitData() {
      this.checkStrictly = true
      this.treeLoading = true
      switch (this.active) {
        case 0:
          this.params.type = 'module'
          break
        case 1:
          this.params.type = 'button'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 2:
          this.params.type = 'column'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 3:
          this.params.type = 'form'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 4:
          this.params.type = 'resource'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 5:
          this.getRoleList()
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys(this.dataForm.roleIds)
          })
          break
      }
      if (this.active !== 5) {
        this.getAuthorizeList(this.active)
      } else {
        this.treeLoading = false
      }
    },
    // 设置数据
    selectTreeNodeClick() {
      // let dataIds = []
      // if (this.active !== 5) {
      //   const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys()
      //   const childrenIds = this.$refs.authorizeTree.getCheckedKeys()
      //   const newIds = [...parentIds, ...childrenIds]
      //   dataIds = [...new Set(newIds)]
      // }
      // switch (this.active) {
      //   case 0:
      //     this.dataForm.module = dataIds
      //     this.moduleIdsTemp = this.dataForm.module
      //     break
      //   case 1:
      //     this.dataForm.button = dataIds
      //     break
      //   case 2:
      //     this.dataForm.column = dataIds
      //     break
      //   case 3:
      //     this.dataForm.form = dataIds
      //     break
      //   case 4:
      //     this.dataForm.resource = dataIds
      //     break
      //   case 5:
      //     let nodes = this.$refs.roleTree.getCheckedNodes()
      //     this.dataForm.roleIds = nodes.map(o => o.id)
      //     break
      // }

      //清空授权数据
      this.activeName = ''
      this.hasLoadAuthData = false
      for (let index = 0; index < this.types.length; index++) {
        const t = this.types[index].name;
        this[`${t}AuthorizeTree`] =[]
        this[`${t}AllData`] = []
        this.dataForm[t] = []
      }

    },
    async handleConfirm() {
      if (!this.hasLoadAuthData) {
        try {
          await this.handleClick()
        } catch (error) {
          return this.$message.error("请选择授权类型");
        }
      }

      if (this.radio == 0) {
        let nodes = this.$refs.roleTree.getCheckedNodes()
        this.dataForm.roleIds = nodes.map(o => o.id)
      }else{
        this.dataForm.userIds = this.userCheckList.map(x=>x.id)
      }

      if (this.dataForm.roleIds.length == 0 && this.dataForm.userIds.length == 0) {
        return this.$message.error('请选择授权对象')
      }

      // 获取授权数据
      this.types.forEach(item=>{
        const parentIds = this.$refs[`${item.name}AuthorizeTree`][0].getHalfCheckedKeys()
        const childrenIds = this.$refs[`${item.name}AuthorizeTree`][0].getCheckedKeys()
        const newIds = [...parentIds, ...childrenIds, ...this.dataForm.module]
        this.dataForm[item.name] = [...new Set(newIds)]
      })
      
      this.btnLoading = true
      updateBatchAuthorize(this.dataForm).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
            this.active = 0
            this.initData()
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 角色 折叠 展开
    setRoleAllExpand(state) {
      let result
      if (state === 'open') {
        result = true
      }
      if (state === 'close') {
        result = false
      }
      let nodes =  this.$refs.roleTree.store.nodesMap 
      for (let i in nodes) {
        nodes[i].expanded = result
      }
    },
    async handleClick(){   
      // console.log(this.$refs)
      // 获取当前选择的模块
      const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys()
      const childrenIds = this.$refs.authorizeTree.getCheckedKeys()
      const newIds = [...parentIds, ...childrenIds]
      this.moduleIdsTemp = [...new Set(newIds)]

      if (this.moduleIdsTemp.length === 0) {
        return this.$message.warning('请选择授权模块')
      }

      if (this.hasLoadAuthData) {
        return
      }

      this.authTreeLoading = true
      this.checkStrictly = true   
      try {
        await getAuthorizeValuesAll(this.objectId,{
          type:this.dataForm.objectType,
          moduleIds: this.moduleIdsTemp.toString()
        }).then(res=>{
          // if (res.data.module) {
          //   // this.moduleAuthorizeTree = res.data.module.list
          //   // this.moduleAllData = res.data.module.all
          //   // this.authorizeTreeData = this.moduleAuthorizeTree
          //   const moduleIds = [...this.moduleIdsTemp, ...res.data.module.ids]
          //   this.dataForm.module = [...new Set(moduleIds)]
          //   this.moduleIdsTemp = this.dataForm.module
          //   // this.$refs.authorizeTree.setCheckedKeys(this.dataForm.module)
          // }
          
          const moduleIds = [...this.moduleIdsTemp, ...res.data.module.ids]
          this.dataForm.module = [...new Set(moduleIds)]
          

          this.types.forEach(item=>{
            const t = item.name
            if (res.data[t]) {
              this[`${t}AuthorizeTree`] = res.data[t].list
              this[`${t}AllData`] = res.data[t].all              
              const ids = res.data[t].ids ? res.data[t].ids :[]
              this.dataForm[t] = [...this.dataForm[t], ...ids, ...this.moduleIdsTemp]
              this.$refs[`${t}AuthorizeTree`][0].setCheckedKeys(this.dataForm[t])              
            }
          })
        })
        // for (let index = 0; index < this.types.length; index++) {
        //   const t = this.types[index];

        //   await getAuthorizeValues(this.objectId,{
        //     type: t,
        //     moduleIds: this.moduleIdsTemp.toString()
        //   }).then(res=>{
        //     this[`${t}AuthorizeTree`] = res.data.list
        //     this[`${t}AllData`] = res.data.all
        //     this.dataForm[t] = [...this.dataForm[t], ...res.data.ids, ...this.moduleIdsTemp]
        //     this.$refs[`${t}AuthorizeTree`].setCheckedKeys(this.dataForm[t])
        //   })
        // }
        this.hasLoadAuthData = true
      } catch (error) {
        console.log(error)
      } finally{
        this.checkStrictly = false
        this.authTreeLoading = false
      }
    },
    authDataRefresh(){
      this.hasLoadAuthData = false
      this.handleClick()
    },
    filterAuthorizeTree(value,data){
      // console.log(value,data)
      if (!value) return true;
        return data.category == value
    }
  }
}
</script>
<style lang="scss" scoped>
.authorize-container {
  padding: 0;

  .el-steps {
    border-radius: 0;
  }
}

.authorize-bd {
  padding: 20px;
  height: calc(100% - 50px);
  font-size: 14px;
  overflow: auto;
  overflow-x: hidden;
}

.QT-common-layout-left {
  height: calc(100% - 50px);
  width: 33.33%;
  padding: 10px;

  .QT-common-el-tree-scrollbar{
    height: calc(100% - 50px);
  }

  .tableContainer{
    height: calc(100% - 150px);
  }

  >>> .el-tabs__content{
    height: 100%;
  }
}

.QT-common-title{
  border-bottom: none;

  align-items: flex-start;
}
</style>
