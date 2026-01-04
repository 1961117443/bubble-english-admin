<template>
  <el-dialog
    title="数据选项"
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
      <el-form-item label="" label-width="100px">
        <el-radio-group
          v-model="dataForm.dataType"
          size="small"
          style="text-align: center"
          @change="dataTypeChange"
        >
          <el-radio-button label="static">静态数据</el-radio-button>
          <el-radio-button label="dictionary">数据字典</el-radio-button>
          <el-radio-button label="dynamic">远端数据</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.dataType === 'static'">
        <draggable
          :list="dataForm.options"
          :animation="340"
          group="selectItem"
          handle=".option-drag"
        >
          <div
            v-for="(item, index) in dataForm.options"
            :key="index"
            class="select-item"
          >
            <div class="select-line-icon option-drag">
              <i class="icon-qt icon-qt-darg" />
            </div>
            <el-input
              v-model="item.fullName"
              placeholder="选项名"
              size="small"
            />
            <el-input v-model="item.id" placeholder="选项值" size="small" />
            <div
              class="close-btn select-line-icon"
              @click="dataForm.options.splice(index, 1)"
            >
              <i class="el-icon-remove-outline" />
            </div>
          </div>
        </draggable>
        <div style="margin-left: 29px">
          <el-button
            style="padding-bottom: 0"
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addSelectItem"
          >
            添加选项
          </el-button>
        </div>
      </template>
      <template v-if="dataForm.dataType === 'dictionary'">
        <el-form-item label="远端数据">
          <QT-TreeSelect
            :options="treeData"
            v-model="dataForm.dictionaryType"
            placeholder="请选择数据字典"
            lastLevel
            clearable
          >
          </QT-TreeSelect>
        </el-form-item>
        <el-form-item label="存储字段">
          <el-select v-model="dataForm.propsValue" placeholder="请选择存储字段">
            <el-option label="id" value="id"></el-option>
            <el-option label="enCode" value="enCode"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="dataForm.dataType === 'dynamic'">
        <el-form-item label="远端数据">
          <QT-TreeSelect
            :options="dataInterfaceSelector"
            v-model="dataForm.propsUrl"
            placeholder="请选择远端数据"
            lastLevel
            lastLevelKey="categoryId"
            lastLevelValue="1"
            @change="propsUrlChange"
            clearable
          >
          </QT-TreeSelect>
        </el-form-item>
        <el-form-item label="存储字段">
          <el-input
            v-model="dataForm.propsValue"
            placeholder="请输入存储字段"
          />
        </el-form-item>
        <el-form-item label="显示字段">
          <el-input
            v-model="dataForm.propsLabel"
            placeholder="请输入显示字段"
          />
        </el-form-item>
      </template>
      <el-form-item label="是否多选">
          <el-checkbox
            v-model="dataForm.multiple"
            placeholder="是否多选"
          />
        </el-form-item>
      <el-form-item label="过滤条件">
          <el-input
            v-model="dataForm.filter"
            placeholder="(row,query)=>{return row.xxx == query.xxx}，row是当前行数据，query是查询表单数据，返回bool值"
          />
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import draggable from "vuedraggable";
import {
  getDictionaryTypeSelector,
  getDictionaryDataSelector,
} from "@/api/systemData/dictionary";
import {
  getDataInterfaceSelector,
  getDataInterfaceRes,
} from "@/api/systemData/dataInterface";
export default {
  components: { draggable },
  data() {
    return {
      dialogFormVisible: false,
      // activeData: {
      //     __config__: {},
      //     __slot__: {

      //     }
      // }
      dataForm: {
        dataType: "dictionary",
        options: [],
        dictionaryType: "",
        propsValue: "id",
        propsLabel: "fullName",
        propsUrl: "",
      },
      activeData: undefined,
      treeData: [],
      dataInterfaceSelector: [],
    };
  },
  watch: {
    "dataForm.dictionaryType": function (val) {
      if (!val) {
        this.dataForm.options = [];
        return;
      }
      getDictionaryDataSelector(val).then((res) => {
        this.dataForm.options = res.data.list;
      });
    },
  },
  created() {
    this.getDictionaryType();
    this.getDataInterfaceSelector();
  },
  methods: {
    getDictionaryType() {
      getDictionaryTypeSelector().then((res) => {
        this.treeData = res.data.list;
      });
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then((res) => {
        this.dataInterfaceSelector = res.data;
      });
    },
    init(row) {
      this.activeData = row;
      // activeData.__config__.dataType
      // activeData.__config__.dictionaryType
      // activeData.__config__.props.value
      // activeData.__config__.props.label
      // activeData.__config__.propsUrl
      // activeData.__slot__.options

      this.dialogFormVisible = true;

      if (this.activeData.__config__) {

        // for(let key in this.activeData.__config__){
        //   this.$set(this.dataForm, key, this.activeData.__config__[key]);      
        // }

        if (this.activeData.__config__.dataType) {
        this.dataForm.dataType = this.activeData.__config__.dataType;
        }
        if (this.activeData.__config__.dictionaryType) {
        this.dataForm.dictionaryType =
            this.activeData.__config__.dictionaryType;
        }
        if (this.activeData.__config__.propsUrl) {
        this.dataForm.propsUrl = this.activeData.__config__.propsUrl;
        }
        if (this.activeData.__config__.props) {
        if (this.activeData.__config__.props.value) {
            this.dataForm.propsValue = this.activeData.__config__.props.value;
        }
        if (this.activeData.__config__.props.label) {
            this.dataForm.propsLabel = this.activeData.__config__.props.label;
        }
          
        // if (this.activeData.__config__.multiple) {
        //     this.dataForm.multiple = this.activeData.__config__.multiple;
        // }

        this.$set(this.dataForm, "multiple", this.activeData['multiple']);
        this.$set(this.dataForm, "filter", this.activeData['filter']);

        }
    }
    if (this.activeData.__slot__) {
        if (this.activeData.__slot__.options) {
        this.dataForm.options = this.activeData.__slot__.options;
        }
    }
    },
    dataTypeChange(val) {
        console.log('dataTypeChange',val)
      // this.dataForm.defaultValue = ''
      this.activeData.options = [];
      this.dataForm.propsValue = "id";
      this.dataForm.propsLabel = "fullName";
      if (val === "static") {
        this.dataForm.dictionaryType = "";
        this.dataForm.propsUrl = "";

        // if (this.activeData.__slot__ && this.activeData.__slot__.options) {
        //     this.dataForm.options = this.activeData.__slot__.options;
        // }
      }
      if (val === "dynamic") {
        this.dataForm.dictionaryType = "";

        // if (this.activeData.__config__ && this.activeData.__config__.propsUrl) {
        //     this.dataForm.propsUrl = this.activeData.__config__.propsUrl;
        // }

        // if (this.activeData.__config__.props.value) {
        //     this.dataForm.propsValue = this.activeData.__config__.props.value;
        // }
        // if (this.activeData.__config__.props.label) {
        //     this.dataForm.propsLabel = this.activeData.__config__.props.label;
        // }
      }
      if (val === "dictionary") {
        this.dataForm.propsUrl = "";
        
        // if (this.activeData.__config__ && this.activeData.__config__.dictionaryType) {
        //     this.dataForm.dictionaryType = this.activeData.__config__.dictionaryType;
        // }
        // if (this.activeData.__config__ && this.activeData.__config__.props &&  this.activeData.__config__.props.value) {
        //     this.dataForm.propsValue = this.activeData.__config__.props.value;
        // }        
      }
    },
    addSelectItem() {
      this.dataForm.options.push({
        fullName: "",
        id: "",
      });
    },
    propsUrlChange(val) {
      if (!val) {
        this.dataForm.options = [];
        return;
      }
      //   this.dataForm.defaultValue = ''
      getDataInterfaceRes(val)
        .then((res) => {
          let data = res.data.data;
          if (Array.isArray(data)) {
            this.dataForm.options = data;
          } else {
            this.dataForm.options = [];
          }
        })
        .catch(() => {
          this.dataForm.propsUrl = "";
          this.dataForm.options = [];
        });
    },
    handleSubmit() {
      // activeData.__config__.dataType
      // activeData.__config__.dictionaryType
      // activeData.__config__.props.value
      // activeData.__config__.props.label
      // activeData.__config__.propsUrl
      // activeData.__slot__.options

      // if (!Object.hasOwnProperty.call(this.activeData, "__config__")) {
      //   this.$set(this.activeData, "__config__", {});
      // }
      if (!Object.hasOwnProperty.call(this.activeData, "__slot__")) {
        this.$set(this.activeData, "__slot__", {});
      }
      if (!Object.hasOwnProperty.call(this.activeData.__config__, "props")) {
        this.$set(this.activeData.__config__, "props", {
          value: "",
          label: "",
        });
      }
      if (!Object.hasOwnProperty.call(this.activeData.__slot__, "options")) {
        this.$set(this.activeData.__slot__, "options", []);
      }

      for(let key in this.dataForm){
        this.$set(this.activeData.__config__, key, this.dataForm[key]);       
      }

      this.$set(this.activeData.__config__, "dataType", this.dataForm.dataType);
      this.$set(
        this.activeData.__config__,
        "dictionaryType",
        this.dataForm.dictionaryType
      );
      this.$set(
        this.activeData.__config__.props,
        "value",
        this.dataForm.propsValue
      );
      this.$set(
        this.activeData.__config__.props,
        "label",
        this.dataForm.propsLabel
      );
      this.$set(this.activeData.__config__, "propsUrl", this.dataForm.propsUrl);
      this.$set(this.activeData.__slot__, "options", this.dataForm.options);

      // console.log(this.dataForm['multiple'])
      
      this.$set(this.activeData, "multiple", this.dataForm['multiple']);
      this.$set(this.activeData, "filter", this.dataForm['filter']);
      // console.log(this.activeData.__config__);
    //   this.activeData.label=this.activeData.label + '123'
      
      this.dialogFormVisible = false;
    },
    handleClose() {
    //   console.log("handleClose");
      this.$refs.elForm.resetFields();
      //   this.$emit("update:visible", false);
      this.$emit('ok')
    },
  },
};
</script>