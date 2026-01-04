<template>
  <div class="login-wrap" id="home">
    <div class="login-container wow fadeInDown">
      <div class="login-main wow fadeInRight" data-wow-delay="1s">
        <div class="inner">
          <div class="login-text">{{ loginConfig.sysName }}</div>
          <div class="form">
            <div class="form-row2 wow fadeInLeft" data-wow-delay="1.3s">
              <div class="titles"><span>*</span>账号</div>
            </div>
            <div class="loginInput wow fadeInRight" data-wow-delay="1.3s">
              <div class="row-label">
                <img
                  src="@/assets/images/login/mode3/icon_login_user.png"
                  alt=""
                />
              </div>
              <input
                type="text"
                v-model="loginForm.account"
                placeholder="请输入用户名"
                class="form-control"
                @change="getConfig"
              />
            </div>
            <div class="form-row2 wow fadeInLeft" data-wow-delay="1.6s">
              <div class="titles"><span>*</span>密码</div>
            </div>
            <div class="loginInput wow fadeInRight" data-wow-delay="1.6s">
              <div class="row-label">
                <img
                  src="@/assets/images/login/mode3/icon_login_password.png"
                  alt=""
                />
              </div>
              <input
                type="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                class="form-control"
                @keydown.enter="handleLogin"
              />
            </div>
            <!-- <div class="info wow fadeInLeft" data-wow-delay="1.8s">
                <rememberPwd class="wow fadeInLeft" ref="rememberPassword" v-model:password="username"
                             v-model:username="password"></rememberPwd>
              </div> -->
            <el-button
              class="loginbut wow fadeInUp"
              :loading="$store.state.user.loginLoading"
              data-wow-delay="2.1s"
              type="primary"
              @click="handleLogin"
              >登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
//   import rememberPwd from "@/components/rememberPwd/rememberPwd.vue";
import WOW from "wow.js";
//   import {login} from "../../api/api/LargeScreenData.js";
import { getConfig } from "@/api/user";
export default {
  props:['loginConfig','accountLogin'],
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
        code: "",
        origin: "password",
      },
      // loading:false
      needCode: false,
      codeLength: 4,
    };
  },
  components: {
    // rememberPwd
  },
  mounted: function () {
    var wow = new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: true,
      live: true,
      callback: function (box) {},
      scrollContainer: null,
      resetAnimation: true,
    });
    wow.init();
  },
  computed: {},
  methods: {
    async handleLogin() {
      // 检查用户名和密码是否已被输入
      if (!this.loginForm.account || !this.loginForm.password) {
        // 如果没有输入用户名或密码，显示错误消息并退出函数
        this.$message.error("请输入用户名和密码");
        return;
      }
      const query = {
        ...this.loginForm,
        // timestamp: this.timestamp,
      };
      if (this.accountLogin) {
        this.accountLogin(query);
      }
    },
    getConfig(val) {
      if (!val) return;
      getConfig(this.loginForm.account).then((res) => {
        this.needCode = !!res.data.enableVerificationCode;
        if (this.needCode) {
          this.codeLength = res.data.verificationCodeNumber || 4;
          // this.changeImg();
        }
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.login-container {
  width: 1221px;
  height: 557px;
  background: url("../../../assets/images/login/mode3/loginbg2.png") no-repeat;
  background-size: 1221px 557px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -611px;
  margin-top: -278.5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
}

.login-wrap {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background: url("../../../assets/images/login/mode3/loginbg.png") no-repeat;
  background-size: 100% 100%;
}

.login-grid {
  position: relative;
  z-index: 999;
  float: left;
}

.login-main {
  z-index: 1000;
  width: 568px;
  height: 663px;
  background-color: #fff;
  border-radius: 10px;
  margin-right: 45px;
}

.login-main .inner {
  //padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.login-text {
  font-size: 34px;
  color: rgba(51, 204, 255, 1);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 20px;
  font-weight: bold;
  padding: 10px 0;
}

.loginInput {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  background: inherit; // rgba(24, 80, 136, 0.4);
  flex-direction: row;
  margin-bottom: 25px;
  align-content: flex-start;
  position: relative;
  height: 56px;
  border: 2px solid rgba(#20a3f5, 0.4);

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
    width: 65px;

    img {
      width: 23px;
    }
  }

  input {
    width: 100%;
    background: none;
    height: 57px;
    position: relative;
    border: none;
    // color: #fff;
    outline: none;
    font-size: 20px;
    font-family: PingFang;
    font-weight: bold;
  }

  input::-webkit-input-placeholder {
    color: #dcdfe6;// rgba(#ffffff, 1);
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: rgba(#ffffff, 1);
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: rgba(#ffffff, 1);
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(#ffffff, 1);
  }
}

.form-row {
  position: relative;
  width: 492px;
  height: 59px;
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 6px;
  margin-bottom: 30px;
}

.row-label {
  width: 53px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  height: 28px;
  border-right: 1px solid rgba(238, 238, 238, 1);

  img {
    width: 20px;
  }
}

.row-label .iconfont {
  font-size: 20px;
}

.form-row .form-control {
  height: 50px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  width: calc(100% - 40px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 40px;
  color: #000;
  outline: none;
  font-size: 20px;
}

.form-row ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #687ca4;
}

.form-row ::-moz-placeholder {
  /* WebKit browsers */
  color: #687ca4;
}

.form-row ::-ms-input-placeholder {
  /* WebKit browsers */
  color: #687ca4;
}

.form-foot {
  padding-top: 20px;
}

.form-row .form-control:focus {
  box-shadow: 0 0 0 transparent;
}

.form-row .btn-login-primary,
.form-row .btn-login-primary:hover,
.form-row .btn-login-primary:focus,
.form-row .btn-login-primary:active {
  outline: none;
  width: 130px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  background-image: linear-gradient(to right, #0093fe, #00f2fe);
  color: #ffffff;
  border-radius: 4px;
  font-size: 16px;
  border: 0;
  font-weight: bold;
}

.form-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
}

.loginbut {
  width: 492px;
  height: 67px;
  background: #33ccff;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  font-size: 20px;
  font-family: PingFang;
  font-weight: bold;
  color: #ffffff;
  margin-right: 0;
  margin-top: 30px;
}

.form-row2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  margin-bottom: 30px;

  .titles {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    font-size: 20px;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;

    span {
      color: rgba(240, 58, 58, 1);
    }
  }
}
</style>
  