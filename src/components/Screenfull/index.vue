<template>
  <el-tooltip effect="dark"
    :content="isFullscreen?$t('common.outFullScreen'):$t('common.fullScreen')" placement="top">
    <el-link
      :icon="`icon-qt ${isFullscreen?'icon-qt-compress-screen':'icon-qt-full-screen'} QT-common-head-icon`"
      :underline="false" @click="toggleFullScreen()" />
  </el-tooltip>
</template>

<script>
import screenfull from 'screenfull'

export default {
  props: {
    isContainer: {
      type: Boolean,
      default: true
    }
  },
  name: 'Screenfull',
  data() {
    return {
      refEle: '',
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
    this.refEle = this.$options.parent.$el
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '不支持全屏',
          type: 'warning'
        })
        return false
      }
      if (this.isContainer) {
        screenfull.toggle(this.refEle)
      } else {
        screenfull.toggle()
      }
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    },
    ///// 浏览器全屏
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        this.requestFullScreen(document.documentElement);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    requestFullScreen(element) {
      const requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullscreen;

      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") { 
        // Older IE.
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    }
  }
}
</script>