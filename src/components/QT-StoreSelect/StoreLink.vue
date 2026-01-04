<template>
  <el-popover  trigger="click" @show="initData()">
    <QT-table :data="list" height="300" v-loading="listLoading">
      <el-table-column prop="tidName" label="商品分类" width="100" />
      <el-table-column prop="productName" label="商品名称" width="130" />
      <el-table-column prop="gidName" label="商品规格" width="100" />
      <el-table-column prop="num" label="库存数量" width="100" align="center" />
    </QT-table>
    <pagination
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="initData"
    />
    <el-button slot="reference" type="text">
      <slot></slot>
    </el-button>
  </el-popover>
</template>

<script>
import { Loading } from 'element-ui';
export default {
  data() {
    return {
      visible: false,
      list: [],
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      listLoading:false
    };
  },
  props: {
    gid: {
      type: String,
      required: true,
    },
    // 是否带出关联产品
    whetherRelation: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
        menuId: this.menuId,
        gid: this.gid,
        whetherRelation: this.whetherRelation,
      };
      let query = {};
      for (let key in _query) {
        if (Array.isArray(_query[key])) {
          query[key] = _query[key].join();
        } else {
          query[key] = _query[key];
        }
      }
    //   let loadingInstance = Loading.service();
      this.$request({
        url: `/api/Erp/ErpInorder/Store`,
        method: "GET",
        data: query,
      }).then((res) => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      })
    //   .finally(_=> loadingInstance.close());
    },
  },
};
</script>