<template>
  <el-row class="QT-common-search-box" :gutter="16" >
    <el-form @submit.native.prevent>
      <el-col v-for="(item, index) in searchList" :key="index" :xs="{span:24}" :sm="{span:12}" :md="{span:12}" :lg="{span:8}" :xl="{span:6}" >
        <el-form-item :label="item.__config__.label" v-show="index<3 || (index>=3 && showAll)">
          <template v-if="useInputList.indexOf(item.__config__.qtKey)>-1">
            <el-input v-model="item.value" :placeholder="item.__config__.label" clearable
              class="item" @keyup.enter.native="search">
            </el-input>
          </template>
          <template v-else-if="useDateList.indexOf(item.__config__.qtKey)>-1">
            <el-date-picker v-model="item.value" value-format="timestamp" format="yyyy-MM-dd"
              start-placeholder="开始日期" end-placeholder="结束日期" class="item" type="daterange"
              clearable />
          </template>
          <template v-else-if="useSelectList.indexOf(item.__config__.qtKey)>-1">
            <el-select v-model="item.value" :placeholder="'请选择'+item.__config__.label" clearable
              filterable class="item" :multiple="item.multiple">
              <el-option :label="oItem[item.__config__.props.label]"
                v-for="(oItem, i) in item.__slot__.options.filter(x=> !item.filter || handleFilter(item,x))"
                :value="oItem[item.__config__.props.value]" :key="i"></el-option>
            </el-select>
          </template>
          <template v-else>
            <template
              v-if="item.__config__.qtKey==='numInput'||item.__config__.qtKey==='calculate'">
              <num-range v-model="item.value"></num-range>
            </template>
            <template v-if="item.__config__.qtKey==='cascader'">
              <el-cascader v-model="item.value" :options="item.options" clearable
                :show-all-levels="item['show-all-levels']" :props="item.props.props" filterable
                :placeholder="'请选择'+item.__config__.label" class="item"></el-cascader>
            </template>
            <template
              v-if="item.__config__.qtKey==='time'|| item.__config__.qtKey==='timeRange'">
              <el-time-picker v-model="item.value" start-placeholder="开始时间" end-placeholder="结束时间"
                clearable :value-format="item['value-format']" :format="item.format" is-range
                class="item" />
            </template>
            <template v-if="item.__config__.qtKey==='date'">
              <el-date-picker v-model="item.value" v-if="item.conditionalType == 'Equal'" type="date" clearable
                :value-format="item['value-format']" :format="item.format" class="item" :picker-options="qt.dtPickerSingleOptions()">
              </el-date-picker>
              <el-date-picker v-else v-model="item.value" :type="item.type? item.type+'range' : 'daterange'" clearable
                :value-format="item['value-format']" :format="item.format" start-placeholder="开始日期"
                end-placeholder="结束日期" class="item" :picker-options="dateRangePickerOptions">
              </el-date-picker>
            </template>
            <template v-if="item.__config__.qtKey==='dateRange'">
              <el-date-picker v-model="item.value" :type="item.type" clearable
                :value-format="item['value-format']" :format="item.format" start-placeholder="开始日期"
                end-placeholder="结束日期" class="item">
              </el-date-picker>
            </template>
            <template v-if="commonList.includes(item.__config__.qtKey)">
              <component :is="item.__config__.tag" v-model="item.value" clearable
                :placeholder="'请选择'+item.__config__.label" class="item" />
            </template>
            <template v-if="item.__config__.qtKey==='address'">
              <QTAddress v-model="item.value" :placeholder="'请选择'+item.__config__.label"
                :level="item.level" class="item" clearable />
            </template>
            <template v-if="item.__config__.qtKey==='treeSelect'">
              <QT-TreeSelect v-model="item.value" :placeholder="'请选择'+item.__config__.label"
                :options="item.options" :props="item.props.props" class="item" clearable />
            </template>
            <template
              v-if="item.__config__.qtKey==='createUser'||item.__config__.qtKey==='modifyUser'">
              <userSelect v-model="item.value" :placeholder="'请选择'+item.__config__.label" clearable
                class="item" />
            </template>
            <template v-if="item.__config__.qtKey==='currOrganize'">
              <comSelect v-model="item.value" :placeholder="'请选择'+item.__config__.label" clearable
                class="item" />
            </template>
            <template v-if="item.__config__.qtKey==='currDept'">
              <depSelect v-model="item.value" :placeholder="'请选择'+item.__config__.label" clearable
                class="item" />
            </template>
            <template v-if="item.__config__.qtKey==='currPosition'">
              <posSelect v-model="item.value" :placeholder="'请选择'+item.__config__.label" clearable
                class="item" />
            </template>
          </template>
        </el-form-item>
      </el-col>
      <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:12}" :lg="{span:8}" :xl="{span:6}">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()">{{$t('common.search')}}
          </el-button>
          <el-button v-if="searchList.length" icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
          </el-button>
          <el-button type="text" icon="el-icon-download" @click="handleExport()">导出</el-button>
          <template v-if="searchList.length>3">
            <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
              展开
            </el-button>
            <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
              收起</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-form>
    <qt-export-form v-if="exportBoxVisible" ref="ExportBox" @download="download"></qt-export-form>
  </el-row>
</template>

<script>
import { deepClone } from '@/utils'
import { dyOptionsList, useInputList, useDateList, useSelectList } from '@/components/Generator/generator/comConfig'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  name:'dynamicReportSearch',
  props: ['list'],
  data() {
    return {
      showAll: false,
      searchList: [],
      commonList: ['comSelect', 'depSelect', 'posSelect', 'userSelect', 'dicSelect'],
      useInputList,
      useDateList,
      useSelectList,
      dateRangePickerOptions: {
          shortcuts: [{
            text: '当天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date(end.getFullYear(), end.getMonth(), 1);
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              // start.setTime(start.getFullYear(), 0, 1)
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '今年',
            onClick(picker) {
              const end = new Date();
              const start = new Date(end.getFullYear(), 0, 1);
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              // start.setTime(start.getFullYear(), 0, 1)
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        exportBoxVisible:false
    }
  },
  watch: {
    list: {
      handler: function (val) {
        // console.log('list...change',val)
        this.searchList = deepClone(val)
        this.buildOptions(this.searchList)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    buildOptions(componentList) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (config.qtKey === 'cascader') cur.props.props.multiple = false
        if (dyOptionsList.indexOf(config.qtKey) > -1) {
          let isTreeSelect = config.qtKey === 'treeSelect' || config.qtKey === 'cascader'
          if (config.dataType === 'dictionary') {
            if (!config.dictionaryType) return
            getDictionaryDataSelector(config.dictionaryType).then(res => {
              isTreeSelect ? cur.options = res.data.list : cur.__slot__.options = res.data.list
            })
          }
          if (config.dataType === 'dynamic') {
            if (!config.propsUrl) return
            getDataInterfaceRes(config.propsUrl).then(res => {
              // let data = res.data.data
              // if (typeof data === "string") {
              //   data = JSON.parse(data)
              // }
              const data= this.qt.interfaceDataHandler(res.data)
              // console.log(data)
              if (Array.isArray(data)) {
                isTreeSelect ? cur.options = data : cur.__slot__.options = data
              } else {
                isTreeSelect ? cur.options = [] : cur.__slot__.options = []
              }
            })
          }
        }

        // 设置默认值
        if(cur.defaultValue){
            // console.log(cur)          
            let v = cur.defaultValue
            if(config.qtKey == 'date'){
              if (['@今天'].indexOf(cur.defaultValue) > -1) {
                v =new Date() 
              }
              if(cur.conditionalType == 'Equal'){
                  // v =new Date()
              }else{
                // cur.value = [new Date(),new Date()]
                v = [v,v]
              }
            }
            cur.value = v 
          }
       
      })
    },
    setProps(componentList) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (config.qtKey === 'cascader') cur.props.props.multiple = false
      })
    },
    getSearchObj(){
      let obj = {}
      for (let i = 0; i < this.searchList.length; i++) {
        const e = this.searchList[i]
        if (e.value) {
          if (Array.isArray(e.value)) {
            if (e.value.length) obj[e.__vModel__] = e.value
          } else {
            obj[e.__vModel__] = e.value
          }
        }
      }
      return obj
    },
    search() {
      let obj = this.getSearchObj()
      let queryJson = JSON.stringify(obj) === "{}" ? '' : JSON.stringify(obj)
      this.$emit('search', queryJson)
    },
    reset() {
      this.treeReset()
      this.$emit('reset')
    },
    treeReset() {
      for (let i = 0; i < this.searchList.length; i++) {
        this.searchList[i].value = ''
      }
    },
    handleExport(){
      // this.$emit('search', queryJson)
      this.exportBoxVisible = true;
      this.$nextTick(() => {
        this.$refs.ExportBox.init();
      });
    },
    /** 导出数据 */
    download(data){
      let obj = {}
      for (let i = 0; i < this.searchList.length; i++) {
        const e = this.searchList[i]
        if (e.value) {
          if (Array.isArray(e.value)) {
            if (e.value.length) obj[e.__vModel__] = e.value
          } else {
            obj[e.__vModel__] = e.value
          }
        }
      }
      let queryJson = JSON.stringify(obj) === "{}" ? '' : JSON.stringify(obj)
      console.log(data)
      const q = {
        ...data,
        queryJson
      }
      this.exportBoxVisible = false;
      this.$emit('export', q)
    },
    handleFilter(item,val){
      // console.log('handleFilter:',item,val)
      if (item.filter) {
        item.__filter = eval(item.filter)
        // this.analysisExpression(item.filter)
        // item.__filter = eval(item.filter)
      }
      if (item.__filter) {
        try {
          return item.__filter(val,this.getSearchObj())
        } catch (error) {
          console.log(error)
          return false
        }
      } 
      return true
    },
    analysisExpression(exp){
      let str = exp
      const regex = /{([^}]+)}/g;
      let match;
      const results = [];
      let provider = this.getSearchObj()
      while ((match = regex.exec(str))) {
          results.push(match[1]); // 第一个括号中的内容是我们想要的匹配项
          const key = match[1];          
          if (key) {
            const value = provider[key] || '';
            str= str.replace(match[0],value)
         }
      }
      
      console.log(str)
      return results;
    }
  }
}
</script>