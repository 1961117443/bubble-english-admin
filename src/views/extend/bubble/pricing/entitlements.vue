<template>
  <div class="BubbleEntitlements-container app-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>权益与售卖配置</span>
        <div style="float:right">
          <el-button type="primary" icon="el-icon-check" :loading="saving" @click="save">保存</el-button>
        </div>
      </div>

      <el-alert type="info" :closable="false" show-icon>
        <div>
          <div>建议：会员只解锁进阶（advanced），主题包单卖。</div>
          <div>这里先做“配置壳”，后端可据此渲染前端锁课/价值页。</div>
        </div>
      </el-alert>

      <el-divider />

      <el-form label-width="120px" :model="model">
        <el-form-item label="VIP 进阶开关">
          <el-switch v-model="model.vipEnabled" />
        </el-form-item>
        <el-form-item label="VIP 说明">
          <el-input type="textarea" :rows="4" v-model="model.vipDesc" placeholder="给家长看的价值说明" />
        </el-form-item>
        <el-form-item label="主题包说明">
          <el-input type="textarea" :rows="4" v-model="model.themeDesc" placeholder="主题包单卖的解释" />
        </el-form-item>
        <el-form-item label="可售主题（keys）">
          <el-select v-model="model.saleThemes" multiple filterable allow-create default-first-option style="width:100%" placeholder="如 zoo/farm/body">
            <el-option v-for="k in model.saleThemes" :key="k" :label="k" :value="k" />
          </el-select>
          <div class="tip">这里先用 key 列表。后续可扩展为 SKU/价格/到期策略。</div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEntitlementConfig, saveEntitlementConfig } from '@/api/extend/bubble/entitlement'

export default {
  name: 'bubbleEntitlements',
  data() {
    return {
      saving: false,
      model: {
        vipEnabled: true,
        vipDesc: '会员解锁进阶学习：句子跟读、学习统计、多孩子管理等。',
        themeDesc: '主题包单卖：孩子对某个主题更感兴趣，可以单独解锁该主题的基础内容。',
        saleThemes: ['zoo', 'farm', 'body']
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      try {
        const res = await getEntitlementConfig()
        if (res && res.data) this.model = Object.assign(this.model, res.data)
      } catch (e) {
        // 后端未接入时不阻塞
      }
    },
    async save() {
      this.saving = true
      try {
        await saveEntitlementConfig(this.model)
        this.$message.success('保存成功')
      } catch (e) {
        this.$message.warning('后端接口未接入：已在控制台输出')
        // eslint-disable-next-line no-console
        console.log('[bubble entitlement save]', this.model)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip { color: #909399; font-size: 12px; margin-top: 6px; }
</style>
