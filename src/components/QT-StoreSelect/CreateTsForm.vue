<!-- 生成特殊入库 -->
<template>
    <el-dialog title="库存不足，是否创建特殊入库" :close-on-click-modal="false" :visible.sync="visible"
        class="QT-dialog QT-dialog_center" lock-scroll append-to-body width="50%" v-loading="detailLoading"
        element-loading-background="rgba(255,255,255,0)" element-loading-text="拼命加载中">
        <div :style="{ margin: '10 auto', width: '100%' }" class="create-ts-form">
            <el-row :gutter="15" class="main">
                <el-form ref="elForm" :model="dataForm" size="small" label-width="150px" label-position="right"
                    :rules="rules">
                    <el-col :span="12">
                        <el-form-item v-show="false" label="商品规格" prop="gid">
                            <el-input v-model="dataForm.gid" disabled :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-show="false" label="公司" prop="oid">
                            <el-input v-model="dataForm.oid" disabled :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入库数量" prop="inNum">
                            <el-input-number v-model="dataForm.inNum" :style="{ width: '100%' }" placeholder="数字文本" :min="0"
                                :step="1" :controls="false">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" :style="{ width: '100%' }" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仓库" prop="storeRomeId">
                            <el-select v-model="dataForm.storeRomeId" placeholder="请选择" clearable :style="{ width: '100%' }"
                                @change="dataForm.storeRomeAreaId = ''">
                                <el-option v-for="(item, index) in storeRomeOptions" :key="index" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="库区" prop="storeRomeAreaId">
                            <el-select v-model="dataForm.storeRomeAreaId" placeholder="请选择" clearable
                                :style="{ width: '100%' }">
                                <el-option v-for="(item, index) in storeRomeAreaOptions.filter(
                                    (x) => x.sid == dataForm.storeRomeId
                                )" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
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
            }
        }
    },
    created() {
        this.getstoreRomeOptions();
        this.getstoreRomeAreaOptions();
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
        init(row, data) {
            this.record = row
            this.visible = true

            if (!!data) {
                Object.assign(this.dataForm, data)
            }
        },
        dataFormSubmit() {
            this.$refs["elForm"].validate((valid) => {
                if (valid) {
                    // // 判断明细表的数据
                    // for (let index = 0; index < this.dataForm.erpInrecordList.length; index++) {
                    //     const ele = this.dataForm.erpInrecordList[index];
                    //     if (!ele.inNum || ele.inNum == 0) {
                    //         return this.$message({ message: '入库数量必填！', type: 'warning' })
                    //     }
                    //       if (!ele.storeRomeId) {
                    //     	  return this.$message({message:'仓库必填！',type:'warning'})
                    //       }
                    //       if (!ele.storeRomeAreaId) {
                    //     	  return this.$message({message:'库区必填！',type:'warning'})
                    //       }
                    // }

                    const dataForm = {
                        inType: "5", // 默认
                        erpInrecordList: [],
                    }
                    dataForm.erpInrecordList.push({...this.dataForm})
                    this.detailLoading = true;
                    request({
                        url: `/api/Erp/ErpInorder`,
                        method: "post",
                        data: dataForm,
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