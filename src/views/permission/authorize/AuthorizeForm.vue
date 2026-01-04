<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main authorize-bd">
      <div class="QT-common-page-header">
        <el-page-header @back="goBack" :content="title" />
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          height: calc(100% - 60px);
        "
      >
        <div class="main" style="border-right:10px solid #ebeef5;flex:0.4">
          <el-form
            ref="dataForm"
            :model="dataForm"
            @keyup.enter.native="handleConfirm()"
          >
            <el-form-item>
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
                      <el-dropdown-item @click.native="getAuthorizeList(0)"
                        >{{ $t('common.refresh') }}</el-dropdown-item
                      >
                      <el-dropdown-item @click.native="handleCheck('checkAll')">
                        {{ $t("authorize.checkAll") }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="handleCheck('cancelCheckAll')"
                      >
                        {{ $t("authorize.deselectAll") }}</el-dropdown-item
                      >
                      <el-dropdown-item @click.native="setAllExpand('open')"
                        >{{ $t("authorize.expandAll") }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="setAllExpand('close')"
                        >{{ $t("authorize.foldAll") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>
              <el-scrollbar class="QT-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree
                  :data="moduleAuthorizeTree"
                  ref="authorizeTree"
                  v-loading="treeLoading"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :check-strictly="checkStrictly"
                  check-on-click-node
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  @check-change="selectTreeNodeClick"
                  :filter-node-method="filterAuthorizeTree"
                >
                  <div slot-scope="{ node, data }">
                    <i :class="data.icon" />
                    <el-tooltip class="item" effect="dark" :content="data.description || node.label" placement="right-end">
                      <span style="padding-left: 4px">{{ node.label }}</span>
                    </el-tooltip>
                  </div>
                </el-tree>
              </el-scrollbar>
            </el-form-item>
          </el-form>
        </div>
        <div class="main">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
            style="height: 100%"
            v-loading="authTreeLoading"
            type="card"
          >
            <el-tab-pane
              v-for="item in types"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
              <el-scrollbar
                class="QT-common-el-tree-scrollbar"
              >
                <el-tree
                  :data="getAuthorizeTree(item.name)"
                  :ref="item.name + 'AuthorizeTree'"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :check-strictly="checkStrictly"
                  check-on-click-node
                  :props="defaultProps"
                  :expand-on-click-node="false"
                >
                  <span slot-scope="{ node, data }">
                    <i :class="data.icon" />
                    <span style="padding-left: 4px">{{ node.label }}</span>
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
                      <el-dropdown-item @click.native="authDataRefresh()"
                        >刷新</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click.native="handleCheck('checkAll', 'auth')"
                      >
                        {{ $t("authorize.checkAll") }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="handleCheck('cancelCheckAll', 'auth')"
                      >
                        {{ $t("authorize.deselectAll") }}</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click.native="setAllExpand('open', 'auth')"
                        >{{ $t("authorize.expandAll") }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="setAllExpand('close', 'auth')"
                        >{{ $t("authorize.foldAll") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
                <el-button
                  type="primary"
                  size="mini"
                  :loading="btnLoading"
                  @click="handleConfirm()"
                  >确定</el-button
                >
              </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getAuthorizeValues,
  updateAuthorizeList,
  getAuthorizeValuesAll,
} from "@/api/permission/authorize";

export default {
  data() {
    return {
      visible: false,
      treeLoading: false,
      btnLoading: false,
      checkStrictly: true,
      objectId: "",
      dataForm: {
        objectType: "",
        module: [],
        button: [],
        column: [],
        form: [],
        resource: [],
        objectType: "Role",
      },
      params: {
        type: "module",
        moduleIds: "",
      },
      title: "",
      active: 0,
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
      defaultProps: {
        // 配置项（必选）
        value: "id",
        label: "fullName",
        children: "children",
      },
      activeName: "",
      types: [
        { label: "功能权限", name: "button" },
        { label: "表单字段", name: "column" },
        { label: "显示字段", name: "form" },
        { label: "数据权限", name: "resource" },
      ],
      hasLoadAuthData: false,
      authTreeLoading: false,
      menuRadio: "Web",
    };
  },
  watch:{
    menuRadio:{
      handler(val){
        this.$refs.authorizeTree.filter(val)
      }
    }
  },
  methods: {
    init(id, fullName, type) {
      Object.assign(this.$data, this.$options.data());
      this.visible = true;
      this.objectId = id;
      this.dataForm.objectType = type;
      this.$nextTick(async () => {
        this.$refs["dataForm"].resetFields();
        if (type === "User") {
          this.title = this.$t(`user.userPermission`) + " - " + fullName;
        } else if (type === "Position") {
          this.title = this.$t(`position.postPermission`) + "- " + fullName;
        } else if (type === "Role") {
          this.title = this.$t(`role.rolePermission`) + " - " + fullName;
        }
        await this.getAuthorizeList();
        this.activeName = "button";
        this.handleClick();
      });
    },
    async getAuthorizeList(active) {
      this.treeLoading = true;
      // this.authorizeTreeData = [];
      if (!active) {
        active = this.active
      }
      this.checkStrictly  = true
      await getAuthorizeValues(this.objectId, this.params)
        .then((res) => {
          switch (active) {
            case 0:
              this.moduleAuthorizeTree = res.data.list;
              this.moduleAllData = res.data.all;
              // this.authorizeTreeData = this.moduleAuthorizeTree;
              const moduleIds = [...this.moduleIdsTemp, ...res.data.ids];
              this.dataForm.module = [...new Set(moduleIds)];
              this.moduleIdsTemp = this.dataForm.module;
              this.$refs.authorizeTree.setCheckedKeys(this.dataForm.module);
              this.$nextTick(()=>this.$refs.authorizeTree.filter(this.menuRadio))
              break;
            case 1:
              this.buttonAuthorizeTree = res.data.list;
              this.buttonAllData = res.data.all;
              // this.authorizeTreeData = this.buttonAuthorizeTree;
              this.dataForm.button = [
                ...this.dataForm.button,
                ...res.data.ids,
                ...this.moduleIdsTemp,
              ];
              this.$refs.authorizeTree.setCheckedKeys(this.dataForm.button);
              break;
            case 2:
              this.columnAuthorizeTree = res.data.list;
              this.columnAllData = res.data.all;
              // this.authorizeTreeData = this.columnAuthorizeTree;
              this.dataForm.column = [
                ...this.dataForm.column,
                ...res.data.ids,
                ...this.moduleIdsTemp,
              ];
              this.$refs.authorizeTree.setCheckedKeys(this.dataForm.column);
              break;
            case 3:
              this.formAuthorizeTree = res.data.list;
              this.formAllData = res.data.all;
              // this.authorizeTreeData = this.formAuthorizeTree;
              this.dataForm.form = [
                ...this.dataForm.form,
                ...res.data.ids,
                ...this.moduleIdsTemp,
              ];
              this.$refs.authorizeTree.setCheckedKeys(this.dataForm.form);
              break;
            case 4:
              this.resourceAuthorizeTree = res.data.list;
              this.resourceAllData = res.data.all;
              // this.authorizeTreeData = this.resourceAuthorizeTree;
              this.dataForm.resource = [
                ...this.dataForm.resource,
                ...res.data.ids,
                ...this.moduleIdsTemp,
              ];
              this.$refs.authorizeTree.setCheckedKeys(this.dataForm.resource);
              break;
          }
          this.checkStrictly = false;
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    goBack() {
      this.$emit("close");
    },
    // 全选/全不选
    handleCheck(val, auth) {
      if (val === "checkAll") {
        if (auth) {
          const refName = `${this.activeName}AuthorizeTree`;
          const dataName = `${this.activeName}AllData`;
          if (this.$refs[refName]) {
            this.$refs[refName][0].setCheckedKeys(this[dataName]);
          }
        } else {
          this.$refs.authorizeTree.setCheckedKeys(this.moduleAllData);
        }
        // switch (this.active) {
        //   case 0:
        //     this.$refs.authorizeTree.setCheckedKeys(this.moduleAllData)
        //     break
        //   case 1:
        //     this.$refs.authorizeTree.setCheckedKeys(this.buttonAllData)
        //     break
        //   case 2:
        //     this.$refs.authorizeTree.setCheckedKeys(this.columnAllData)
        //     break
        //   case 3:
        //     this.$refs.authorizeTree.setCheckedKeys(this.formAllData)
        //     break
        //   case 4:
        //     this.$refs.authorizeTree.setCheckedKeys(this.resourceAllData)
        //     break
        // }
      }
      if (val === "cancelCheckAll") {
        if (auth) {
          const refName = `${this.activeName}AuthorizeTree`;
          if (this.$refs[refName]) {
            this.$refs[refName][0].setCheckedKeys([]);
          }
        } else {
          this.$refs.authorizeTree.setCheckedKeys([]);
        }
      }
    },
    // 折叠 展开
    setAllExpand(state, auth) {
      let result;
      if (state === "open") {
        result = true;
      }
      if (state === "close") {
        result = false;
      }
      // const nodes = this.$refs.authorizeTree.store.nodesMap
      let nodes;
      if (auth) {
        const refName = `${this.activeName}AuthorizeTree`;
        if (this.$refs[refName]) {
          nodes = this.$refs[refName][0].store.nodesMap;
        }
      } else {
        nodes = this.$refs.authorizeTree.store.nodesMap;
      }
      for (let i in nodes) {
        nodes[i].expanded = result;
      }
    },
    // 设置数据
    selectTreeNodeClick() {
      //清空授权数据
      this.activeName = "";
      this.hasLoadAuthData = false;
      for (let index = 0; index < this.types.length; index++) {
        const t = this.types[index].name;
        this[`${t}AuthorizeTree`] = [];
        this[`${t}AllData`] = [];
        this.dataForm[t] = [];
      }
    },
    async handleConfirm() {
      // if (!this.activeName) {
      //   return this.$message.error("请选择授权类型");
      // }
      if (!this.hasLoadAuthData) {
        try {
          await this.handleClick()
        } catch (error) {
          return this.$message.error("请选择授权类型");
        }
      }

      // 获取授权数据
      this.types.forEach(item=>{
        const parentIds = this.$refs[`${item.name}AuthorizeTree`][0].getHalfCheckedKeys()
        const childrenIds = this.$refs[`${item.name}AuthorizeTree`][0].getCheckedKeys()
        const newIds = [...parentIds, ...childrenIds, ...this.dataForm.module]
        this.dataForm[item.name] = [...new Set(newIds)]
      })

      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          updateAuthorizeList(this.objectId, this.dataForm)
            .then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.btnLoading = false;
                  this.$emit("close", true);
                },
              });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    },
    async handleClick() {
      // 获取当前选择的模块
      const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys();
      const childrenIds = this.$refs.authorizeTree.getCheckedKeys();
      const newIds = [...parentIds, ...childrenIds];
      this.moduleIdsTemp = [...new Set(newIds)];
      this.dataForm.module = this.moduleIdsTemp;
      // if (this.moduleIdsTemp.length === 0) {
      //   return this.$message.warning("请选择授权模块");
      // }

      if (this.hasLoadAuthData) {
        return;
      }


      this.authTreeLoading = true;
      this.checkStrictly = true;
      try {
        await getAuthorizeValuesAll(this.objectId, {
          type: this.dataForm.objectType,
          moduleIds: this.moduleIdsTemp.toString(),
        }).then((res) => {
          // console.log('this.types',JSON.stringify(this.types))
          this.types.forEach((item) => {
            // debugger
            const t = item.name;
            if (res.data[t]) {
              this[`${t}AuthorizeTree`] = res.data[t].list;
              this[`${t}AllData`] = res.data[t].all;
              const ids = res.data[t].ids ? res.data[t].ids :[]
              this.dataForm[t] = [
                ...this.dataForm[t],
                ...ids,
                ...this.moduleIdsTemp,
              ];
              // console.log('forEach',forEach)
              this.$refs[`${t}AuthorizeTree`][0].setCheckedKeys(
                this.dataForm[t]
              );
            }
          });
        });
        this.hasLoadAuthData = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.checkStrictly = false;
        this.authTreeLoading = false;
      }
    },
    getAuthorizeTree(name) {
      return this[`${name}AuthorizeTree`];
    },
    authDataRefresh() {
      this.hasLoadAuthData = false;
      this.handleClick();
    },
    filterAuthorizeTree(value,data){
      // console.log(value,data)
      if (!value) return true;
        return data.category == value
    },
  },
};
</script>
<style lang="scss" scoped>
.authorize-bd {
  .QT-common-page-header {
    border-bottom: none;
  }
  .el-steps {
    border-radius: 0;
  }
}
.main {
  // padding: 20px;
  width: 400px;
  overflow: hidden;
  flex: 1;
}

// .QT-common-layout-main {
//   width: calc(100% - 400px);
//   padding: 10px;
// }

.QT-common-el-tree-scrollbar{
    height: calc(100vh - 250px);
    overflow-y: scroll;
  }

  .QT-common-title{
    border-bottom: none;
    align-items: flex-start;
  }
</style>
