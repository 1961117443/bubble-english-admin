<template>
    <el-dialog title="请选择删除方式" :visible.sync="dialogFormVisible" width="300px">
        <el-radio-group v-model="form.way">
            <el-radio :label="0" style="width: 100%;padding-bottom:10px">检查引用情况</el-radio>
            <el-radio :label="1" style="width: 100%;padding-bottom:10px">删除子表数据</el-radio>
            <el-radio :label="2" style="width: 100%;">保留子表数据</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: '120px',
            dialogFormVisible: false,
            form: {
                way: 0,
            },
            id: undefined
        }
    },
    methods: {
        showDialog(id) {
            this.id = id;
            this.form.way = 0
            this.dialogFormVisible = true;
        },
        handleOk() {
            this.dialogFormVisible = false;
            this.$emit('delete', this.id, this.form.way);
        }
    }
}
</script>