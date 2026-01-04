<template>
  <div>
    <el-button type="primary" @click="show"> 查看模板json </el-button>
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="hideModal"
      :modal-append-to-body="false"
    >
      <el-input
        v-loading="spinning"
        type="textarea"
        style="width: 100%; height: 50vh"
        :autosize="{ minRows: 10, maxRows: 20 }"
        v-model="jsonOut"
      />
      <template slot="title">
        <el-space style="padding: 10px;">    
          <span style="margin-right: 20px;">JSON</span>     
          <el-switch
          active-text="tid模式"
          inactive-text="默认"
            v-model="tidMode"
            @change="onModeChange"
            style="margin-right: 20px;"
          />
          <el-switch
          active-text="美化"
          inactive-text="压缩"
            v-model="beautify"
            @change="onModeChange"
          />
        </el-space>
      </template>
      <template slot="footer">
        <el-button key="close" type="info" @click="hideModal"> 关闭 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JSONView",
  props: {
    template: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
      spinning: true,
      jsonOut: "",
      tidMode: false,
      beautify: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hideModal() {
      this.visible = false;
    },
    show() {
      this.visible = true;
      this.spinning = true;
      setTimeout(() => {
        let json = this.tidMode
          ? this.template.getJsonTid()
          : this.template.getJson();
        let beautify = this.beautify ? 2 : 0;
        this.jsonOut = JSON.stringify(json, null, beautify);
        this.spinning = false;
      }, 500);
    },
    onModeChange() {
      this.show();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .ant-modal-body {
  padding: 0px;
}

::v-deep .ant-modal-content {
  margin-bottom: 24px;
}
</style>
