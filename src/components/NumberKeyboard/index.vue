<template>
  <div class="number-keyboard">
    <div class="value">
      {{ value }}
    </div>
    <!-- <el-divider></el-divider> -->
    <el-row :gutter="16">
        <el-col :span="item.span || 6" v-for="item in list" :key="item.key">
            <el-card shadow="hover" @click.native="handleClick(item)">
                <div class="text">{{ item.name }}</div>
            </el-card>
        </el-col>
        <el-col :span="12">
          <el-button size="large" @click="handleClick({key:'ok'})" type="primary" style="width:100%;font-size: 20px;" >确定</el-button>
        </el-col>
        <el-col :span="12">
          <el-button size="large" @click="handleClick({key:'close'})" type="danger"  style="width:100%;font-size: 20px;" >关闭</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "NumberKeyboard",
  data() {
    return {
        list:[
            {key:'1',name:'1'},
            {key:'2',name:'2'},
            {key:'3',name:'3'},
            {key:'4',name:'4'},
            {key:'5',name:'5'},
            {key:'6',name:'6'},
            {key:'7',name:'7'},
            {key:'8',name:'8'},
            {key:'9',name:'9'},
            {key:'0',name:'0'},
            {key:'.',name:'.'},
            {key:'C',name:'C'}
        ],
        value:'0'
    };
  },
  // created() {
  //   console.log('created')
  // },
  // mounted() {
  //   console.log('mounted')
  // },
  // updated() {
  //   console.log('updated')
  // },
  beforeDestroy() {},
  methods:{
    handleClick(item){
      switch (item.key) {
        case 'ok':
          if (this.value) {
            const v = eval(this.value)
            // console.log(v)
            this.$emit('ok',Number(v))
            this.value = '0'
          }
          break;
        case 'close':
        this.$emit('ok')
          break;
        case 'C':
          this.value='0'
          break;
        default:
          if (this.value == '0' && item.key !='.') {
            this.value = ''
          }
          this.value+=item.key
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.number-keyboard{
  --fontSize: 28px;

  font-size: var(--fontSize);

  .el-col{
    margin-bottom: 8px;
  }

  .text{
    text-align: center;
    display: block;
  }

  .value{
    height: 60px;
    text-align: right;
    font-size: 32px;
    // border-bottom: 1px solid #eee;
  }
}
</style>