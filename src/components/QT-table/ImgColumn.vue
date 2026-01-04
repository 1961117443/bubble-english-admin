<!-- 表格中的图片列 -->
<template>
  <el-table-column :prop="prop" :label="label || label=='' ? label : '图片'" v-bind="$attrs">
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
  props: ["prop", "label","isJson"],
  methods: {
    getPropValue(row){
      let obj = row[this.prop]
      if (this.isJson && !!obj) {
        obj = JSON.parse(obj)
      }
      if (!obj && this.prop.indexOf('.')>-1) {
        const arr = this.prop.split('.')
        obj = row
        for (let index = 0; index < arr.length; index++) {
          const p = arr[index];
          obj = obj[p]

          if (!obj) {
            break;
          }
          
        }
      }
      
      return obj
    },
    showImage(row) {
      const v = this.getPropValue(row)
      // console.log(v)
      if (v) {
        if (Array.isArray(v)) {
          if (v.length == 0) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    imageUrl(row) {
      const v = this.getPropValue(row)
      let url = Array.isArray(v) ? v[0] : v;
      // console.log(url)
      return `${this.define.comUrl}${this.getUrl(url)}`;
    },
    getUrl(url){
      if (typeof url == 'object') {
        url = url.url
      }
      return url
    },
    imageList(row) {
      const v = this.getPropValue(row)
      return Array.isArray(v)
        ? v.map((x) => `${this.define.comUrl}${this.getUrl(x)}`)
        : [`${this.define.comUrl}${this.getUrl(v)}`];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>