<template>
  <div class="loginBody">
    <div class="loginBodyLeft wow fadeInLeft" data-wow-delay="0.3s">
      <img src="@/assets/images/login/mode2/qiu.png" alt="" />
    </div>
    <div class="loginBodyCenter">
      <div class="shuzibg"></div>
      <div class="loginTitle wow fadeInDown">
        <p>{{ loginConfig.sysName }}</p>
      </div>
      <div class="loginR wow fadeInRight">
        <cornerMark></cornerMark>
        <div class="loginInner">
          <div class="loginTitle2 wow fadeInDown" data-wow-delay="0.8s">
            欢迎登录系统!
          </div>
          <div class="loginInput wow fadeInLeft" data-wow-delay="1.2s">
            <div class="icon">
              <img src="@/assets/images/login/mode2/icon_user.png" alt="" />
            </div>
            <input v-model="loginForm.account" type="text" placeholder="请输入账号"  @change="getConfig"/>
            <div class="close" v-if="loginForm.account" @click="clearInfo('account')">
              <img
                src="@/assets/images/login/mode2/icon_login_delete.png"
                alt=""
              />
            </div>
          </div>
          <div class="loginInput wow fadeInLeft" data-wow-delay="1.5s">
            <div class="icon">
              <img src="@/assets/images/login/mode2/icon_pwd.png" alt="" />
            </div>
            <input v-model="loginForm.password" placeholder="密码" type="password" @keydown.enter="goLogin" />
            <div class="close" v-if="loginForm.password" @click="clearInfo('password')">
              <img
                src="@/assets/images/login/mode2/icon_login_delete.png"
                alt=""
              />
            </div>
          </div>
          <!-- <div class="forgetBody">
              <div class="wow fadeInLeft" data-wow-delay="1.8s">
                <rememberPwd ref="rememberPassword" v-model:password="username"
                             v-model:username="password"></rememberPwd>
              </div>
              <div class="forget wow fadeInRight" data-wow-delay="1.8s">忘记密码?</div>
            </div> -->
          <div
            class="loginBut cur wow fadeInUp"
            data-wow-delay="2.1s"
            @click="goLogin"
            v-loading="$store.state.user.loginLoading"
          >
            <span>登录</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="bolang" class="bolang wow fadeInUp" data-wow-delay="0.3s"></div>
  </div>
</template>
  
  <script>
import WOW from "wow.js";
import cornerMark from "./cornerMark.vue";
import rememberPwd from "./rememberPwd.vue";
import gsap from "gsap";
import { getConfig } from "@/api/user";
export default {
  props: ["loginConfig",'accountLogin'],
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
        code: "",
        origin: "password",
      },
      // loading:false
      needCode:false,
      codeLength:4
    };
  },
  components: { cornerMark, rememberPwd },
  mounted() {
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
    gsap.to(this.$refs.bolang, {
      duration: 2,
      bottom: -20,
      repeat: -1,
      yoyo: true,
    });
  },
  methods: {
    clearInfo(e) {
      this.loginForm[e] = "";
    },
    goLogin() {
      if (!this.loginForm.account) {
        return this.$message.warning("请输入用户名");
      }
      if (!this.loginForm.password) {
        return this.$message.warning("请输入密码");
      }
      // 记住密码操作
      // that.$refs.rememberPassword.rememberPassword();

      // this.loading = true;
      const query = {
        ...this.loginForm,
        // timestamp: this.timestamp,
      };

      if (this.accountLogin) {
        this.accountLogin(query)
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
  filters: {},
  watch: {},
};
</script>
  
  <style lang="scss" scoped>
.bolang {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 310px;
  background: url("../../../assets/images/login/mode2/bolang.png") no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}

.loginBody {
  background: url("../../../assets/images/login/mode2/bg.jpg") center center
    no-repeat;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  .loginBodyLeft {
    width: 50%;
    position: relative;
    height: 100%;
  }

  .shuzibg {
    background: url("../../../assets/images/login/mode2/shuzibg.png") no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.6;
    z-index: -1;
  }

  .loginBodyCenter {
    width: 50%;
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    z-index: 10;

    .loginR {
      width: 631px;
      background: rgba(#20a3f5, 0.1);
      display: flex;
      min-height: 400px;
      //background: url("./assets/loginbg.png") no-repeat;
      justify-content: flex-start;
      border: 2px solid rgba(17, 107, 178, 1);
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: column;
      padding-bottom: 60px;
      align-content: flex-start;
      position: relative;

      .titleImg {
        width: 242px;
        height: 26px;
        margin: 0 auto;
        margin-top: 57px;
        margin-bottom: 42px;
      }

      .loginInput {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        background: rgba(24, 80, 136, 0.4);
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
          color: #fff;
          outline: none;
          font-size: 20px;
          font-family: PingFang;
          font-weight: bold;
        }

        input::-webkit-input-placeholder {
          color: rgba(#ffffff, 1);
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

      .loginInner {
        width: 512px;

        .loginTitle2 {
          font-family: PingFang;
          font-weight: 400;
          color: #34dcfc;
          font-size: 32px;
          height: 105px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          flex-direction: row;
          align-content: flex-start;
        }
      }

      .loginBut {
        width: 515px;
        height: 56px;
        font-size: 32px;
        font-weight: 400;
        color: #ffffff;
        background: #20a3f5;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;
        cursor: pointer;
        letter-spacing: 30px;
        text-indent: 30px;
      }
    }
  }
}

.rememberpwd {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  width: 381px;
}

.loginImg {
  width: 900px;
  height: 810px;
  //background: url("../assets/login/loginbg2.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
}

.loginTitle {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  p {
    font-size: 41px;
    font-weight: 400;
    color: #00bff4;
    margin-bottom: 70px;
    font-family: "PangMenZhengDao";
    background: linear-gradient(90deg, #009ff1 0%, #00e8cf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.forget {
  font-size: 18px;
  font-family: PingFang;
  font-weight: 400;
  color: #fff;
}

.close {
  height: 17px;
  width: 17px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  position: absolute;
  right: 15px;

  img {
    width: 17px;
  }
}

.forgetBody {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  height: 80px;
}
</style>
  