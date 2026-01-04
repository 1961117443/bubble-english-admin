<template>
  <div class="navbar" :class="[slideClass,!needTagsView?'hideTagsView':'']">
    <logo />
    <Menu class="main-menu" />
    <NavbarRight />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Logo from './Logo'
import Menu from './menu'
import NavbarRight from '../components/NavbarRight'
export default {
  components: { Logo, Menu, NavbarRight },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      needTagsView: state => state.settings.tagsView,
    })
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  .main-menu {
    flex: 1;
    overflow: hidden;
    height: 60px;
  }
}

.hideTagsView{
  margin-bottom: 0px;
}
</style>