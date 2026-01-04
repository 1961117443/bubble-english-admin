<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false"
    v-on="$listeners" @open="onOpen" fullscreen lock-scroll class="QT-full-dialog" append-to-body
    :show-close="false" :modal="false">
    <div class="QT-full-dialog-header">
      <div class="header-title">
        <p class="header-txt">{{title}}</p>
      </div>
      <div class="options">
        <el-form>
          <el-button @click="goBack()" :disabled="false">{{$t('common.cancelButton')}}</el-button>
        </el-form>
      </div>
    </div>
    <div class="main">
      <div class="content">
        <!-- <img :src="define.comUrl + `/api/File/Image/document/${file.fileId}`" /> -->
        <el-image v-if="isPic" :src="url" :preview-src-list="[url]" />
        <iframe v-else width="100%" height="100%" :src="url" frameborder="0"></iframe>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { PreviewFile } from '@/api/common'
export default {
  props: ['file'],
  data() {
    return {
      title: '',
      url: '',
      isPic:false
    }
  },
  methods: {
    goBack() {
      this.$emit('update:visible', false)
    },
    onOpen() {
      this.title = '文档预览 - ' + this.file.name
      this.url = ''
      this.isPic =false
      let query = {
        fileName: this.file.fileId,
        fileVersionId: this.file.fileVersionId,
        fileDownloadUrl: this.file.url
      }
      const arr = query.fileName.split('.')
      const ext = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"]
      if (arr.length>1 && ext.indexOf(arr[1])>-1 ) {
        PreviewFile(query).then(res => {
          if (res.data) {
            this.url = res.data
          } else {
            this.$message.warning('文件不存在')
            this.goBack()
          }
        })
      }else{
        this.isPic =true
        this.url = this.define.comUrl + query.fileDownloadUrl
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>