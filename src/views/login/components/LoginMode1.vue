<template>
  <div class="login-mode1">
    <vue-particles
      class="login-bg"
      color="#39AFFD"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#8DD1FE"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <div class="login-content">
      <div class="login-form wow fadeInDown" data-wow-delay="1s">
        <p class="login-tip" v-if="loginConfig.sysName">{{ loginConfig.sysName }}</p>
        <div class="login-tab" :class="'active' + active">
          <a
            class="item"
            :class="{ active: active == 1 }"
            @click="active = 1"
            >{{ $t("login.title") }}</a
          >
          <!-- <a
            class="item"
            :class="{ active: active == 2 }"
            @click="active = 2"
            >{{ $t("login.scanTitle") }}</a
          >
          <a
            class="item"
            :class="{ active: active == 3 }"
            @click="active = 3"
            >{{ $t("login.codeTitle") }}</a
          > -->
        </div>
        <el-form
          v-show="active == 1"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          autocomplete="on"
          label-position="left"  
          class="wow fadeInDown"
          data-wow-delay="1.3s"
        >
          <el-form-item prop="account">
            <el-input
              ref="account"
              v-model="loginForm.account"
              :placeholder="$t('login.username')"
              name="account"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-user"
              size="large"
              @change="getConfig"
            ></el-input>
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            :content="$t('login.upper')"
            placement="right"
            manual
          >
            <el-form-item prop="password"  data-wow-delay="1.3s">
              <el-input
                ref="password"
                v-model="loginForm.password"
                show-password
                :placeholder="$t('login.password')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @keyup.enter.native="handleLogin" 
                @blur="capsTooltip = false"
                prefix-icon="el-icon-lock"
                size="large"
              ></el-input>
              <!-- @keyup.enter.native="handleLogin" -->
            </el-form-item>
          </el-tooltip>
          <el-form-item prop="code" v-if="needCode">
            <el-row type="flex" justify="space-between">
              <el-col class="sms-input">
                <el-input
                  v-model="loginForm.code"
                  :placeholder="$t('login.codeTip')"
                  name="code"
                  autocomplete="on"
                  prefix-icon="el-icon-key"
                  size="large"
                  @keyup.enter.native="handleLogin" 
                >
                </el-input>
              </el-col>
              <el-col class="sms-right code-right">
                <el-tooltip
                  :content="$t('login.changeCode')"
                  placement="bottom"
                >
                  <img
                    id="imgcode"
                    :alt="$t('login.changeCode')"
                    :src="define.comUrl + imgUrl"
                    @click="changeImg"
                  />
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            size="large"
            @click.native.prevent="handleLogin"
            data-wow-delay="1.6s"
            >{{ $t("login.logIn") }}</el-button
          >
        </el-form>
        <div v-show="active == 2" class="login-form-QRCode">
          <img class="qrcode-img" src="@/assets/images/login.png" />
          <p class="qrcode-tip">稍后上线</p>
        </div>
        <el-form
          v-show="active == 3"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="phone"  data-wow-delay="1.3s">
            <el-input
              ref="phoneRef"
              v-model="loginForm.phone"
              :placeholder="$t('login.mobile')"
              name="account"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-mobile-phone"
              size="large"
              @change="getConfig"
            ></el-input>
          </el-form-item>
         
          <el-form-item prop="phoneCode">
            <el-row type="flex" justify="space-between">
              <el-col class="sms-input">
                <el-input
                  v-model="loginForm.phoneCode"
                  :placeholder="$t('login.codeTip')"
                  name="code"
                  autocomplete="on"
                  prefix-icon="el-icon-key"
                  size="large"
                >
                </el-input>
              </el-col>
              <el-col class="sms-right code-right">
                <el-button
                  :loading="loading"
                  type="primary"
                  size="large"
                  style="width: 100%"
                  >{{ $t("login.getCode") }}</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            size="large"
            @click.native.prevent="handleLogin"
            data-wow-delay="1.6s"
            >{{ $t("login.logIn") }}</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 属性：
// color: String类型。默认'#dedede'。粒子颜色。
// particleOpacity: Number类型。默认0.7。粒子透明度。
// particlesNumber: Number类型。默认80。粒子数量。
// shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
// particleSize: Number类型。默认80。单个粒子大小。
// linesColor: String类型。默认'#dedede'。线条颜色。
// linesWidth: Number类型。默认1。线条宽度。
// lineLinked: 布尔类型。默认true。连接线是否可用。
// lineOpacity: Number类型。默认0.4。线条透明度。
// linesDistance: Number类型。默认150。线条距离。
// moveSpeed: Number类型。默认3。粒子运动速度。
// hoverEffect: 布尔类型。默认true。是否有hover特效。
// hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
// clickEffect: 布尔类型。默认true。是否有click特效。
// clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"。
import { getConfig } from "@/api/user";
import WOW from "wow.js";
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
      loginRules: {
        account: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.accountTip"),
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.passwordTip"),
          },
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.codeTip"),
          },
        ],
      },
      imgUrl: "",
      timestamp: "",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      // needCode: false,
      // codeLength: 4,
      showTxt: false,
      active: 1,
    };
  },
  mounted(){
    var wow = new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: true,
      live: true,
      callback: function (box) {
      },
      scrollContainer: null,
      resetAnimation: true,
    });
    wow.init();
  },
  computed: {
    sysConfig() {
      return this.$store.state.settings.sysConfig;
    },
    loginLoading() {
      return this.$store.state.user.loginLoading;
    },
    needCode(){
      const flag = this.loginConfig && this.loginConfig.enableVerificationCode
      if (flag) {
        this.changeImg()
      }
      return flag
    },
    codeLength(){
      if (this.loginConfig && this.loginConfig.verificationCodeNumber) {
        return this.loginConfig.verificationCodeNumber
      }
      return 4
    }
  },
  watch: {
    loginLoading(val) {
      if (!val) this.loading = false;
    },
  },
  created() {
    const _this = this;
    // document.onkeydown = function (e) {
    //   const { keyCode } = e;
    //   if (keyCode === 13) {
    //     _this.handleLogin();
    //   }
    // };
    if (this.needCode) this.changeImg();
  },
  mounted() {
    this.setShowTxt();
    window.onresize = () => {
      this.setShowTxt();
    };
  },
  destroyed() {
    document.onkeydown = function (e) {
      const { keyCode } = e;
      if (keyCode === 13) {
      }
    };
  },
  methods: {
    setShowTxt() {
      if (document.documentElement.clientHeight <= 840) {
        this.showTxt = false;
      } else {
        this.showTxt = true;
      }
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    getConfig(val) {
      // if (!val) return;
      // getConfig(this.loginForm.account).then((res) => {
      //   this.needCode = !!res.data.enableVerificationCode;
      //   if (this.needCode) {
      //     this.codeLength = res.data.verificationCodeNumber || 4;
      //     this.changeImg();
      //   }
      // });
    },
    handleLogin() {
      if (this.loading) return;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const query = {
            ...this.loginForm,
            timestamp: this.timestamp,
          };
          if (this.accountLogin) {
            this.accountLogin(query)
          }else{
            return false
          }
        } else {
          return false;
        }
      });
    },
    changeImg() {
      let timestamp = Math.random();
      this.timestamp = timestamp;
      this.imgUrl = `/api/oauth/ImageCode/${this.codeLength || 4}/${timestamp}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position:absolute;
  background-color: #6e9abc;

  .login-version {
    position: fixed;
    right: 0px;
    top: 0px;
    width: 82px;
    height: 82px;
    // background: url('../../assets/images/login_version.png') no-repeat center;
    background-size: 100%;

    .login-version-text {
      width: 82px;
      height: 82px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      transform: rotate(45deg);
    }
  }

  .login-left {
    flex: 1;
    height: 100%;
    background: #4393FA;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-company-logo {
      position: absolute;
      left: 0;
      top: 93px;
      display: block;
      height: 76px;
      padding-top: 18px;
      padding-left: 40px;
      width: 806px;
      max-width: 100%;
      margin-bottom: 82px;
      background: linear-gradient(270deg, rgba(67, 147, 250, 0.5) 0%, rgba(133, 182, 252, 0.5) 100%);

      .login-company-logo-img {
        height: 40px;
        position: fixed;
        left: 40px;
        top: 111px;
      }
    }

    .login-banner {
      display: block;
      width: 682px;
      height: 464px;
    }

    .login-left-txt {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 80px;
    }

    .title1 {
      text-align: center;
      font-size: 20px;
      line-height: 28px;
      color: #F8F8F8;
      font-weight: 700;
    }

    .title2 {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #BCD7FA;
      margin: 12px 0 30px;
    }

    .link {
      margin: 30px auto 0;
      display: block;
      color: #fff;
      width: 88px;
      height: 40px;
      border: 1px solid #FFFFFF;
      opacity: 1;
      border-radius: 4px;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
    }
  }

  .login-content {
    width: 700px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .login-cap {
      font-size: 26px;
      line-height: 38px;
      margin-bottom: 26px;
      color: #666666;
    }
  }

  .login-form {
    height: 530px;
    width: 400px;
    padding: 50px 0;
    border-radius: 6px;

    .sms-input {
      width: 260px;
    }

    .sms-right {
      width: 120px;

      &.code-right {
        height: 40px;
        cursor: pointer;
      }

      #imgcode {
        width: 100%;
        height: 40px;
      }

      .smsBtn {
        width: 100%;
      }
    }

    .login-logo {
      width: 100%;
      height: 36px;
      margin-bottom: 35px;
    }

    .login-tab {
      height: 58px;
      margin-bottom: 30px;
      position: relative;
      border-bottom: 1px solid #DCDFE6;

      &::after {
        position: absolute;
        left: 0;
        width: 33.33%;
        height: 2px;
        content: '';
        display: block;
        bottom: -1px;
        background-color: #1890ff;
        z-index: 100;
        transition: .5s;
      }

      &.active1 {
        &::after {
          left: 0;
        }
      }

      &.active2 {
        &::after {
          left: 33.33%;
        }
      }

      &.active3 {
        &::after {
          left: 66.66%;
        }
      }


      .item {
        position: relative;
        width: 33.33%;
        font-size: 20px;
        line-height: 58px;
        color: #666;
        display: inline-block;
        height: 58px;
        text-align: center;

        &.active {
          color: #1890ff;
        }
      }
    }

    .rule-tip {
      color: #a0acb7;
      font-size: 12px;
      line-height: 12px;
      text-align: left;

      >>>.el-form-item__content {
        line-height: 12px;
      }
    }

    .el-form {
      input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #606266 !important;
      }

      input::-webkit-input-placeholder {
        color: #a0acb7;
      }

      .login-btn {
        width: 100%;
        font-size: 16px;
        margin-top: 12px;
      }

      .foot {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #188ae2;

        .register,
        .forget {
          cursor: pointer;
        }
      }
    }

    .login-form-QRCode {
      width: 100%;
      text-align: center;

      .qrcode-img {
        position: relative;
        margin-bottom: 18px;
        width: 220px;
        height: 220px;
      }

      .qrcode-tip {
        color: #334d65;
        line-height: 22px;
        font-size: 16px;
        text-align: center;
      }
    }
  }

  .login-foot {
    position: absolute;
    width: 1060px;
    color: #999;
    font-size: 12px;
    position: fixed;
    bottom: 20px;
    left: 31%;
    text-align: left;
    margin-left: 110px;
  }

  .login-tip{
    color:#4389e3cd;
    font-size:xx-large;
    text-align: center;
    margin-bottom: 20PX;
  }
}
.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #002b5a;
}
</style>