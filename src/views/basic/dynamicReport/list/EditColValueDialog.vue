<template>
  <el-dialog title="修改数据" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="false"
    class="QT-dialog QT-dialog_center" :destroy-on-close="true" @close="handleClose">
    <el-form ref="elForm" v-if="config.editableConfig" :model="dataForm" label-width="auto" style="height: 250px">
      <el-form-item>
        <span>当前选中<el-tag>{{ selectedRowCount }}</el-tag>行</span>
      </el-form-item>
      <el-form-item v-if="config.editableConfig.type == 'date'" prop="fieldValue" :label="config.label"
        :key="config.prop + '.fieldValue.date'">
        <el-date-picker v-model="dataForm.fieldValue" value-format="yyyy-MM-dd" type="date" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="clearSelection" label="是否清空选中记录">
         <el-checkbox v-model="dataForm.clearSelection"></el-checkbox>
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
export default {
  components: { draggable },
  data() {
    return {
      dialogFormVisible: false,
      dataForm: {
        fieldValue: undefined,
        clearSelection:true
      },
      config: {

      },
      params:{

      }
    };
  },
  computed:{
    selectedRowCount(){
      const {$vue,row} = this.params
      let count = 0
      if ($vue && $vue.multipleSelection && $vue.multipleSelection.length > 0) {
        return $vue.multipleSelection.filter(x=>x!=row).length + 1
      }
      return 1
    }
  },
  methods: {
    init(params) {
      this.params = params
      const { row, column, cellValue, config, $vue } = params;
      this.config = config
      this.editableConfig = config.editableConfig
      console.log(row, config, cellValue, $vue)
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.dataForm.clearSelection = true
        if (cellValue) {
          this.dataForm.fieldValue = cellValue
        }
      })
    },
    handleSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          let body = []
          const {$vue,row} = this.params
          if ($vue && $vue.multipleSelection && $vue.multipleSelection.length > 0) {
            body = $vue.multipleSelection.filter(x=>x!=row).map(x=> ({...x,[this.config.prop]:this.dataForm.fieldValue}))
          }
          body.push(({...row,[this.config.prop]:this.dataForm.fieldValue})) 
          // this.dialogFormVisible = false;
          // console.log(body)
          // this.handleClose()

          if (body.length>0) {
            this.$request({
              url: this.config.editableConfig.url,
              method: "post",
              data: body,
            }).then((res) => {
              if (this.dataForm.clearSelection) {
                $vue.$refs.QTTableRef.clearSelection();
              }              
              $vue.initData();
              this.handleClose()
            });
          }
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