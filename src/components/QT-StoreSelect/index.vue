<template>
  <el-dialog
    title="选择商品"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="QT-dialog QT-dialog_center"
    lock-scroll
    append-to-body
    width="90%"
    v-loading="detailLoading"
    element-loading-background="rgba(255,255,255,0)"
    element-loading-text="拼命加载中"
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
        <el-col :span="14">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="init(record)"
              >{{ $t("common.search") }}
            </el-button>
            <el-button icon="el-icon-refresh" @click="refresh()"
              >{{ $t("common.reset") }}
            </el-button>
            <!-- <el-button v-if="ShowTransfer" type="warning" icon="el-icon-refresh-right" @click="openTransfer()"
              >快速调拨</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
      <div class="QT-common-search-box-right">
        <!-- <el-tooltip
          effect="dark"
          :content="$t('common.refresh')"
          placement="top"
        >
          <el-link
            icon="icon-qt icon-qt-Refresh QT-common-head-icon"
            :underline="false"
            @click="init()"
          />
        </el-tooltip> -->
      </div>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="12">
        <QT-table
          ref="tableRef"
          v-loading="listLoading"
          :data="list"
          highlight-current-row
          @current-change="handleCurrentChange"
          :border="true"
          height="500"
          size="mini"
        >
          <el-table-column prop="productName" label="商品名称" width="200" />
          <el-table-column prop="name" label="规格型号" width="100" />
          <slot name="list"></slot>
          <el-table-column prop="num" label="数量" width="100" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.num"
                size="mini"
                @focus="(e) => e.target.select()"
                :controls="false"
                :min="0"
                :style="{ width: '100%' }"
                placeholder="请输入"
                clearable
                @change="numChange(scope.row)"
                :disabled="detailLoading"
                :ref="'numRef_' + scope.row.id"
              />
            </template>
          </el-table-column>
        </QT-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="init"
        />
      </el-col>
      <el-col :span="12">
        <QT-table
          ref="storeDetailRef"
          :data="storeDetailList"
          size="mini"
          :height="storeOtherDetailList.length>0?'250':'500'"
          border
          @select="handleSelect"
          v-loading="listLoading"
          tableKey="storeDetailList"
          show-summary :summary-method="e=>qt.tableSummaries(e,['num'])"
        >
          <!-- <el-table-column label="操作" fixed="left" width="50">
            <template slot-scope="scope">
              <el-button type="text" @click="unpackingHandle(scope.row)"
                >拆包</el-button
              >
            </template>
          </el-table-column> -->
          <el-table-column
            type="selection"
            width="50"
            label="序号"
            align="center"
          />          
          <el-table-column prop="oidName" min-width="120" label="公司名称" >
            <template slot-scope="scope">
              <span :class="scope.row.oid != userInfo.companyId ? 'text-red' : ''" >{{ scope.row.oidName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cgNo" min-width="160" label="采购单号" />
          <el-table-column prop="supplierName" label="供应商" />
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="gidName" label="商品规格" />
          <el-table-column
            prop="creatorTime"
            label="入库时间"
            width="130"
            :formatter="qt.tableDateFormat"
          />
          <el-table-column prop="storeRome" label="仓库" />
          <el-table-column prop="storeRomeArea" label="库区" />
          <el-table-column prop="price" label="入库单价" />
          <el-table-column prop="num" label="剩余数量" />
          <el-table-column prop="inType" label="入库类型" >
            <template slot-scope="scope">{{ scope.row.inType | dynamicText(inTypeOptions,'enCode','fullName') }}</template>
          </el-table-column>
          <el-table-column prop="productionDate" label="生产日期" :formatter="(row,cell,value)=>qt.dateFormat(value,'YYYY-MM-DD')" />
          <el-table-column prop="retention" label="保质期" />
          <!-- <el-table-column prop="time" label="time" /> -->
          <!-- <el-table-column prop="useNum" label="使用数量" /> -->
          <el-table-column label="操作" fixed="right" width="50">
            <template slot-scope="scope">
              <!-- || scope.row.inType == '7' -->
              <el-button v-if="scope.row.oid == userInfo.companyId && scope.row.inType == '5' " type="text" @click="handleRemoveTS(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </QT-table>
      </el-col>
      <el-col :span="12" v-if="storeOtherDetailList.length>0">
        <el-table
          ref="storeDetailRef2"
          :data="storeOtherDetailList"
          size="mini"
          height="250"
          border
        >
          <el-table-column label="操作" fixed="left" width="50">
            <template slot-scope="scope">
              <el-button type="text" @click="unpackingHandle(scope.row)"
                >拆包</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="gidName" label="商品规格" />
          <el-table-column
            prop="creatorTime"
            label="入库时间"
            width="130"
            :formatter="qt.tableDateFormat"
          />
          <el-table-column prop="storeRome" label="仓库" />
          <el-table-column prop="storeRomeArea" label="库区" />
          <el-table-column prop="num" label="剩余数量" />
        </el-table>
      </el-col>
    </el-row>
    <CreateTsForm
      v-if="showCreateTsForm"
      ref="CreateTsFormRef"
      @ok="handleCreateTs"
    ></CreateTsForm>
    <UnpackingForm
      v-if="showUnpackingForm"
      ref="unpackingFormRef"
      @ok="handleCreateTs"
    ></UnpackingForm>
    <TransferForm v-if="showTransferForm" ref="transferFormRef" @ok="handleCreateDb"></TransferForm>
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
import request from "@/utils/request";
import { message } from "@/utils/message";
import CreateTsForm from "./CreateTsForm.vue";
import { mapGetters } from "vuex";
import UnpackingForm from "./UnpackingForm.vue";
import TransferForm from "./TransferForm.vue";
export default {
  components: { CreateTsForm,UnpackingForm,TransferForm },
  data() {
    return {
      visible: false,
      listLoading: true,
      keyword: "",
      list: [],
      total: 0,
      checked: [],
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      storeDetailList: [],
      storeOtherDetailList: [],
      detailLoading: false,
      currentRow: null,
      record: null, // 外部传进来的记录
      showCreateTsForm: false, // 创建特殊入库
      showUnpackingForm: false, // 创建拆包出库和入库
      enableCreateTs:false, // 是否允许创建特殊入库
      inTypeOptions:[],
      showTransferForm:false, // 快速调拨
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  props: {
    beforeQuery: {
      type: Function,
    },
    storeBeforeQuery: {
      type: Function,
    },
    afterQuery: {
      type: Function,
    },
    // 禁用创建特殊入库，优先级最高
    DisableCreateTs:{
      type:Boolean
    },
    // 是否显示快速调拨
    ShowTransfer:{
      type:Boolean 
    }
  },
  created(){
    this.$store.dispatch('base/getDictionaryData', { sort: 'QTErpRklx' }).then((res) => this.inTypeOptions = JSON.parse(JSON.stringify(res)))

   
  },
  methods: {
    async showDialog(row){
      // 获取配置
        await this.$request.get('/api/permission/Users/current/actions/EnableCreateTs').then(res=>{
          this.enableCreateTs = res.data.erpEnableCreateTs
        })
      this.init(row)
    },
    async init(row) {
      // 清空数据
      this.list.splice(0);
      this.storeDetailList.splice(0);
      this.storeOtherDetailList.splice(0);
      this.visible = true;
      this.listLoading = true;
      this.currentRow = null;
      this.record = row;
      this.detailLoading = false

      // 获取配置
      // await this.$request.get('/api/system/SysConfig').then(res=>{
      //   this.enableCreateTs = res.data.erpEnableCreateTs == 1
      // })

     

      // console.log('DisableCreateTs:',this.DisableCreateTs)

      if (this.DisableCreateTs == true) {
        this.enableCreateTs = false
      }


      let query = { ...this.listQuery, ...{ keyword: this.keyword } };
      if (this.beforeQuery) {
        this.beforeQuery(query, row);
      }
      await request({
        url: `/api/Erp/ErpProduct/PageSelector`,
        method: "GET",
        data: query,
      }).then((res) => {
        this.list = res.data.list.map((x) => ({
          ...x,
          storeNum:x.num,
          num: "",
          storeDetailList: [],
        }));
        if (!!this.afterQuery) {
          this.afterQuery(this.list, row);
        }
        this.total = res.data.pagination.total;

        // 如果只有一条记录，默认选中
        // if (this.list.length == 1) {
        //   this.$refs.tableRef.$refs.QTTable.setCurrentRow(this.list[0]);
        //   // this.$refs.tableRef.setCurrentRow(this.list[0]);     
        //   this.hand   
        // }
        
        this.listLoading = false;
      });
    },
    refresh() {
      this.keyword = "";
      this.init(this.record);
    },
    select() {
      // 获取设置了数量的记录
      const rows = this.list.filter((x) => x.num > 0);
      if (!rows.length) return;

      // 判断是否库存不足
      for (let index = 0; index < rows.length; index++) {
        const ele = rows[index];
        const { num, storeDetailList } = ele;
        const n = this.qt.sum(storeDetailList, "num")
        if (num > n) {
          this.$refs.tableRef.$refs.QTTable.setCurrentRow(ele);
          if (this.enableCreateTs) {
            //弹窗生成特殊入库
            this.showCreateTsForm = true;
            this.$nextTick(() => {
              this.$refs.CreateTsFormRef.init(ele, {
                gid: ele.id,
                oid: this.userInfo.companyId,
                inNum: Number((num - n).toFixed(2)),
              });
            });
          }
          return message.warning("当前商品库存不足！");
        }
      }

      this.visible = false;
      this.$emit("ok", rows, this.record);

      //   if (!this.checked.length) return;
      //   this.visible = false;
      //   this.$emit("refreshDataList", this.checked);
    },
    /**
     * 用户手动选择
     */
    handleSelect(selection, row) {
      const { storeDetailList } = this.currentRow;
      storeDetailList.splice(0);
      row.time = selection.find((x) => x.id == row.id)
        ? new Date().getTime()
        : 0;
      selection.forEach((x) => {
        if (x.time == 0) {
          this.$refs.storeDetailRef.toggleRowSelection(x, false);
        } else {
          storeDetailList.push({ ...x });
        }
      });
      // console.log("handleSelect:", selection, row);
    },
    async handleCurrentChange(row) {
      // const index = this.list.findIndex(x=>x == row)
      // console.log("handleCurrentChange:", index);
      this.currentRow = row;
      this.storeDetailList.splice(0);
      if (!!row) {
        this.detailLoading = true;
        let query = {};
        if (this.storeBeforeQuery) {
          this.storeBeforeQuery(query);
        }
        await request({
          url: "/api/Erp/ErpInorder/Store/" + row.id,
          method: "get",
          data: query,
        })
          .then((res) => {
            this.storeDetailList.push(
              ...res.data.map((x) => ({ ...x, useNum: 0, time: "" }))
            );

            // 设置选中状态
            const { storeDetailList } = row;
            if (!!storeDetailList && storeDetailList.length > 0) {
              storeDetailList.forEach((x) => {
                const item = this.storeDetailList.find((a) => a.id == x.id);
                // Object.assign(item,x)
                if (item) {
                  item.useNum = x.useNum;
                  this.$refs.storeDetailRef.toggleRowSelection(item);
                }
              });
            }
          })
          // .finally((_) => (this.detailLoading = false));

          await this.loadOtherStore(row);

          this.$nextTick(() => {
            setTimeout(() => {
               const inputNumber  = `numRef_${row.id}`
              // 重点：el-input-number 内部有个 input，需调用 $refs.xxx.focus()
              if (this.$refs[inputNumber]) {
                let first;
                if (this.$refs[inputNumber].length > 0) {
                first = this.$refs[inputNumber][0];
                } else {
                  first =this.$refs[inputNumber]
                  
                }
                first.focus();
                // 然后选中 input 的内容
                const input = first.$el.querySelector("input");
                if (input) {
                  input.select();
                }
                // this.$refs.inputNumber[0].focus();
              }
            }, 2000);
          });
      }
    },
    async loadOtherStore(row){      
      this.storeOtherDetailList.splice(0);
      await request({
          url: "/api/Erp/ErpInorder/Store/" + row.id,
          method: "get",
          data: {
            otherSpec:true
          },
        })
          .then((res) => {
            this.storeOtherDetailList = res.data
          })
          .finally((_) => (this.detailLoading = false));
    },
    /** 输入数量 */
    async numChange(row) {
      const { num } = row;
      let needNum = num;
      const storeDetailList = [];
      //每次改变数量，先清空选择
      // console.log("numChange:", this.$refs.storeDetailRef);
      this.$refs.storeDetailRef.clearSelection();
      for (let index = 0; index < this.storeDetailList.length; index++) {
        const ele = this.storeDetailList[index];
        if (needNum >= ele.num) {
          ele.useNum = ele.num;
          needNum = needNum - ele.num;
          storeDetailList.push({ ...ele, time: 0 });
          this.$refs.storeDetailRef.toggleRowSelection(ele, true);
        } else {
          if (needNum > 0) {
            ele.useNum = needNum;
            needNum = 0;
            storeDetailList.push({ ...ele, time: 0 });
            this.$refs.storeDetailRef.toggleRowSelection(ele, true);
            break;
          }
        }
      }
      row.storeDetailList.splice(0);
      row.storeDetailList.push(...storeDetailList);

      //判断数量够不够
      await this.checkStore(row,false);
    },
    /** 判断是否够库存 */
    checkStore(row,createTs) {
      const { num, storeDetailList } = row;
      if (num > 0) {
        let n = this.qt.sum(storeDetailList, "num");
        if (num > n) {
          // return message.warning("当前商品库存不足！");
          if (this.storeOtherDetailList.length == 0) {
            if (this.enableCreateTs && createTs) {
              //弹窗生成特殊入库
              this.showCreateTsForm = true;
              this.$nextTick(() => {
                this.$refs.CreateTsFormRef.init(row, {
                  gid: row.id,
                  oid: this.userInfo.companyId,
                  inNum: Number((num - n).toFixed(2)),
                });
              });
            }
            
          } else{
            if (this.enableCreateTs) {
              this.$confirm("当前商品库存不足，是否生成特殊入库？", "提示", {
                
              }).then(res=>{
                //弹窗生成特殊入库
                this.showCreateTsForm = true;
                this.$nextTick(() => {
                  this.$refs.CreateTsFormRef.init(row, {
                    gid: row.id,
                    oid: this.userInfo.companyId,
                    inNum: Number((num - n).toFixed(2)),
                  });
                });
              }).catch(e=>{})
            }
            
          }             
        }
      } else {
        storeDetailList.splice(0);
      }
    },
    async handleCreateTs() {
      await this.handleCurrentChange(this.currentRow);
      await this.numChange(this.currentRow);

      this.select()
    },
    async handleCreateDb(){
      this.showTransferForm = false
      await this.handleCurrentChange(this.currentRow);
      await this.numChange(this.currentRow);
      this.select()
    },
    // 拆包操作
    async unpackingHandle(row) {
      const { productId, gid } = row;
      try {
        const res = await this.$request({
          url: `/api/Erp/ErpProduct/${productId}`,
        });
        const { erpProductmodelList } = res.data;
        if (erpProductmodelList && erpProductmodelList.length > 1) {
          console.log(row, productId, gid);
          this.showUnpackingForm = true;
          this.$nextTick(()=>{
            this.$refs.unpackingFormRef.init(res.data, row, this.currentRow.num)
          })
         
        } else {
          return this.$message.warning("该商品无法拆包！");
        }
      } catch (error) {}
    },
    async handleRemoveTS(row){
      const {billId,inType} = row
      if (billId && (inType == 5 || inType == 7)) {
        this.detailLoading = true
        this.$request({
            url: `/api/Erp/ErpInorder/${billId}`,
            method: 'DELETE'
        }).then(async res => {          
          await this.handleCreateTs()
          this.detailLoading = false
        })
      }
      
    },
    openTransfer(){
      if (!this.currentRow) {
        return this.$message.warning("请先选择商品！");
      }
      // console.log(this.currentRow)     
      this.showTransferForm = true
      this.$nextTick(()=>{
        this.$refs.transferFormRef.init(this.currentRow)
      })
    },
    async handleTransfer() {
      // await this.handleCurrentChange(this.currentRow);
      // await this.numChange(this.currentRow);

      // this.select()
    },
  },
};
</script>
  <style lang="scss" scoped>
   >>> .el-dialog__body {
    height: 100% !important;
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

    

    .text-red{
      color: red;
    }
  }

</style>