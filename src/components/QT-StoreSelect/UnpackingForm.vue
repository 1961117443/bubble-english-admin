<template>
  <el-dialog
    title="拆包"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="QT-dialog QT-dialog_center"
    lock-scroll
    append-to-body
    width="30%"
    v-loading="detailLoading"
    element-loading-background="rgba(255,255,255,0)"
    element-loading-text="拼命加载中"
    @close="closeDialog"
  >
    <!-- <div :style="{ margin: '10 auto', width: '100%' }" class="create-ts-form"> -->
    <el-row :gutter="15" class="main">
      <el-form
        ref="elForm"
        :model="dataForm"
        size="small"
        label-width="150px"
        label-position="right"
        :rules="rules"
      >
        <el-col :span="24">
          <el-form-item v-if="storeRow" label="商品名称">
            {{ storeRow.productName }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="需求数量">
            {{ needNum }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="拆包规格" prop="gid">
            <el-select v-model="dataForm.gid" placeholder="" clearable disabled>
              <el-option
                v-for="(item, index) in erpProductmodelList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目标规格" prop="tGid">
            <el-select v-model="dataForm.tGid" placeholder="" clearable>
              <el-option
                v-for="(item, index) in erpProductmodelList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.id === dataForm.gid"
              >
                {{ item.name }} (1:{{ item.ratio }})
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="storeRow">
          <el-form-item label="库存数量">
            {{ storeRow.num
            }}{{
              dataForm.gid | dynamicText(erpProductmodelList, "id", "name")
            }}
            = {{ convertRation
            }}{{
              dataForm.tGid | dynamicText(erpProductmodelList, "id", "name")
            }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="拆包数量" prop="outNum">
            <el-input-number
              v-model="dataForm.outNum"
              :style="{ width: '100%' }"
              placeholder="数字文本"
              :min="0"
              :step="1"
              :controls="false"
            >
            </el-input-number>
            {{ dataForm.outNum
            }}{{
              dataForm.gid | dynamicText(erpProductmodelList, "id", "name")
            }}
            = {{ unpackingNum
            }}{{
              dataForm.tGid | dynamicText(erpProductmodelList, "id", "name")
            }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        $t("common.cancelButton")
      }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{
        $t("common.confirmButton")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { dynamicText } from "@/filters";

export default {
  data() {
    return {
      visible: false,
      detailLoading: false,
      dataForm: {
        gid: "",
        tGid: "",
        outNum: 1,
      },
      erpProductmodelList: [],
      rules: {
        outNum: [{ required: true, message: "入库数量", trigger: "change" }],
        tGid: [{ required: true, message: "目标规格", trigger: "change" }],
      },
      storeRow: undefined,
      needNum: 0,
    };
  },
  computed: {
    convertRation() {
      const { gid, tGid } = this.dataForm;
      if (gid && tGid) {
        const e1 = this.erpProductmodelList.find((it) => it.id == gid);
        const e2 = this.erpProductmodelList.find((it) => it.id == tGid);
        if (!!e1.ratio && !!e2.ratio && e2.ratio < e1.ratio) {
          return Number(((this.storeRow.num * e1.ratio) / e2.ratio).toFixed(2));
        }
      }
      return "-";
    },
    unpackingNum() {
      const { gid, tGid } = this.dataForm;
      if (gid && tGid) {
        const e1 = this.erpProductmodelList.find((it) => it.id == gid);
        const e2 = this.erpProductmodelList.find((it) => it.id == tGid);
        if (!!e1.ratio && !!e2.ratio && e2.ratio < e1.ratio) {
          return Number(
            ((this.dataForm.outNum * e1.ratio) / e2.ratio).toFixed(2)
          );
        }
      }
      return "-";
    },
  },
  methods: {
    init(product, storeRow, needNum) {
      this.visible = true;
      this.erpProductmodelList = product.erpProductmodelList;
      this.storeRow = storeRow;
      this.dataForm.gid = storeRow.gid;
      this.needNum = needNum;

      this.dataForm.outNum = 1;
      for (let index = 0; index < this.erpProductmodelList.length; index++) {
        const ele = this.erpProductmodelList[index];
        if (ele.id == this.dataForm.gid) {
          break;
        }
        this.dataForm.tGid = ele.id;
      }
    },
    closeDialog() {
      this.$refs["elForm"].resetFields();
    },
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          const { gid, tGid } = this.dataForm;
          const e1 = this.erpProductmodelList.find((it) => it.id == gid);
          const e2 = this.erpProductmodelList.find((it) => it.id == tGid);
          if (!e1.ratio || !e2.ratio) {
            return this.$message.error("缺少转化比，不允许拆包！");
          }
          if (e2.ratio > e1.ratio) {
            return this.$message.error("目标规格不允许拆包！");
          }

          if (this.dataForm.outNum > this.storeRow.num) {
            return this.$message.error("拆包数量不能大于库存数量！");
          }

          const outItem = {
            gid: this.dataForm.gid,
            num: this.dataForm.outNum,
            storeDetailList: [{ ...this.storeRow }],
            amount: 0,
          };

          outItem.amount = Number(
            (this.dataForm.outNum * this.storeRow.price).toFixed(2)
          );

          const inItem = {
            gid: this.dataForm.tGid,
            storeRomeId: this.storeRow.storeRomeId,
            storeRomeAreaId: this.storeRow.storeRomeAreaId,
            amount: outItem.amount,
            price: 0,
            inNum: Number(
              ((this.dataForm.outNum * e1.ratio) / e2.ratio).toFixed(2)
            ),
          };
          if (!!inItem.inNum) {
            inItem.price = (inItem.amount / inItem.inNum).toFixed(2);
          }

          const data = {
            inType: "7",  // 拆包入库
            erpInrecordList: [inItem],
            erpOutrecordList: [outItem],
          };
        //   console.log(data);
          this.detailLoading = true;
          this.$request({
              url: `/api/Erp/ErpInorderCb`,
              method: "post",
              data: data,
          }).then((res) => {
              this.$message({
                  message: res.msg,
                  type: "success",
                  duration: 800,
                  onClose: () => {
                      this.detailLoading = false;
                      (this.visible = false), this.$emit("ok", true);
                  },
              });
          }).catch(_=> this.detailLoading = false);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  padding: 20px;
}
</style>