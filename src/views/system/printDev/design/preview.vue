<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="hideModal"
    :width="width + 'mm'"
    :modal-append-to-body="false"
    :show-close="false"
    top="0"
    
  >
    <div v-loading="spinning" style="min-height: 100px;">
      <div id="preview_content_design"></div>
    </div>
    <template slot="title">
      <el-space style="height: 50px; padding: auto;">
        <div style="margin-right: 20px">打印预览</div>
        <el-button
          :loading="waitShowPrinter"
          type="primary"
          icon="el-icon-printer"
          @click.stop="print"
          >打印</el-button
        >
        <el-button type="primary" icon="el-icon-printer" @click.stop="toPdf"
          >pdf</el-button
        >
        <el-button key="close" type="info" @click="hideModal"> 关闭 </el-button>
      </el-space>
    </template>
    <template slot="footer">
      <!-- <el-button key="close" type="info" @click="hideModal"> 关闭 </el-button> -->
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "printPreview",
  props: {},
  data() {
    return {
      visible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      // 数据
      printData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hideModal() {
      this.visible = false;
      console.log(this.$hiPrint)
    },
    show(hiprintTemplate, printData, width = "210") {
      this.visible = true;
      this.spinning = true;
      this.width = hiprintTemplate.editingPanel
        ? hiprintTemplate.editingPanel.width
        : width;
      this.hiprintTemplate = hiprintTemplate;
      this.printData = printData;
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        $("#preview_content_design").html(hiprintTemplate.getHtml(printData));
        this.spinning = false;
      }, 500);
    },
    print() {
      this.waitShowPrinter = true;
      this.hiprintTemplate.print(
        this.printData,
        {},
        {
          callback: () => {
            console.log("callback");
            this.waitShowPrinter = false;
          },
        }
      );
    },
    toPdf() {
      this.hiprintTemplate.toPdf({}, "打印预览");
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
