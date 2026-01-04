<template>
    <el-dialog title="设置" :close-on-click-modal="false" :visible.sync="visible"  class="QT-dialog QT-dialog_center"
        lock-scroll append-to-body width="300px" :show-close="false" :footer="null">
        <el-form @submit.native.prevent :model="ruleForm" label-position="top">
            <el-form-item label="单位编号">
                <el-input v-model.trim="ruleForm.account" placeholder="请输入单位编号" clearable @keyup.enter.native="handleOk()" />
            </el-form-item>
            <el-form-item>
                <el-button ref="btnOkRef" :loading="btnLoading" type="primary" @click="handleOk()">{{ $t('common.confirmButton') }}</el-button>
            </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button ref="btnOkRef" type="primary" @click="handleOk()">{{ $t('common.confirmButton') }}</el-button>
        </span> -->
    </el-dialog>
</template>
  
<script>
import { getTenant,setTenant} from '@/utils/auth'
export default {
    data() {
        return {
            visible: false,
            btnLoading: false,
            ruleForm: {
                account: ''
            }
        }
    },
    created() {
    },
    methods: {
        showDialog() {
            this.visible = true
            this.$nextTick(() => {
               const saas =  getTenant()
               this.ruleForm.account = saas ? saas : ''
            //    this.$refs.btnOkRef.focus()
            })
        },
        handleOk() {
            if (!this.ruleForm.account) {
                this.$message.error('请输入单位编号')
                return
            }
            this.btnLoading = true
            this.$request.get(`/api/OAuth/saas/${this.ruleForm.account}`)
            .then(res=>{
                this.$store.commit('settings/SET_SYSTEM_TITLE', '')
                this.$store.commit('settings/SET_LOGIN_CONFIG', null)
                setTenant(this.ruleForm.account)
                this.visible = false
                this.$emit('ok', this.ruleForm)

            }).finally(()=>this.btnLoading = false)            
        },
    }
}
</script>
<style lang="scss" scoped>
>>>.el-dialog__body {
    // height: 30vh;
    padding: 0 10 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // .QT-common-search-box {
    //     margin-bottom: 0;

    //     .QT-common-search-box-right {
    //         padding: 10px 10px 0 0;
    //     }
    // }
}
</style>