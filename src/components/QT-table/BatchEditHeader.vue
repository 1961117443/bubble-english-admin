<template>
  <div>
    <el-link slot="reference" icon="el-icon-edit" @click="showDialog()" :disabled="disabled"></el-link>
    <!-- <el-dialog title="供应商" :visible.sync="dialogVisible" width="30%">
    </el-dialog> -->
    <el-dialog
      title="批量修改"
      :visible.sync="dialogFormVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
    >
     <!-- {{ form }} -->
      <el-form ref="formRef" :model="form" :label-width="formLabelWidth" >
        <slot :data="form"></slot>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLabelWidth: "120px",
      value: undefined,
      dialogFormVisible: false,
      form: {},
    };
  },
  props: {
    width: {
      type: Number,
      default: 400,
    },
    table: {
      type: Object,
    },
    disabled:{
      type: [Boolean],
      default: false
    }
  },
  methods: {
    handleOk() {
      this.$emit("ok", this.form);
      this.dialogFormVisible = false;
    },
    showDialog() {
      this.dialogFormVisible = true;
      this.form = {}
    },
  },
};
</script>

<style lang="scss" scoped>
.batch-edit-header-main {
  display: flex;
}
</style>