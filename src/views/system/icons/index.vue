<template>
  <div class="QT-common-layout icons-container">
    <div class="QT-common-layout-center">
      <el-row class="QT-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="图标名称">
              <el-input v-model="keyword" placeholder="请输入图标名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="QT-common-layout-main QT-flex-main">
        <el-tabs type="border-card" class="QT-el_tabs" v-model="activeName">
          <el-tab-pane label="系统图标">
        <!-- <el-card class="QT-el_tabs">
          <div class="el-tab-pane"> -->
          <el-row>
            <el-col :span="6" v-for="(item,i) of qtIconsList" :key="`qtIconsList_${i}`"
              @click.native="handleClipboard(generateqtIconCode(item),$event)" class="icon-item">
              <i :class="generateqtIconCode(item)" />
              <span>{{ item }}</span>
            </el-col>

            <el-col :span="6" v-for="(item,i) of elementIconsList" :key="`elementIconsList_${i}`"
              @click.native="handleClipboard(item,$event)" class="icon-item">
              <i :class="item" />
              <span>{{ item }}</span>
            </el-col>

            <el-col :span="6" v-for="(item,i) of qtCustomList" :key="`qtCustomList_${i}`"
              @click.native="handleClipboard(generateqtCustomCode(item),$event)"
              class="icon-item">
              <i :class="generateqtCustomCode(item)" />
              <span>{{ item }}</span>
            </el-col>
          </el-row>
            <!-- </div>
        </el-card> -->
        </el-tab-pane>
      </el-tabs>
        
        <!-- <el-tabs type="border-card" class="QT-el_tabs" v-model="activeName">
          <el-tab-pane label="SystemIcon 图标">
            <el-row>
              <el-col :span="6" v-for="(item,i) of qtIconsList" :key="i"
                @click.native="handleClipboard(generateqtIconCode(item),$event)" class="icon-item">
                <i :class="generateqtIconCode(item)" />
                <span>{{ item }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Element-UI 图标">
            <el-row>
              <el-col :span="6" v-for="(item,i) of elementIconsList" :key="i"
                @click.native="handleClipboard(item,$event)" class="icon-item">
                <i :class="item" />
                <span>{{ item }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="更多图标">
            <el-row>
              <el-col :span="6" v-for="(item,i) of qtCustomList" :key="i"
                @click.native="handleClipboard(generateqtCustomCode(item),$event)"
                class="icon-item">
                <i :class="generateqtCustomCode(item)" />
                <span>{{ item }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import elementIconsJson from 'static/json/element-icons.json'
import qtIconsJson from 'static/json/qtIcon.json'
import qtCustomJson from 'static/json/qtCustom.json'
const qtIcons = qtIconsJson.glyphs.sort((a, b) => a.font_class>b.font_class?1:-1).map(o => `icon-qt-${o.font_class}`)
const qtCustom = qtCustomJson.glyphs.sort((a, b) => a.font_class>b.font_class?1:-1).map(o => `qt-custom-${o.font_class}`)
const elementIcons = elementIconsJson.sort((a, b) => a.name>b.name?1:-1).map(name => `el-icon-${name}`)
export default {
  name: 'system-icons',
  data() {
    return {
      elementIcons,
      qtIcons,
      qtCustom,
      qtIconsList: [],
      qtCustomList: [],
      elementIconsList: [],
      keyword: '',
      activeName: ''
    }
  },
  watch: {
    activeName(val) {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.search()
      }
    },
    // keyword(val) {
    //   this.search()
    // }
  },
  mounted(){
    this.search()
  },
  methods: {
    search() {
      // let key = ''
      // if (this.activeName == '0') {
      //   key = 'qtIcons'
      // } else if (this.activeName == '1') {
      //   key = 'elementIcons'
      // } else if (this.activeName == '2') {
      //   key = 'qtCustom'
      // }
      // if (this.keyword) {
      //   this[key + 'List'] = this[key].filter(o => o.indexOf(this.keyword) > -1)
      // } else {
      //   this[key + 'List'] = this[key]
      // }

      let keys = ['qtIcons','elementIcons','qtCustom']
      if (this.keyword) {
        keys.forEach(key=>{
          this[key + 'List'] = this[key].filter(o => o.indexOf(this.keyword) > -1)
        })
      }else {
        keys.forEach(key=>{
          this[key + 'List'] = this[key]
        })
      }
    },
    reset() {
      this.keyword = ''
      this.search()
    },
    generateqtIconCode(symbol) {
      return `icon-qt ${symbol}`
    },
    generateqtCustomCode(symbol) {
      return `qt-custom ${symbol}`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  .QT-common-layout-main {
    padding: 0;
  }
  .icon-item {
    padding: 0 10px;
    height: 40px;
    line-height: 38px;
    border: 1px dashed transparent;
    color: #6b7a99;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    i {
      font-size: 16px;
      line-height: 40px;
      margin-right: 14px;
      vertical-align: top;
    }
    span {
      line-height: 40px;
      vertical-align: top;
    }
    &:hover {
      border-color: #188ae2;
      i {
        font-size: 30px;
      }
    }
  }

  span {
    font-size: 14px;
  }

  .disabled {
    pointer-events: none;
    margin-right: 14px;
  }
}
</style>