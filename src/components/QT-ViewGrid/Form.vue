<template>
  <transition name="el-zoom-in-center">
    <div class="QT-preview-main" v-loading.body="loading">
      <div class="QT-common-page-header">
        <el-page-header
          @back="goBack"
          :content="readonly ? '详情' : !dataForm.id ? '新建' : '编辑'"
        />
        <div class="options">
          <el-button
            v-if="!readonly"
            type="primary"
            @click="dataFormSubmit()"
            :loading="btnLoading"
            >确 定</el-button
          >
          <el-button @click="goBack">取 消</el-button>
        </div>
      </div>
      <div :style="{ margin: '0 auto', width: '100%' }">
        <el-row :gutter="15" class="main">
          <el-form
            ref="elForm"
            :model="dataForm"
            size="small"
            :label-width="formLabelWidth"
            label-position="right"
            :rules="rules"
            :disabled="readonly"
          >
            <el-col :xs="span.xs" :sm="span.sm" :md="span.md" :lg="span.lg" :xl="span.xl">
              <el-form-item label="网关名称" prop="name">
                <el-input
                  v-model="dataForm.name"
                  placeholder="请输入"
                  clearable
                  required
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
  </transition>
</template>
<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";

import mixins from "@/mixins/viewgrid/form.js";
export default {
  mixins: [mixins],
  components: {},
  props: [],
  data() {
    return {
      dataForm: {
        id: "",
      },
      rules: {},
    };
  },
  methods:{
    
  }
};
</script>
