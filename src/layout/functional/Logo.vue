<template>
  <div class="functional-logo-container">
    <router-link class="sidebar-logo-link" to="/">
      <el-image class="sidebar-logo" :src="define.comUrl+sysConfig.navigationIcon"
        v-if="sysConfig && sysConfig.navigationIcon">
        <template slot="error">
          <img src="@/assets/images/admin-logo.png" class="sidebar-logo"
            v-if="slideClass==='lightWhite'" />
          <img src="@/assets/images/admin-logo.png" class="sidebar-logo" v-else />
        </template>
      </el-image>
      <template v-else>
        <div class="font">{{ sysConfig.sysName }}</div>
        <!-- <img src="@/assets/images/admin-logo2.png" class="sidebar-logo"
          v-if="slideClass==='lightWhite'" />
        <img src="@/assets/images/admin-logo2.png" class="sidebar-logo" v-else /> -->
      </template>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SidebarLogo',
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig
    }
  },
}
</script>

<style lang="scss" scoped>
.functional-logo-container {
  width: 210px;
  height: 60px;
  line-height: 60px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 100%;
      width: 100%;
    }

    .font{
      font-size: 26px;
      color: #0066cc;
    }
  }
}
</style>