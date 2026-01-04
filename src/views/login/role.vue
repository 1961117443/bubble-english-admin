<template>
  <!-- <NavbarRight/>  -->
  <div class="login-container" v-loading="loading">
    <div class="login-content" style="margin-top: 100px;align-items: normal;">
      <div class="login-form-role login-form wow fadeInDown" data-wow-delay="0.8s" style="width: 800px;">
        <div style="display: flex; justify-content: space-between">
          <p class="login-tip">请选择角色</p>
          <div style="margin-top: 5px;">
            <el-button
              type="danger"
              class="login-btn"
              @click.native.prevent="logout"
              size="mini"
              :loading="btnLoading"
              v-if="redirect"
              >退 出</el-button
            >
            <el-button
              v-else
              type="danger"
              class="login-btn"
              @click.native.prevent="$router.go(-1)"
              size="large"
              :loading="btnLoading"
              >返 回</el-button
            >
            <el-button
              type="success"
              class="login-btn"
              @click.native.prevent="handleOk"
              :loading="btnLoading"
              size="large"
              >确 认</el-button
            >
          </div>
        </div>
        <el-form ref="dataForm" :rules="dataRule" :model="dataForm">
          <div class="organize-list organize-list-role">
            <el-row :gutter="12">
              <el-col
                :span="12"
                class="organize-item"
                v-for="(item, i) in userInfo.roles"
                :key="i"
              >
                <div
                  class="organize-item-main"
                  :class="{ active: dataForm.roleId == item.id }"
                  @click="roleChange(item)"
                >
                  <i class="icon-qt icon-qt-wf-outgoingApply"></i>
                  <p class="organize-name">{{ item.name }}</p>
                  <!-- <p class="btn">当前</p> -->
                  <div class="icon-checked">
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-divider content-position="left" style="background-color: #002b5a"
            >选择单位</el-divider
          >
          <div class="organize-list">
            <el-row :gutter="12">
              <el-col
                :span="12"
                class="organize-item"
                v-for="(item, i) in roleTreeData"
                :key="i"
              >
                <div
                  class="organize-item-main"
                  :class="{ active: dataForm.organizeId == item.id }"
                  @click="dataForm.organizeId = item.id"
                >
                  <i class="icon-qt icon-qt-organization"></i>
                  <p class="organize-name">{{ item.fullName }}</p>
                  <!-- <p class="btn">当前</p> -->
                  <div class="icon-checked">
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- <div style="display: flex; justify-content: space-between">
            <el-button
              type="danger"
              class="login-btn"
              @click.native.prevent="logout"
              >取消</el-button
            >
            <el-button
              type="primary"
              class="login-btn"
              @click.native.prevent="handleOk"
              :loading="btnLoading"
              >确认</el-button
            >
          </div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getRoleByOrganize } from "@/api/permission/role";
import { setMajor } from "@/api/permission/userSetting";
import { resetRouter } from "@/router";
export default {
  data() {
    return {
      // activeRole: '',
      // activeOrganize: '',
      loading: false,
      roleList: [],
      dataForm: {
        roleId: "",
        organizeId: "",
      },
      redirect: "",
      otherQuery: undefined,
      dataRule: {
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        organizeId: [
          { required: true, message: "请选择所属组织", trigger: "change" },
        ],
      },
      btnLoading: false,
      redirect:''
    };
  },
  components: {},
  computed: {
    ...mapGetters(["userInfo"]),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    roleTreeData() {
      // return this.roleList
      return this.roleList.filter(
        (it) =>
          it.hasChildren &&
          it.children.some((x) => x.id == this.dataForm.roleId)
      );
    },
  },
  watch: {
    // loginLoading(val) {
    //   if (!val) this.loading = false;
    // },
    $route: {
      handler: function (route) {
        const query = route.query;
        // console.log(query);
        if (query) {
          this.redirect = query.path;
          this.otherQuery = query.query ? JSON.parse(query.query) : {};
          this.redirect = query.redirect;
        }
      },
      immediate: true,
    },
  },
  created() {
    // console.log(this.userInfo);
    this.init();
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`);
    },
    async init() {
      this.loading = true;

      const organizeIds = this.userInfo.companys.map((it) => it.id);
      await getRoleByOrganize(organizeIds).then((res) => {
        // 处理公司名称 fullName
        this.roleList = res.data.list.map(o=>{
          const arr = o.fullName.split('/')
          o.fullName = arr[arr.length-1]
          return o
        });
      });
      this.dataForm.roleId = this.userInfo.lastRoleId;
      if(this.userInfo.organizeId){
        const arr = this.userInfo.organizeId.split(':')
        this.dataForm.organizeId = arr.length>1? arr[1]:arr[0]; // this.userInfo.organizeId;
      }
      
      this.loading = false;
    },
    roleChange(item) {
      this.dataForm.roleId = item.id;
      if (
        this.dataForm.organizeId &&
        !this.roleTreeData.some((it) => it.id == this.dataForm.organizeId)
      ) {
        this.dataForm.organizeId = "";
      }

      if (!this.dataForm.organizeId && this.roleTreeData.length == 1) {
        this.dataForm.organizeId = this.roleTreeData[0].id;
      }
    },
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          setMajor({
            majorType: "Role",
            majorId: `${this.dataForm.roleId}:${this.dataForm.organizeId}`,
          }).then(async (res) => {
            this.$message.success(res.msg);
            // 清了菜单然后跳转到首页
            const view = this.visitedViews.find(
              (x) => x.fullPath == this.$route.fullPath
            );

            this.$store.commit("user/SET_MENULIST", []);
            resetRouter();
            await this.$store
              .dispatch("tagsView/delAllViews")
              .then(({ visitedViews }) => {
                // console.log(visitedViews)
                // this.$router.push({path:'/'})
                // this.$nextTick(()=>{
                //   this.$router.push({ path: '/home' });
                //   this.onClose()
                // })

                if (
                  view &&
                  (view.path == "/home" || view.path == "/dashboard")
                ) {
                  this.refreshSelectedTag(view);
                } else {
                  this.$router.push({ path: "/" });
                }
              });
          });
        }
      });
    },
    /** 刷新当前页面 */
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        let { fullPath } = view;
        // 对外链刷新的处理，：需要转义
        if (fullPath.indexOf(":") > -1) {
          fullPath = fullPath.replace("/", "");
          fullPath = "/" + encodeURIComponent(fullPath);
        }
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.login-form {
  padding: 0 0 !important;
}
.login-form-role{
  width: 800px;
}
.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #002b5a;
}

.login-btn {
  // color: black;
  
}

.login-tip {
  color: black !important;
  font-size: xx-large;
  text-align: start !important;
  margin-bottom: 20px;
}

.active1 {
  background-color: #002b5a;
  color: #fff;
  border-color: #002b5a;
}


.organize-list {
  width: 100%;
  // padding: 50px;

  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  .organize-item {
    margin-bottom: 30px;

    .organize-item-main {
      min-height: 70px;
      position: relative;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
      color: #606266;

      &.active {
        border: 1px solid #1890ff;
        box-shadow: 0 0 6px rgba(6, 58, 108, 0.26);
        color: #1890ff;

        .btn,
        .icon-checked {
          display: block;
        }
      }

      .icon-qt {
        font-size: 24px;
        margin-right: 10px;
      }

      .organize-name {
        line-height: 24px;
        font-size: 24px;
      }

      .btn {
        display: none;
        position: absolute;
        right: 45px;
        bottom: 7px;
        font-size: 12px;
      }

      .icon-checked {
        display: none;
        width: 20px;
        height: 20px;
        border: 20px solid #1890ff;
        border-left: 20px solid transparent;
        border-top: 20px solid transparent;
        border-bottom-right-radius: 2px;
        position: absolute;
        transform: scale(0.9);
        right: -2px;
        bottom: -2px;

        i {
          position: absolute;
          top: -2px;
          left: -3px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }
}
.organize-list-role{
  min-height: 100px;
}
</style>