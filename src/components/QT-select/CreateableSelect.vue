<!-- CreateableSelect.vue -->
<template>
  <el-select v-model="innerValue" filterable :remote="false" reserve-keyword :remote-method="handleSearch"
    :loading="loading" v-bind="$attrs" v-on="$listeners" @change="handleSelectChange"
    @visible-change="handleVisibleChange">
    <el-option disabled :value="tempValue">
      <el-button type="success" @click="handleCreateDialog()">创建选项</el-button>
      <el-dialog title="快速创建" :close-on-click-modal="false" :visible.sync="visible" class="QT-dialog QT-dialog_center"
        lock-scroll width="800px" append-to-body>
        <el-form ref="elForm" :model="dataForm" size="small" label-width="120px" label-position="right">
          <slot name="form" :data="dataForm">
            <el-form-item label="选项内容" :prop="labelKey">
              <el-input v-model="dataForm[labelKey]" placeholder="输入选项内容" />
            </el-form-item>
          </slot>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button type="primary" @click="dataFormSubmit()" :loading="loading">
            {{ $t("common.confirmButton") }}</el-button>
        </span>
      </el-dialog>
    </el-option>
    <!-- 默认选项 -->
    <el-option v-for="item in options" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />

    <!-- 创建新条目选项 -->
    <!-- <el-option
        v-if="showCreateOption"
        :value="tempValue"
        :label="`创建：${inputText}`"
      >
      </el-option> -->
    <!-- <el-option v-if="showCreateOption" value="__TEMP">
      <el-button type="success" size="mini" @click.native.stop="handleCreate">创建：{{ inputText }}</el-button>
    </el-option> -->
  </el-select>
</template>

<script>
export default {
  name: "CreateableSelect",
  props: {
    // 双向绑定值
    value: {
      type: [String, Number],
      default: "",
    },
    // 数据加载方法 (必须返回Promise)
    loadMethod: {
      type: Function,
      required: true,
    },
    // 远程搜索方法 (必须返回Promise)
    remoteMethod: {
      type: Function,
      required: false,
    },
    // 创建条目方法 (必须返回Promise)
    createMethod: {
      type: Function,
      required: true,
    },
    // 值字段名
    valueKey: {
      type: String,
      default: "value",
    },
    // 标签字段名
    labelKey: {
      type: String,
      default: "label",
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      dataForm: {

      },
      btnLoading: false,
      innerValue: this.value,
      options: [], // 选项列表
      inputText: "", // 用户输入内容
      loading: false, // 加载状态
      // showCreateOption: false, // 是否显示创建选项
      tempValue: "__TEMP_CREATE__", // 临时创建标识
    };
  },
  watch: {
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  computed: {
    showCreateOption() {
      if (
        this.inputText &&
        this.options.findIndex((x) => x[this.labelKey] == this.inputText) == -1
      ) {
        return true;
      }
      return false;
    },
  },
  async created() {
    // const res = await this.loadMethod();
    // this.options = Array.isArray(res) ? res : [];
    await this.loadData()
  },
  methods: {
    async loadData(){
      try {
        this.loading = true
        const res = await this.loadMethod();
        this.options = Array.isArray(res) ? res : [];
      } catch (error) {
        this.$emit("error", error);
      } finally {
        this.loading = false;
      }
    },
    // 处理远程搜索
    async handleSearch(query) {
      this.inputText = query;
      if (!query) {
        this.options = [];
        return;
      }

      try {
        this.loading = true;
        const res = await this.remoteMethod(query);
        this.options = Array.isArray(res) ? res : [];
        // this.showCreateOption = this.options.length === 0
      } catch (error) {
        this.$emit("error", error);
        this.options = [];
      } finally {
        this.loading = false;
      }
    },

    // 处理选项选择
    async handleSelectChange(value) {
      if (value === this.tempValue) {
        await this.handleCreate();
        return;
      }

      const selectedItem = this.options.find(
        (item) => item[this.valueKey] === value
      );
      // this.$emit("change", value, selectedItem);
      this.$emit("input", value);
    },

    // 创建新条目
    async handleCreate() {
      if (!this.inputText.trim()) {
        this.$emit("error", new Error("输入内容不能为空"));
        return;
      }

      try {
        this.loading = true;
        const newItem = await this.createMethod(this.inputText);
        if (!newItem) {
          await this.handleSearch(this.inputText);
        } else {
          // 添加新条目到选项列表
          this.options = [...this.options, newItem];
          this.innerValue = newItem[this.valueKey];
        }
        // this.showCreateOption = false
        this.$emit("create-success");
        this.$emit("input");
      } catch (error) {
        this.$emit("error", error);
      } finally {
        this.loading = false;
      }
    },
    handleVisibleChange(flag) {
      this.inputText = "";
    },
    handleCreateDialog() {
      this.visible = true;
      this.dataForm = {}
      this.$nextTick(() => {
        const { fields } = this.$refs.elForm;
        if (fields && fields.length) {
          fields.forEach(field => {
            this.$set(this.dataForm, field.prop, "");
          });
        }
        this.$refs.elForm.resetFields();
      });
    },
    dataFormSubmit() {
      // console.log("dataFormSubmit", this.dataForm)
      this.$refs['elForm'].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const newKey = await this.createMethod(this.dataForm);
            
            // 重新加载数据
            await this.loadData()
            this.visible = false;

            // this.showCreateOption = false
            this.$emit("create-success");
            this.$emit("input",newKey);
          } catch (error) {
            console.log(error)
            this.$emit("error", error);
          } finally {
            this.visible = false;
            this.loading = false;
          }
        }
      })
    }
  },
};
</script>