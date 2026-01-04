/**
* @Author: 858834013@qq.com
* @Name: rememberPwd
* @Date: 2022-07-09
* @Desc: 记住密码
*/
<template>
  <div class="rememberPwd">
    <el-checkbox fill="#24cdff" v-model="rememberPwd">记住密码</el-checkbox>
  </div>
</template>

<script>

export default {
  name: "rememberPwd",
  components: {},
  props: {
    password: {
      type: String,
      default() {
        return '';
      }
    },
    username: {
      type: String,
      default() {
        return '';
      }
    },
  },
  data() {
    return {
      rememberPwd: false
    }
  },
  watch: {
    rememberPwd() {
      localStorage.setItem('rememberPwd', this.rememberPwd)
    }
  },
  mounted() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const rememberPwd = localStorage.getItem('rememberPwd');
    if (rememberPwd) {
      this.rememberPwd = true
    } else {
      this.rememberPwd = false
    }
    if (this.rememberPwd) {
      this.$emit('update:username', username)
      this.$emit('update:password', password)
    } else {
      // this.$emit('update:username', '')
      // this.$emit('update:password', '')
    }
  },
  methods: {
    rememberPassword() {
      if (this.rememberPwd) {
        localStorage.setItem('username', this.username);
        localStorage.setItem('password', this.password);
        localStorage.setItem('rememberPwd', true);
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberPwd');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.rememberPwd {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  ::v-deep {
    .el-checkbox__label {
      color: #fff;
    }

    .el-checkbox.is-checked {
      color: #fff;

      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #24cdff;
        border-color: #24cdff;
      }
    }

    .el-checkbox__label {
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>

