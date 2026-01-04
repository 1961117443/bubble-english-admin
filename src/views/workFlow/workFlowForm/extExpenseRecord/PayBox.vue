<template>
  <el-dialog
    title="选择商品"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="QT-dialog QT-dialog_center"
    lock-scroll
    append-to-body
    width="700px"
  >
    <el-row class="QT-common-search-box" :gutter="16">
      <el-form @submit.native.prevent>
        <el-col :span="10">
          <el-form-item label="关键词">
            <el-input
              v-model="keyword"
              placeholder="请输入关键词查询"
              clearable
              @keyup.enter.native="init()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="init()"
              >{{ $t("common.search") }}
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="refresh()"
              >{{ $t("common.reset") }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="QT-common-search-box-right">
        <el-tooltip
          effect="dark"
          :content="$t('common.refresh')"
          placement="top"
        >
          <el-link
            icon="icon-qt icon-qt-Refresh QT-common-head-icon"
            :underline="false"
            @click="init()"
          />
        </el-tooltip>
      </div>
    </el-row>
    <QT-table
      v-loading="listLoading"
      :data="list"
      hasC
      @selection-change="handleSelectionChange"
      :border="true"
    >
      <el-table-column prop="billDate" label="日期" align="left">
        <template slot-scope="scope">
          <span>{{ qt.toDate(scope.row.billDate, "yyyy-MM-dd") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额（元）" align="center" />
      <el-table-column prop="label" label="标签" align="left">
        <template slot-scope="scope">
          <template v-if="scope.row.label">
            <el-tag
              size="mini"
              v-for="item in scope.row.label.split(',')"
              :key="item"
              type="info"
              >{{ item }}</el-tag
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="费用说明" align="left" />
    </QT-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        $t("common.cancelButton")
      }}</el-button>
      <el-button type="primary" @click="select()">{{
        $t("common.confirmButton")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { GoodsList } from '@/api/extend/order'
export default {
  data() {
    return {
      visible: false,
      listLoading: true,
      keyword: "",
      list: [],
      total: 0,
      checked: [],
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.listLoading = true;
      let query = { keyword: this.keyword };
      this.$request({
        url: "/api/extend/FinancialRecord/current/pay",
        method: "get",
        data: query,
      }).then((res) => {
        this.list = res.data;
        this.listLoading = false;
      });
    },
    refresh() {
      this.keyword = "";
      this.init();
    },
    select() {
      if (!this.checked.length) return;
      this.visible = false;
      this.$emit("refreshDataList", this.checked);
    },
    handleSelectionChange(val) {
      this.checked = val;
    },
  },
};
</script>
<style lang="scss" scoped>
>>> .el-dialog__body {
  height: 70vh;
  padding: 0 0 10px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .QT-common-search-box {
    margin-bottom: 0;
    .QT-common-search-box-right {
      padding: 10px 10px 0 0;
    }
  }
}
</style>