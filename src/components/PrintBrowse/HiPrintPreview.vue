<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false" v-on="$listeners" @open="onOpen"
    fullscreen lock-scroll class="QT-full-dialog" :show-close="false" :modal="false" append-to-body>
    <div class="QT-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/qt.png" class="header-logo" />
        <p class="header-txt"> · 打印预览</p>
      </div>
      <div class="options">
        <el-button type="primary" size="small" @click.stop="toPdf">Pdf下载</el-button>
        <el-button type="primary" size="small" icon="el-icon-printer" @click.stop="print">打印</el-button>
        <el-button @click="hideModal()">{{ $t('common.cancelButton') }}</el-button>
      </div>
    </div>
    <div class="main" v-loading="spinning" style="min-height: 100px;">
      <!-- <div ref="tsPrint" class="print-content" v-html="printTemplate" /> -->
      <div id="preview_content_design"></div>
    </div>
  </el-dialog>
</template>
  
<script>
import { mapGetters } from "vuex"
import { getData } from '@/api/system/printDev'
export default {
  name: "printPreview",
  props: ['id', 'formId', 'fullName'],
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    hideModal() {
      // this.visible = false;
      this.$emit('update:visible', false)
    },
    onOpen() {
      // console.log(this.$hiPrint)
      if (!this.id) return
      this.printTemplate = ''
      this.data = {}
      this.loading = true
      let query = {
        id: this.id,
        formId: this.formId
      }
      getData(query).then(res => {
        if (!res.data) return
        console.log(res.data)
        const { printTemplate,printData} = res.data
        this.printTemplate = res.data.printTemplate
        this.data = res.data.printData
        this.recordList = res.data.operatorRecordList || []
        // this.$nextTick(() => {
        //   const tableList = this.$refs.tsPrint.getElementsByTagName('table')
        //   if (tableList.length) {
        //     for (let j = 0; j < tableList.length; j++) {
        //       const tableObj = tableList[j];
        //       let tds = []
        //       let newTable = []
        //       for (let i = 0; i < tableObj.rows.length; i++) {
        //         tds = tableObj.rows[i]
        //         const dataTag = this.isChildTable(tds.cells)
        //         if (dataTag) {
        //           this.retrieveData(dataTag, tableObj, tds, newTable)
        //         } else {
        //           newTable.push(tds)
        //         }
        //       }
        //       tableObj.getElementsByTagName('tbody')[0].innerHTML = ''
        //       for (let i = 0; i < newTable.length; i++) {
        //         tableObj.getElementsByTagName('tbody')[0].appendChild(newTable[i])
        //       }
        //     }
        //   }
        // })
        // this.replaceValue(this.data)
        // this.replaceSysValue()
        
        var hiprintTemplate = new this.$hiPrint.PrintTemplate({
          template: JSON.parse(printTemplate),
        });
        this.show(hiprintTemplate,printData)
        this.loading = false
      })
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

#hiprint-printPaper{
  .hiprint-printPaper{
    margin: auto;
    background-color: #fff;
  }
}

::v-deep .ant-modal-body {
  padding: 0px;
}

::v-deep .ant-modal-content {
  margin-bottom: 24px;
}
</style>
  