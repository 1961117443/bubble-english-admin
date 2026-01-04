<!-- 表格中的图片列 -->
<template>
  <el-table-column :prop="prop" :label="label ? label : '图片'">
    <template slot-scope="scope">
      <el-image
        v-if="showImage(scope.row)"
        style="width: 40px; height: 40px"
        :src="imageUrl(scope.row)"
        :preview-src-list="imageList(scope.row)"
      >
      </el-image>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: ["prop", "label"],
  methods: {
    showImage(row) {
      if (row[this.prop]) {
        if (Array.isArray(row[this.prop])) {
          if (row[this.prop].length == 0) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    imageUrl(row) {
      const url = Array.isArray(row[this.prop]) ? row[this.prop][0] : row[this.prop];
      return `${this.define.comUrl}${url}`;
    },
    imageList(row) {
      return Array.isArray(row[this.prop])
        ? row[this.prop].map((x) => `${this.define.comUrl}${x}`)
        : [`${this.define.comUrl}${url}`];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>