<template>
  <div class="tem-container app-container">
    <el-button @click="print" class="signs print">打印</el-button>
    <el-button @click="showlip" v-if="showBtn" class="signs">盖章</el-button>
    <div ref="print">
      <div class="tem_list">
        <div class="tem_main">
          <h1>乾通中软信息技术有限责任公司</h1>
          <h2>报 价 单</h2>
          <h4>TO：</h4>
          <p class="title"> 感谢惠顾，现将贵公司所需配件报价如下：</p>
          <p class="lip">一、产品价格</p>
          <div style="padding: 0 1px 0 0">
            <el-table :data="tableData" border>
              <el-table-column prop="order" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="品名" width="150"></el-table-column>
              <el-table-column prop="standards" label="规格" width="100"></el-table-column>
              <el-table-column prop="num" label="数量" width="60"></el-table-column>
              <el-table-column prop="unit" label="单位" width="60"></el-table-column>
              <el-table-column prop="unitprice" label="单价"></el-table-column>
              <el-table-column prop="total" label="金额"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
            </el-table>
          </div>
          <p class="lip">二、通讯联络</p>
          <div class="content1">
            <div class="item">
              <span>需方联系人员：</span>
              <span>丰梦琪</span>
            </div>
            <div class="item">
              <span>供方联系人员：</span>
              <span>应白梦</span>
            </div>
            <div class="item">
              <span>需方联系电话：</span>
              <span>13802141322</span>
            </div>
            <div class="item">
              <span>供方联系电话：</span>
              <span>13802141322</span>
            </div>
            <div class="item">
              <span>需方传真号码：</span>
              <span>010-88888888</span>
            </div>
            <div class="item">
              <span>供方传真号码：</span>
              <span>021-88888888</span>
            </div>
            <div class="item">
              <span>供方地址：</span>
              <span>北京市海淀区西直门北大街42号</span>
            </div>
            <div class="item">
              <span>供方地址：</span>
              <span>上海市青浦区</span>
            </div>
            <div class="item">
              <span>供方邮编：</span>
              <span>100000</span>
            </div>
            <div class="item">
              <span>供方邮编：</span>
              <span>201799</span>
            </div>
          </div>
          <div class="temdate">日 期：2017-11-29</div>
          <div class="seal">盖章：</div>
        </div>
        <VueDragResize :isDraggable="showBtn" :w="150" :h="150" :isResizable='false' v-if="showsin">
          <img :src="qt.loadFile(companySeal)" alt="" />
          <div class="signBtn">
            <el-button @click="signclick" v-if="showBtn">确认</el-button>
            <el-button @click="cancelSign" v-if="showBtn">取消</el-button>
          </div>
        </VueDragResize>
      </div>
    </div>
  </div>
</template>
<script>
import VueDragResize from 'vue-drag-resize'
import printStyle from '../printData/printStyle'

export default {
  name: 'extend-signet',
  data() {
    return {
      showSign: true,
      showBtn: true,
      showsin: false,
      key: '',
      labelPosition: 'right',
      connect: {
        user: '丰梦琪',
        supply: '应白梦',
        userPhone: '13802141322',
        supplyPhone: '13004363886',
        useremail: '010-88888888',
        supplyemail: '021-88888888',
        useraddress: '北京市海淀区西直门北大街42号',
        supplyaddress: '上海市青浦 区',
        userPostcode: '100000',
        suPostcode: '201799'
      },
      companySeal:'',
      tableData: [{
        order: '1',
        name: '服务器硬件',
        standards: '联想',
        num: '5',
        unit: '台',
        unitprice: '20000.00',
        total: '100000.00',
        remarks: ''
      }, {
        order: '2',
        name: '数据库正版',
        standards: 'SQLServer',
        num: '5',
        unit: '套',
        unitprice: '9998.00',
        total: '49990.00',
        remarks: ''
      }, {
        order: '3',
        name: 'OA内部管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '	390000.00',
        total: '	390000.00',
        remarks: ''
      }, {
        order: '4',
        name: '进销存管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '260000.00',
        total: '260000.00',
        remarks: ''
      }, {
        order: '5',
        name: '	服务费',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '80000.00',
        total: '80000.00',
        remarks: ''
      }, {
        order: '6',
        name: '差旅费用',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '60000.00',
        total: '80000.00',
        remarks: ''
      }]
    }
  },
  async created() {
    await this.$request.get('/api/system/SysConfig')
        .then(res => {
          const { data } = res
            this.companySeal = data.companySeal
        })
  },
  components: { VueDragResize },
  methods: {
    print() {
      let print = this.$refs.print.innerHTML
      let printPart = print + printStyle;
      let newTab = window.open('_blank');
      newTab.document.body.innerHTML = printPart;
      newTab.print();
      newTab.close();
    },
    showlip() {
      this.showsin = true
    },
    signclick() {
      this.showSign = false
      this.showBtn = false
    },
    cancelSign() {
      this.showsin = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tem-container {
  background: #ebeef5 !important;
  overflow: auto;
  position: relative;
  padding: 0;
  .signs {
    position: absolute;
    right: 10px;
    top: 70px;
    &.print {
      top: 20px;
    }
  }
  .signBtn {
    display: flex;
    justify-content: space-between;
  }
  .tem_list {
    width: 800px;
    margin: 0 auto;
    background: #fff;
    // box-shadow: rgb(189, 189, 189) 0px 0px 10px;
    color: #606266;
    position: relative;
    .tem_main {
      width: 90%;
      margin: 0 auto;
      font-size: 12px;
      padding-bottom: 15px;
      h1 {
        padding-top: 36px;
      }
      h1,
      h2 {
        text-align: center;
        color: #475059;
      }
      .title {
        border-bottom: 2px dashed #000;
        padding-left: 30px;
        line-height: 30px;
        font-size: 12px;
      }
      .lip {
        padding: 20px 0;
      }

      .demo-form-inline {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        border-bottom: 1px solid #ebeef5;
        width: 48%;
        margin: 0;
        >>> .el-input__inner {
          border: 0 !important;
          padding: 0;
          width: 220px;
          font-size: 12px;
        }
        >>> .el-form-item__label {
          font-size: 12px;
        }
      }
      .temdate {
        text-align: right;
        margin: 20px 60px;
      }
      .seal {
        text-align: right;
        margin: 10px 120px;
        padding-bottom: 40px;
      }
    }
  }
  .vdr.active:before {
    outline: 0;
  }
  .vdr.active {
    img {
      width: 100%;
      height: 100%;
    }
  }
  >>> .el-table thead tr th {
    background: #fff !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    background: #fff !important;
  }
  .content1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .item {
      width: 345px;
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;
      span {
        font-size: 12px;
        padding: 10px 0;
        color: #606266;
      }
    }
  }
}
</style>