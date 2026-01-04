<!-- 生成特殊入库 -->
<template>
    <el-dialog title="快速创建调拨单" :close-on-click-modal="false" :visible.sync="visible"
        class="QT-dialog QT-dialog_center QT-dialog_transfer" lock-scroll append-to-body width="90%" v-loading="detailLoading"
        element-loading-background="rgba(255,255,255,0)" element-loading-text="拼命加载中">
        <div :style="{ margin: '10 auto', width: '100%' }" class="transfer-form">
            <el-row class="QT-common-search-box" :gutter="16">
                <el-form @submit.native.prevent ref="elForm" :model="dataForm">
                    <el-col :span="12">
                        <el-form-item>
                            <span>商品：{{ record.productName }}，规格：{{ record.name }}，当前公司：{{ userInfo.companyId | dynamicText(companyOptions,'id','name') }}</span>
                            <!-- <el-input v-model="dataForm.gid" disabled :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input> -->
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="公司" prop="oid">
                            <el-input v-model="dataForm.oid" disabled :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">                       
                        <el-form-item label="调出公司" prop="oid">
                            <el-select v-model="dataForm.oid" placeholder="请选择" clearable :style="{ width: '100%' }">
                            <el-option v-for="(item, index) in companyOptions" :disabled="item.id == userInfo.companyId" :key="index" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="handleQuery">查询</el-button>
                        </el-form-item>
                    </el-col>
                       
                      
                    <!-- <el-col :span="12">
                        <el-form-item label="入库数量" prop="inNum">
                            <el-input-number v-model="dataForm.inNum" :style="{ width: '100%' }" placeholder="数字文本" :min="0"
                                :step="1" :controls="false">
                            </el-input-number>
                        </el-form-item>
                    </el-col>  -->
                </el-form>
            </el-row>
            
            <el-table
                ref="storeDetailRef"
                :data="storeDetailList"
                size="mini"
                height="500"
                border
                v-loading="detailLoading"
                >
                <!-- <el-table-column label="操作" fixed="left" width="50">
                    <template slot-scope="scope">
                    <el-button type="text" @click="unpackingHandle(scope.row)"
                        >拆包</el-button
                    >
                    </template>
                </el-table-column> -->
                <el-table-column
                    type="index"
                    width="50"
                    label="序号"
                    align="center"
                />
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
                    <!-- <el-button v-if="scope.row.inType == '5' " type="text" @click="handleRemoveTS(scope.row)"
                        >删除</el-button
                    > -->
                    <el-button  type="text" @click="handleTransfer(scope.row)"
                        >调拨</el-button
                    >
                    </template>
                </el-table-column>
                </el-table>
                <CreateTransferForm v-if="createFormVisible" ref="createFormRef" @ok="handleOk" ></CreateTransferForm>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">{{
                $t("common.cancelButton")
            }}</el-button>
            <!-- <el-button type="primary" @click="dataFormSubmit()">{{
                $t("common.confirmButton")
            }}</el-button> -->
        </span>
    </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { mapGetters } from "vuex";
import CreateTransferForm from "./CreateTransferForm.vue";
export default {
    components:{CreateTransferForm},
    data() {
        return {
            visible: false,
            createFormVisible:false,
            record: {},
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
            storeDetailList:[],
            inTypeOptions:[]
        }
    },
    computed:{
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
        this.getstoreRomeOptions();
        this.getstoreRomeAreaOptions();
        this.$store.dispatch('base/getDictionaryData', { sort: 'QTErpRklx' }).then((res) => this.inTypeOptions = JSON.parse(JSON.stringify(res)))
    },
    methods: {
        getstoreRomeOptions() {
            request({
                url: "/api/Erp/ErpStoreroom/Selector",
                method: "get",
            }).then((res) => {
                this.storeRomeOptions = res.data;
            });
        },
        getstoreRomeAreaOptions() {
            request({
                url: "/api/Erp/ErpStoreroom/area/Selector",
                method: "get",
            }).then((res) => {
                this.storeRomeAreaOptions = res.data;
            });
        },
        handleQuery(){
            if (!this.dataForm.oid) {
                return this.$message.warning("请选择调出公司");
            }
            this.detailLoading = true
            request({
                url: `/api/Erp/ErpInorder/Store/${this.record.id}?oid=${this.dataForm.oid}`,
                method: "get",
            }).then((res) => {
                this.storeDetailList = res.data || []
                // console.log(res.data)
            }).finally(_=>this.detailLoading = false);
        },
        init(row) {
           
        // console.log('inNum',inNum)
            this.record = row
            this.visible = true

            // 清除数据
            this.storeDetailList.splice(0)

            // if (!!data) {
            //     Object.assign(this.dataForm, data)
            // }
        },
        // dataFormSubmit() {
        //     this.$refs["elForm"].validate((valid) => {
        //         if (valid) { 
        //             const dataForm = {
        //                 inType: "5", // 默认
        //                 erpInrecordList: [],
        //             }
        //             dataForm.erpInrecordList.push({...this.dataForm})
        //             this.detailLoading = true;
        //             request({
        //                 url: `/api/Erp/ErpInorder`,
        //                 method: "post",
        //                 data: dataForm,
        //             }).then((res) => {
        //                 this.$message({
        //                     message: res.msg,
        //                     type: "success",
        //                     duration: 800,
        //                     onClose: () => {
        //                         this.detailLoading = false;
        //                         (this.visible = false), this.$emit("ok", true);
        //                     },
        //                 });
        //             }).catch(_=> this.detailLoading = false);
        //         }
        //     });
        // },
        handleTransfer(row){
            // console.log(row)
            this.createFormVisible = true
            this.$nextTick(()=>{
                  const { num, storeDetailList } = this.record;
            let n = this.qt.sum(storeDetailList, "num");
             let inNum = Number((num - n).toFixed(2))

                this.$refs.createFormRef.init(row,Number(inNum))
            })
        },
        handleOk(){
            this.visible = false
            this.$emit('ok')
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog_transfer{
    >>>.el-dialog__body {
    height: 100% !important;
    padding: 0 0 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .main {
        margin: 10px 10px 0 10px;
        height: 100px;
    }

}
}

</style>