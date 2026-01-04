<template>
  <el-row class="el-space" :gutter="10" v-bind="$attrs" type="flex" style="align-items: center;margin-left: 0;margin-right: 0;">
    <slot></slot>
  </el-row>
</template>

<script>
export default {};
</script>


<style lang="scss">
.el-space button {
  margin-right: 8px;
}
</style>