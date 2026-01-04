<template>
  <div :class="'qt-button qt-button-'+align">
    <el-button v-bind="$attrs" v-on="$listeners">{{buttonText}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    align: {
      default: 'left'
    },
    buttonText: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.qt-button {
  width: 100%;
  &.qt-button-left {
    text-align: left;
  }
  &.qt-button-center {
    text-align: center;
  }
  &.qt-button-right {
    text-align: right;
  }
}
</style>