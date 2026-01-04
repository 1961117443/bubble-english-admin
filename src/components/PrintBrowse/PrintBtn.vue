<template>
  <el-link class="qt-print-link" v-if="link && (printDevList.length == 0)" :underline="false" type="warning" disabled>{{ title }}</el-link>
  <el-button type="info" v-else-if="printDevList.length == 0" disabled
    >{{ title }}</el-button
  >
  <el-link :loading="loading" class="qt-print-link" v-else-if="printDevList.length == 1 && link" :underline="false" type="warning" @click="print(printDevList[0].id)">{{ title }}</el-link>
  <el-button
    type="warning"
    v-else-if="printDevList.length == 1"
    @click="print(printDevList[0].id)"
    :loading="loading"
    >{{ title }}
  </el-button>
  <el-dropdown v-else class="qt-print-btn">
    <el-link style="font-size: 12px;" :loading="loading" v-if="link" :underline="false" type="warning">{{ title }}<i class="el-icon-arrow-down el-icon--right"></i></el-link>
    <el-button v-else type="warning" :loading="loading">
      {{ title }}<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        @click.native="print(item.id)"
        v-for="item in printDevList"
        :key="item.id"
        >{{ item.fullName }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getMenuPrint } from "@/api/system/menu";
import HiPrintPreview from "@/components/PrintBrowse/HiPrintPreview";
import { getData } from "@/api/system/printDev";
import { Loading } from 'element-ui';
export default {
  name: "PrintBtn",
  components: { HiPrintPreview },
  data() {
    return {
      // 打印模板集合
      printDevList: [],
      loading: false,
    };
  },
  props: {
    id:{
      type:[String,Number,Array]
    },
    link:{
      type:[Boolean,String],
      // default:false
    },
    data:{
      type:Array
    },
    beforePrint:{
      type:Function
    },
    afterQuery:{
      type:Function
    },
    /** 直接打印 */
    fast:{
      type:Boolean,
      default:false
    },
    title:{
      type:String,
      default:'打印'
    },
    beforeHandlePrint:{
      type:Function
    }
  },
  async created() {
  },
  async mounted() {    
    // console.log('print-btn',this.data)
    if (!this.data) {
      // console.log(this.$attrs)
      const modelId = this.$route.meta.modelId || "";
      // 加载打印模板
      if (modelId) {
        await getMenuPrint(modelId).then((res) => (this.printDevList = res.data));
      }
    }else{
      this.printDevList = this.data
    }
  },
  computed:{
    // 是否批量打印
    isBatch(){
      return Array.isArray(this.id)
    }
  },
  watch:{
    data:{
      handler(val){
        if (val && val) {
          
        }
        this.printDevList = val
      },
      // immediate:true
    }
  },
  methods: {
    async print(id) {
      let fast = this.fast
      const setting= this.printDevList.find(x=>x.id == id)
      if (setting && setting.propertyJson) {
        if (typeof setting.propertyJson === 'string') {
          setting.propertyJson = JSON.parse(setting.propertyJson)
        }
        if (setting.propertyJson.type == 1) {
          fast = true
        }
      }
      if (this.beforeHandlePrint) {
        const func =  this.beforeHandlePrint(setting)
        if (func && func.then) {
            await func
        }
      }
      if (this.isBatch) {
        fast = true
        for (let index = 0; index < this.id.length; index++) {
          const _id = this.id[index];
          await this.printCore(id,_id,fast,setting)
        }
      }else{
        await this.printCore(id,this.id,fast,setting)
      }
      
    },
    async printCore(id,formId,fast,setting) {
      this.loading = true;
      let loadingInstance = Loading.service({ fullscreen: true });
      let query = {
        id: id,
        formId: formId
      }
      
      if (this.beforePrint) {
        try {          
          const func = this.beforePrint(query,setting)
          // console.log(func)
          if (func && func.then) {
            await func
          }
        } catch (error) {
          return this.$message.error(error.message)
        }
      }
      getData(query)
        .then((res) => {
          if (!res.data) return;
        //   console.log(res.data);
          if (this.afterQuery) {
            this.afterQuery(res.data)
          }
          let { printTemplate, printData } = res.data;
        //   this.printTemplate = res.data.printTemplate;
        //   this.data = res.data.printData;
        //   this.recordList = res.data.operatorRecordList || [];

          // console.log(this.$store.state.user.printData)

          // const fast = this.fast

          if (fast) {
            this.$print2(undefined,JSON.parse(printTemplate),printData)
          }else{
            this.$print(undefined,JSON.parse(printTemplate),printData)
          }          
          const p= this.printDevList.find(x=>x.id==id)
          this.$emit('print',{print:p,printData:printData,key:this.id,query})
        })
        .finally((_) => {
          (this.loading = false)
          loadingInstance.close();
          this.$store.dispatch("user/setPrintData", null);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.qt-print-btn {
  margin-right: 10px;

  .el-button--small {
    padding: 8px 15px;
  }
}

.qt-print-link{
  font-size: 12px;
  margin-right: 10px;
  margin-left: 10px;
}
</style>