<!-- 生成特殊入库 -->
<template>
    <el-dialog title="创建调拨入库" :close-on-click-modal="false" :visible.sync="visible"
        class="QT-dialog QT-dialog_center" lock-scroll append-to-body width="50%" v-loading="detailLoading"
        element-loading-background="rgba(255,255,255,0)" element-loading-text="拼命加载中">
        <div :style="{ margin: '10 auto', width: '100%' }" class="create-ts-form">
            <el-row :gutter="15" class="main">
                <el-form ref="elForm" :model="dataForm" size="small" label-width="150px" label-position="right"
                    :rules="rules">
                     <el-col :span="12">
                        <el-form-item  label="商品名称">
                            <!-- <el-input v-model="dataForm.gid" disabled :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input> -->
                            <span>{{ dataForm.productName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品规格" prop="gid">
                           <span>{{ dataForm.gidName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item   label="调入公司" prop="inOid">
                           <span>{{ userInfo.companyId | dynamicText(companyOptions,'id','name') }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="调出公司" prop="oid">
                           <span>{{ dataForm.oid | dynamicText(companyOptions,'id','name') }}</span>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="库存数量" prop="oid">
                           <span>{{ dataForm.num }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="调出数量" prop="num">
                            <el-input-number v-model="num" :style="{ width: '100%' }" placeholder="数字文本" :min="0"
                                :step="1" :max="dataForm.num" :controls="false">
                            </el-input-number>
                        </el-form-item>
                    </el-col> 
                </el-form>
            </el-row>
        </div>
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
import request from "@/utils/request";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            visible: false,
            record: undefined,
            detailLoading: false,
            dataForm: {
                gid:undefined,
                oid:undefined,
                inNum: undefined,
                storeRomeAreaId: undefined,
                storeRomeId: undefined,
                remark: undefined
            },
            storeRomeOptions: [],
            storeRomeAreaOptions: [],
            rules: {
                inNum: [{ required: true, message: "入库数量", trigger: "change" }],
            },
            num:0
        }
    }, computed:{
         ...mapGetters(["userInfo"]),
        companyOptions() {
        const { companys } = this.userInfo;
        if (!!companys) {
            return companys.filter((x) => !x.isJt);
        }
        return [];
        },
    },
    created() {
        // this.getstoreRomeOptions();
        // this.getstoreRomeAreaOptions();
    },
    methods: {
        // getstoreRomeOptions() {
        //     request({
        //         url: "/api/Erp/ErpStoreroom/Selector",
        //         method: "get",
        //     }).then((res) => {
        //         this.storeRomeOptions = res.data;
        //     });
        // },
        // getstoreRomeAreaOptions() {
        //     request({
        //         url: "/api/Erp/ErpStoreroom/area/Selector",
        //         method: "get",
        //     }).then((res) => {
        //         this.storeRomeAreaOptions = res.data;
        //     });
        // },
        init(data,num) {
            // this.record = row
            this.visible = true
            this.num = undefined // data.num
            this.dataForm = data

            if (num) {
                this.num = num
            }
            // console.log(data)
            // if (!!data) {
            //     Object.assign(this.dataForm, data)
            // }

            // this.dataForm  = {
            //     "oid": data.oid,
            //     "inOid": this.userInfo.companyId,
            //     "inType": "2",
            //     "num":1,
            //     "price": data.price,                
            //     "erpOutrecordList": [
            //         {
            //             "gid": data.gid,
            //             "num": 1,
            //             "storeDetailList": [data],
            //             "price": data.price,
            //             "amount": 5
            //         }
            //     ],
            //     "state": "1"
            // }
        },
        dataFormSubmit() {
            if (!this.num) {
                return this.$message.warning("请输入调出数量")  
            }
            this.$refs["elForm"].validate((valid) => {
                if (valid) {
                    // // 判断明细表的数据
                   

                    const data  = {
                        "oid": this.dataForm.oid,
                        "inOid": this.userInfo.companyId,
                        "inType": "2",              
                        "erpOutrecordList": [
                            {
                                "gid": this.dataForm.gid,
                                "num": this.num,
                                "storeDetailList": [this.dataForm],
                                "price": this.dataForm.price,
                                "amount": (this.dataForm.price * this.num).toFixed(2)
                            }
                        ],
                        "state": "1"
                    }

                    
                    // console.log(data) 
                    this.detailLoading = true;
                    request({
                        url: `/api/Erp/ErpOutorder/Db/Auto`,
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
        }
    }
}
</script>

<style lang="scss" scoped>
>>>.el-dialog__body {
    height: 300px;
    padding: 0 0 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .main {
        padding: 10px;
        height: 100px;
    }

}
</style>