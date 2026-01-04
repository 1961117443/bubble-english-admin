<template>
  <section class="app-main" :copyright="sysConfig.copyright">
    <template v-if="useCache">
      <keep-alive>
        <router-view ref="pageContainer" :key="key" />
      </keep-alive>
    </template>
    <router-view v-else :key="key" />
    <!-- <keep-alive :include="useCache?cachedViews:[]">
      <router-view :key="key" />
    </keep-alive> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews || []
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews || []
    },
    useCache() {
      return this.$store.state.settings.useCache
    },
    key() {
      return this.$route.path
    },
    sysConfig() {
      return this.$store.state.settings.sysConfig
    }
  },
  watch:{
    cachedViews:{
      handler(nv,ov){
        if (this.useCache && this.$refs.pageContainer) {
            // console.log(this.$refs.pageContainer)
            const {cache, keys} = this.$refs.pageContainer.$options.parent;
            // console.log(cache,keys,nv,this.visitedViews)
            // 遍历删除，或指定删除路由缓存
            for (let i = keys.length - 1; i >= 0; i--) {
              const key = keys[i]
              const v = this.visitedViews.find(item => item.path == key)
              if (!v) {
                delete cache[key];// 删除指定路由缓存
                keys.splice(i, 1);
              }
            }
            // keys.forEach(key => {
                
            // })
            // // 将值清空
            // keys.splice(0, keys.length - 1);
        }  
      },
      deep:true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background: url('../../assets/images/loading-iframe.gif') no-repeat center
    center #ebeef5;
  background-size: 600px 450px;
  &::before {
    content: attr(copyright);
    font-size: 14px;
    text-align: center;
    color: #999;
    text-align: center;
    width: 100%;
    display: block;
    position: absolute;
    bottom: 20px;
    left: 0;
  }
}

.fixed-header + .app-main {
  // padding-top: 50px;
  padding: 70px 20px 20px;
}

.hasTagsView {
  .app-main {
    height: calc(100vh - 100px);
  }

  .fixed-header + .app-main {
    padding: 104px 20px 20px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
