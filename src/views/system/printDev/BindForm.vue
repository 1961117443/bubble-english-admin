<template>
    <el-dialog :visible.sync="visible" lock-scroll :show-close="false" :modal="false">
        <el-form :model="dataForm" ref="dataForm" label-width="100px" @submit.native.prevent label-position="right">
            <el-form-item label="关联模块">
                <el-cascader class="qt-el-cascader" v-model="dataForm.moduleId" :options="options" :show-all-levels="false"
                    :props="{ value: 'id', label: 'fullName', multiple: true }" style="width:100%;" clearable></el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">{{ $t('common.confirmButton')
            }}</el-button>
            <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getModule, bindModule } from '@/api/system/printDev'
import { getSelectorAll } from '@/api/system/menu'
export default {
    data() {
        return {
            visible: false,
            btnLoading: false,
            dataForm: {
                moduleId: []
            },
            id: undefined,
            options: []
        }
    },
    methods: {
        async showDialog(id) {
            this.id = id
            this.visible = true;
            this.dataForm.moduleId = []

            await getSelectorAll({ category: 'Web' }).then(res => {
                // console.log(res)
                this.options = res.data.list;
            })

            await getModule(id).then(res => {
                if (res.data) {
                    
                    let arr = []
                    res.data.forEach(item =>{
                        let result = []
                        this.getCurrent(this.options, item, result)
                        if (result.length>0) {
                            console.log(result)
                            arr.push([...result.reverse()])
                        }
                    })
                    this.$nextTick(()=> this.dataForm.moduleId = arr) 

                    // if (this.getCurrent(this.options, res.data[0], result)) {
                    //     this.dataForm.moduleId = result.reverse()
                    // }
                    // console.log(this.dataForm.moduleId)
                }
            })

            
            

        },
        getCurrent(list, key, result) {
            for (let index = 0; index < list.length; index++) {
                const ele = list[index];
                if (ele.children && ele.children.length > 0) {
                    if (this.getCurrent(ele.children, key, result)) {
                        result.push(ele.id)
                        return true
                    }
                }
                if (ele.id === key) {
                    result.push(ele.id)
                    return true
                }
            }
        },
        dataFormSubmit() {
            const data = {items:[]}
            if (this.dataForm.moduleId && this.dataForm.moduleId.length > 0) {
                this.dataForm.moduleId.forEach(ele => {
                    // ele[ele.length - 1]
                    data.items.push(ele[ele.length - 1])
                });
                // data.items.push(this.dataForm.moduleId[this.dataForm.moduleId.length - 1])
            }
            this.btnLoading = true
            bindModule(this.id, data).then((res) => {
                this.$message.success({
                    message: res.msg,
                    onClose: () => {
                        this.visible = false
                        this.btnLoading = false
                        this.$emit('ok')
                    }
                })
            }).catch(() => { this.btnLoading = false })
        }
    }
}
</script>

<style lang="scss">
.el-cascader-panel{
        ul{
            li[aria-haspopup="true"]{
                .el-checkbox{
                    display: none;
                }
            }
        }
    }
</style>