<template>
  <el-dialog
    title="可编辑列配置"
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="QT-dialog QT-dialog_center"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="elForm"
      :model="dataForm"
      label-width="auto"
      style="height: 250px"
    >
      <el-form-item prop="type" label="控件类型" label-width="100px" required>
        <el-select v-model="dataForm.type" placeholder="请选择控件类型">
            <el-option-group
              v-for="(group, index) in leftComponents"
              :key="index"
              :label="group.title"
            >
              <el-option
                v-for="item in group.list"
                :key="item.__config__.qtKey"
                :label="item.__config__.label"
                :value="item.__config__.qtKey"
                :disabled="item.__config__.dragDisabled"
              >
              </el-option>
            </el-option-group>
          </el-select>
      </el-form-item>
      <el-form-item prop="url" label="提交地址" label-width="100px" required>
        <el-input v-model="dataForm.url"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import draggable from "vuedraggable";
const editableConfig = {
  type: "",
  url: "",
};
import {
  inputComponents,
  selectComponents,
  systemComponents,
  layoutComponents,
  formConf,
} from "@/components/Generator/generator/config";
export default {
  components: { draggable },
  data() {
    return {
      dialogFormVisible: false,
      dataForm: {
        type: "",
        url: "",
      },
      activeData: undefined,
      leftComponents: [
        {
          title: "基础控件",
          list: inputComponents,
        },
        // {
        //   title: '高级控件',
        //   list: selectComponents
        // },
        // {
        //   title: '系统控件',
        //   list: systemComponents
        // },
        // {
        //   title: '布局控件',
        //   list: layoutComponents
        // }
      ],
    };
  },
  methods: {
    init(row) {
      this.activeData = row;

      this.dialogFormVisible = true;

      this.$nextTick(()=>{        
        if (!this.activeData.editableConfig) {
          this.dataForm = JSON.parse(JSON.stringify(editableConfig))
        }else{
          this.dataForm = JSON.parse(JSON.stringify(this.activeData.editableConfig))
        }
      })
    },
    handleSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          // this.dialogFormVisible = false;
          this.$set(this.activeData, "editableConfig", Object.assign({},this.dataForm));
          this.handleClose()
        }
      });
    },
    handleClose() {
      //   console.log("handleClose");
      this.$refs.elForm.resetFields();
      //   this.$emit("update:visible", false);
      this.$emit("ok");
    },
  },
};
</script>