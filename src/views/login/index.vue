<template>
  <div class="login-container">
    <div class="btnTenant" v-if="!hideTenant">
      <i class="el-icon-setting" @click="handleSaasDialog()"></i>
    </div>
    <!-- <div class="btnBottom">
      <i class="qt-custom qt-custom-keyboard" @click="openKeyboard()"></i>
    </div> -->
    <component
      v-if="!loading"
      :is="loginConfig.loginMode"
      :loginConfig="loginConfig"
      :loginForm="loginForm"
      :accountLogin="loginByAccount"
    />
    <saas-dialog ref="saasDialogRef" @ok="handleSaas" />
    <div class="btnCenter">
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ sysConfig.copyright }}</a>
    </div>
  </div>
</template>

<script>
import LoginMode1 from "./components/LoginMode1.vue";
import LoginMode2 from "./components/LoginMode2.vue";
import LoginMode3 from "./components/LoginMode3.vue";
import SaasDialog from "./components/SaasDialog.vue";
import { mapGetters,mapState } from 'vuex'
export default {
  components: {
    LoginMode1,
    LoginMode2,
    LoginMode3,
    SaasDialog
  },
  name: "Login",
  data() {
    return {
      loginConfig: {
        loginMode: "LoginMode1",
        sysName: "",
      },
      loading: false,
      loginForm: {
        account: "",
        password: "",
        code: "",
        origin: "password",
      },
      redirect: undefined,
      otherQuery: {},
    };
  },
  computed: {
    ...mapGetters(['multiTenancy','tenantLoggedIn']),
    ...mapState({
      globalConfig: state => state.settings.globalConfig
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig;
    },
    loginLoading() {
      return this.$store.state.user.loginLoading;
    },
    tenantId(){
      return this.$store.state.user.tenantId;
    },
    // 是否隐藏租户设置按钮
    hideTenant(){
      return this.globalConfig && this.globalConfig.autoLogin == true;
    }
  },
  watch: {
    // loginLoading(val) {
    //   if (!val) this.loading = false;
    // },
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  async created() {
    if (this.multiTenancy && !this.tenantLoggedIn) {
      this.$nextTick(()=>this.handleSaasDialog())
    }else{
      this.loadSysLoginConfig()
    }    
  },
  mounted() {
    this.$store.commit("user/SET_LOGIN_LOADING", false);
  },
  methods: {
    async loadSysLoginConfig() {
      this.loading = true;
      // 获取登录设置信息
      this.$store.dispatch('settings/loadSysLoginConfig')
      .then((res) => {
          // 多租户
          if (res.multiTenancy) {
            this.handleSaasDialog()
          }else{
            this.loginConfig = res
          }        
        });
      // await this.$request
      //   .get("/api/system/SysConfig/login")
      //   .then((res) => {
      //     // 多租户
      //     if (res.data.multiTenancy) {
      //       this.handleSaasDialog()
      //     }else{
      //       this.loginConfig = res.data
      //     }        
      //   });
      this.loading = false;
    },
    /** 账号密码登录 */
    loginByAccount(query) {
      this.$store.commit("user/SET_LOGIN_LOADING", true);
      this.$store
        .dispatch("user/login", query)
        .then((res) => {
          const { switchRole } = res;
          if (switchRole) {
            // 需要切换角色
            let query = {
              path: this.redirect || "/dashboard",
              query: JSON.stringify(this.otherQuery),
              redirect: "login",
            };
            this.$router.push({ path: "/switchRole", query: query });
          } else {
            this.$router.push({
              path: this.redirect || "/dashboard",
              query: this.otherQuery,
            });
          }
        })
        .catch(() => {
          this.$store.commit("user/SET_LOGIN_LOADING", false);
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    handleSaasDialog(){
      this.$refs.saasDialogRef.showDialog();
    },
    handleSaas(){
      // 重新获取登录数据
      this.loadSysLoginConfig()
    },
    openKeyboard() {
      // 需要执行注册文件 keboard.reg
      window.open("keyboard://");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #002b5a;
}
.btnTenant{
 z-index: 9999999;
 color: #fff;
 font-size: 24px;
 top: 10px;
 right: 10px;
 position: fixed;
 cursor: pointer;
}


.btnBottom{
 z-index: 9999999;
 color: #fff;
 font-size: 24px;
 bottom: 10px;
 right: 10px;
 position: fixed;
 cursor: pointer;
}

.btnCenter{
 z-index: 9999999;
 color: #fff;
 font-size: 16px;
 bottom: 10px;
//  right: 10px;
 margin: auto;
 position: fixed;
 cursor: pointer;
}
</style>