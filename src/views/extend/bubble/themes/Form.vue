<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main" v-loading="loading">
      <div class="QT-common-page-header">
        <el-page-header @back="goBack" :content="formTitle" />
        <div class="options">
          <template v-if="!readonly">
            <el-button type="primary" @click="dataFormSubmit(true)" :loading="btnLoading" :disabled="btnLoading">保存</el-button>
          </template>
          <el-button @click="goBack()">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>

      <el-form ref="elForm" :model="dataForm" :rules="rules" label-width="110px" class="main" :disabled="readonly">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="主题Key" prop="themeKey">
              <el-input v-model="dataForm.themeKey" placeholder="例如 zoo / farm / body" clearable :disabled="readonly || !!dataForm.id" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="主题名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="例如 动物园" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="最小年龄" prop="minAge">
              <el-input-number v-model="dataForm.minAge" :min="1" :max="12" controls-position="right" style="width:100%" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="最大年龄" prop="maxAge">
              <el-input-number v-model="dataForm.maxAge" :min="1" :max="12" controls-position="right" style="width:100%" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="封面" prop="coverUrl">
              <QT-UploadImg :disabled="readonly" size="mini" v-model="dataForm.coverUrl" :fileSize="5" sizeUnit="MB" :limit="1" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" :rows="4" v-model="dataForm.description" placeholder="简单描述这个主题适合的内容和场景" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </transition>
</template>

<script>
import mixins from "@/mixins/viewgrid/form.js";

export default {
  name: "BubbleThemeForm",
  mixins: [mixins],
  data() {
    return {
      dataForm: {
        id: undefined,
        themeKey: "",
        name: "",
        minAge: 3,
        maxAge: 6,
        coverUrl: "",
        description: ""
      },
      rules: {
        themeKey: [{ required: true, message: "请输入主题Key", trigger: "blur" }],
        name: [{ required: true, message: "请输入主题名称", trigger: "blur" }],
        minAge: [{ required: true, message: "请输入最小年龄", trigger: "blur" }],
        maxAge: [{ required: true, message: "请输入最大年龄", trigger: "blur" }]
      }
    };
  },
  methods: {
    async onInit(id, readonly) {
      // 无需加载字典
    },
    onInitAfter(data, action) {
      // 兼容后端返回字段为空
      if (!data.minAge) data.minAge = 3;
      if (!data.maxAge) data.maxAge = 6;
    },
    onSubmitBefore(data, action) {
      // 基础校验：minAge <= maxAge
      if (Number(data.minAge) > Number(data.maxAge)) {
        this.$message.warning("最小年龄不能大于最大年龄");
        return false;
      }
      return true;
    }
  }
};
</script>
