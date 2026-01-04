
<template>
  <component :is="currentView" :config="config" :modelId="modelId" :isPreview="isPreview"
    v-show="showPage" />
</template>

<script>
import { getConfigData } from '@/api/onlineDev/visualDev'
import Form from './form'
import List from './list'

export default {
  name: 'dynamicReport',
  components: { Form, List },
  data() {
    return {
      currentView: '',
      showPage: false,
      isPreview: false,
      modelId: '',
      config: {}
    }
  },
  async created() {
    let isPreview = this.$route.query.isPreview || false
    if (isPreview) {
      this.modelId = this.$route.query.id
      this.isPreview = true
    } else {
      this.modelId = this.$route.meta.relationId
    }
    if (!this.modelId) return
    await this.getConfigData()
  },
  methods: {
    async getConfigData() {
      await getConfigData(this.modelId).then(res => {
        if (res.code !== 200) {
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/404')
        }
        if (!res.data) return
        this.config = res.data
        if (res.data.webType == '1') {
          this.currentView = 'Form'
        } else {
          this.currentView = 'List'
        }
        this.showPage = true
      }).catch(() => { })
    }
  }
}
</script>
