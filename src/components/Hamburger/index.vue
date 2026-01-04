<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <i class="icon-qt icon-qt-header-collapse1" v-if='isActive'></i>
    <i class="icon-qt icon-qt-header-expand" v-else></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.icon-qt {
  font-size: 18px;
  color: #666666;
}
</style>