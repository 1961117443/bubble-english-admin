<template>
  <div id="app">
    <router-view />
    <Upgrade v-if="needUpdate" />
  </div>
</template>

<script>
import Upgrade from "@/layout/upgrade/index.vue";
import checkUpdate from "@/utils/auto-update";
const beforeUnload = function (e) {
  e = e || window.event
  if (e || window.event) e.returnValue = 1;
  return 1;
}
export default {
  components: { Upgrade },
  name: "App",
  data() {
    return {
      needUpdate: false,
    };
  },
  name: 'App',
  async created() {
    // await this.$store.dispatch('settings/globalConfig')
    // console.log('created')
    // 用户登录了才获取
    if (this.$store.getters.token) {
      await this.$store.dispatch('base/getDictionaryAll')
    }    
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('beforeunload', beforeUnload)
    })
    
    checkUpdate(() => {
      window.removeEventListener("beforeunload", beforeUnload);
      this.needUpdate = true;
    }, 60000);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', beforeUnload)
  }
}
</script>

<style lang="scss">
// hiprint 拖拽图片
.hiprint-printElement-image-content {
  img {
    content: url("~@/assets/images/qt.png");
  }
}

// 修改 页眉/页脚线 样式
.hiprint-headerLine,
.hiprint-footerLine {
  border-color: red !important;
}

.hiprint-headerLine:hover,
.hiprint-footerLine:hover {
  border-top: 3px dashed red !important;
}

.hiprint-headerLine:hover:before {
  content: "页眉线";
  left: calc(50% - 18px);
  position: relative;
  background: #ffff;
  top: -12px;
  color: red;
  font-size: 12px;
}

.hiprint-footerLine:hover:before {
  content: "页脚线";
  left: calc(50% - 18px);
  position: relative;
  color: red;
  background: #ffff;
  top: -12px;
  font-size: 12px;
}
</style>