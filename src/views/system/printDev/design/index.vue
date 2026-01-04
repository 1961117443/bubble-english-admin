<template>
  <div class="print-template-detail">
    <div class="print-template-detail__body">
      <div v-show="showFieldPanel" class="system-view-nav">
        <el-scrollbar class="left-scrollbar">
          <div class="QT-common-title">
            <h2>表单字段</h2>
          </div>
          <!-- @node-click="handleNodeClick" -->
          <el-tree
            :data="treeData"
            default-expand-all
            :expand-on-click-node="false"
            :props="{ children: 'children', label: 'fieldName' }"
          ></el-tree>

          <div class="QT-common-title">
            <h2>系统字段</h2>
          </div>          
          <!-- @node-click="handleNodeClick" -->
          <el-tree :data="sysData" default-expand-all :expand-on-click-node="false"
            :props="{ children: 'children',  label: 'fieldName'  }"   ></el-tree>
           
        </el-scrollbar>
      </div>

      <div class="system-view-content">
        <el-card style="height: calc(100vh - 60px); overflow: auto">
          <div style="display: flex; flex-direction: column">
            <el-space style="margin-bottom: 10px">
              <el-button-group>
                <template v-for="(value, type) in paperTypes">
                  <el-button
                    :type="curPaperType === type ? 'primary' : ''"
                    @click="setPaper(type, value)"
                    :key="type"
                  >
                    {{ type }}
                  </el-button>
                </template>
                <el-popover
                  v-model="paperPopVisible"
                  title="设置纸张宽高(mm)"
                  trigger="click"
                >
                  <div>
                    <div style="margin: 10px 10px">
                      <el-input
                        type="number"
                        v-model="paperWidth"
                        style="width: 100px; text-align: center"
                        placeholder="宽(mm)"
                      />
                      <span style="margin: 0 10px">~</span>
                      <el-input
                        type="number"
                        v-model="paperHeight"
                        style="width: 100px; text-align: center; border-left: 0"
                        placeholder="高(mm)"
                      />
                    </div>
                    <el-button
                      type="primary"
                      style="width: 100%"
                      @click="otherPaper"
                      >确定</el-button
                    >
                  </div>
                  <el-button
                    slot="reference"
                    :type="'other' == curPaperType ? 'primary' : ''"
                    >自定义纸张</el-button
                  >
                </el-popover>
              </el-button-group>

              <el-button-group>
                <el-button
                  plain
                  icon="el-icon-zoom-out"
                  @click="changeScale(false)"
                ></el-button>
                <el-button plain style="width: 70px"
                  >{{ (scaleValue * 100).toFixed(0) }}%</el-button
                >
                <el-button
                  plain
                  icon="el-icon-zoom-in"
                  @click="changeScale(true)"
                ></el-button>
              </el-button-group>

              <el-button type="primary" icon="redo" @click="rotatePaper()"
                >旋转</el-button
              >
              <el-button type="primary" icon="eye" @click="preView">
                预览
              </el-button>
              <el-button type="primary" icon="printer" @click="print">
                直接打印
              </el-button>
              <el-button type="primary" @click="onlyPrint">
                Api单独打印
              </el-button>
              <el-button type="primary" @click="onlyPrint2">
                Api单独直接打印
              </el-button>
              <el-popconfirm
                title="是否确认清空?"
                okType="danger"
                confirm-button-text="确定"
                @confirm="clearPaper"
              >
                <el-icon
                  slot="icon"
                  type="question-circle-o"
                  style="color: red"
                />
                <el-button slot="reference" type="danger">
                  清空
                  <i class="el-icon-close"></i>
                </el-button>
              </el-popconfirm>
              <json-view :template="template" />
              <el-button type="primary" icon="printer" @click="getPanel()">
                加载样例
              </el-button>
              <el-button type="text" icon="" @click="more=!more">
                {{ more ? '收起':'展开'}}
              </el-button>
              <el-button type="text" icon="" @click="showFieldPanel=!showFieldPanel">
                字段面板{{ showFieldPanel ? '隐藏':'展开'}}
              </el-button>
            </el-space>
            <template v-if="more">
            <el-space style="margin-bottom: 10px">
              <el-button type="primary" @click="exportPdf('')">
                导出获取pdf(Blob)
              </el-button>
              <el-button type="primary" @click="exportPdf('arraybuffer')">
                导出获取pdf(ArrayBuffer)
              </el-button>
              <el-button type="primary" @click="exportPdf('dataurl')">
                导出获取pdf(DataUrl)
              </el-button>
              <el-button type="primary" @click="exportPdf('bloburl')">
                导出获取pdf(BlobUrl)
              </el-button>
              <el-button type="primary" @click="exportPdf('dataurlstring')">
                导出获取pdf(DataUrlString)
              </el-button>
              <el-button
                type="primary"
                @click="exportPdf('pdfobjectnewwindow')"
              >
                导出查看pdf(PdfObjectNewWindow)
              </el-button>
            </el-space>
            <el-space style="margin-bottom: 10px">
              <el-button type="primary" @click="ippPrintAttr">
                ipp获取 打印机 参数情况
              </el-button>
              <el-button type="primary" @click="ippPrintTest">
                ipp打印测试
              </el-button>
              <el-button type="primary" @click="ippRequestTest">
                ipp请求 获取 打印机 参数情况
              </el-button>
              <el-button type="primary" @click="ippRequestPrint">
                ipp请求 打印测试
              </el-button>
            </el-space>
            <el-space style="margin-bottom: 10px">
              <el-input
                type="textarea"
                style="width: 30vw"
                v-model="jsonIn"
                @pressEnter="updateJson"
                placeholder="复制json模板到此后 点击右侧更新"
                allow-clear
              />
              <el-button type="primary" @click="updateJson">
                更新json模板
              </el-button>
              <el-button type="primary" @click="exportJson">
                导出json模板到 textArea
              </el-button>
              <el-input
                type="textarea"
                style="width: 30vw"
                v-model="jsonOut"
                placeholder="点击左侧导出json"
                allow-clear
              />
            </el-space>
            <el-space style="margin-bottom: 10px">
              <el-button type="primary" @click="getSelectEls">
                获取选中元素
              </el-button>
              <el-button type="primary" @click="updateFontSize">
                选中元素字体12pt
              </el-button>
              <el-button type="primary" @click="updateFontWeight">
                选中元素字体Bolder
              </el-button>
              <el-button type="primary" @click="setElsSpace(true)">
                水平间距10
              </el-button>
              <el-button type="primary" @click="setElsSpace(false)">
                垂直间距10
              </el-button>
              <el-button-group>
                <el-button
                  v-for="item in alignList"
                  :key="item.key"
                  @click="setElsAlign(item.key)"
                  :title="item.title"
                >
                  <span
                    v-if="item.icon"
                    :class="`glyphicon ${item.icon}`"
                  ></span>
                </el-button>
              </el-button-group>
            </el-space>
          </template>
          </div>
          <el-row :gutter="8">
            <el-col :span="4">
              <el-card style="height: 100vh">
                <el-row>
                  <el-col
                    :span="24"
                    class="rect-printElement-types hiprintEpContainer"
                  >
                    <el-row class="drag_item_title">拖拽组件列表</el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.text"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-text-width"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">文本</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.image"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-picture"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">图片</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.longText"
                          >
                            <span
                              class="glyphicon glyphicon-subscript"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">长文</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.table"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-th"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">表格</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.emptyTable"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-th"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">空白表格</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.html"
                            style=""
                          >
                            <span
                              class="glyphicon glyphicon-header"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">html</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.customText"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-text-width"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">自定义</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="drag_item_title">辅助</el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.hline"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-resize-horizontal"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">横线</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.vline"
                            style
                          >
                            <span
                              class="glyphicon glyphicon-resize-vertical"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">竖线</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a class="ep-draggable-item" tid="defaultModule.rect">
                            <span
                              class="glyphicon glyphicon-unchecked"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">矩形</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a class="ep-draggable-item" tid="defaultModule.oval">
                            <span
                              class="glyphicon glyphicon-record"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">椭圆</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="height: 100px">
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.barcode"
                          >
                            <span
                              class="glyphicon glyphicon-barcode"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">条形码</p>
                          </a>
                        </div>
                      </el-col>
                      <el-col :span="12" class="drag_item_box">
                        <div>
                          <a
                            class="ep-draggable-item"
                            tid="defaultModule.qrcode"
                          >
                            <span
                              class="glyphicon glyphicon-qrcode"
                              ariel-hidden="true"
                            ></span>
                            <p class="glyphicon-class">二维码</p>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="15">
              <el-card class="card-design">
                <div
                  id="hiprint-printTemplate"
                  class="hiprint-printTemplate"
                ></div>
              </el-card>
            </el-col>
            <el-col :span="5" class="params_setting_container">
              <el-card>
                <el-row class="hinnn-layout-sider">
                  <div id="PrintElementOptionSetting"></div>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <!-- 预览 -->
          <print-preview ref="preView" />
        </el-card>
      </div>
    </div>
  </div>
</template>
  

  <script defer>
import {defaultElementTypeProvider, hiprint} from '@/utils/hiprint'
// import * as vuePluginHiprint from "vue-plugin-hiprint";
import printData from "./print-data";
import printPreview from "./preview";
import jsonView from "./json-view.vue";
import fontSize from "./font-size.js";
import scale from "./scale.js";
// disAutoConnect();
// var hiprint, defaultElementTypeProvider, panel;
let hiprintTemplate, panel;

export default {
  name: "printDesign",
  components: { printPreview, jsonView },
  props: {
    value: String,
    type: Number,
    treeData: {
      type: Array,
      default: () => [],
    },
    sysData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      more:false,
      showFieldPanel:true,
      template: null,
      curPaper: {
        type: "A4",
        width: 210,
        height: 296.6,
      },
      paperTypes: {
        A3: {
          width: 420,
          height: 296.6,
        },
        A4: {
          width: 210,
          height: 296.6,
        },
        A5: {
          width: 210,
          height: 147.6,
        },
        B3: {
          width: 500,
          height: 352.6,
        },
        B4: {
          width: 250,
          height: 352.6,
        },
        B5: {
          width: 250,
          height: 175.6,
        },
      },
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: "220",
      paperHeight: "80",
      // 缩放
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      // 导入导出json
      jsonIn: "",
      jsonOut: "",
      alignList: [
        { key: "left", title: "左对齐", icon: "glyphicon-object-align-left" },
        {
          key: "vertical",
          title: "居中",
          icon: "glyphicon-object-align-vertical",
        },
        { key: "right", title: "右对齐", icon: "glyphicon-object-align-right" },
        { key: "top", title: "顶部对齐", icon: "glyphicon-object-align-top" },
        {
          key: "horizontal",
          title: "垂直居中",
          icon: "glyphicon-object-align-horizontal",
        },
        {
          key: "bottom",
          title: "底部对齐",
          icon: "glyphicon-object-align-bottom",
        },
        {
          key: "distributeHor",
          title: "横向分散",
          icon: "glyphicon-resize-horizontal",
        },
        {
          key: "distributeVer",
          title: "纵向分散",
          icon: "glyphicon-resize-vertical",
        },
      ],
    };
  },
  watch:{
    value:{
      handler(val){
        if (val != this.template) {
          this.jsonIn = val
          
          if (!!this.jsonIn) {
            this.$nextTick(()=>this.updateJson())
          }
        }
      },
      immediate:true,
      deep:true
    },
    jsonIn(){
      this.$emit('input',this.jsonIn)
    }
  },
  computed: {
    curPaperType() {
      let type = "other";
      let types = this.paperTypes;
      for (const key in types) {
        let item = types[key];
        let { width, height } = this.curPaper;
        if (item.width === width && item.height === height) {
          type = key;
        }
      }
      return type;
    },
  },
  mounted() {
    // hiprint = vuePluginHiprint.hiprint;
    // defaultElementTypeProvider = vuePluginHiprint.defaultElementTypeProvider;
    // console.log("defaultElementTypeProvider", defaultElementTypeProvider);
    this.init();
  },
  methods: {
    /**
     * @description: 加载 panel
     */
    getPanel() {
      const panels = require.context("./", true, /panel.*\.js$/);
      let panelObj = panels("./panel.js").default;
      this.jsonIn = JSON.stringify(panelObj);
      this.updateJson();
    },
    init() {
      hiprint.init({
        providers: [new defaultElementTypeProvider()],
        lang: this.$parent.lang,
      });
      // 还原配置
      hiprint.setConfig();
      // 替换配置
      hiprint.setConfig({
        optionItems: [
          fontSize,
          scale,
          (function () {
            function t() {
              this.name = "zIndex";
            }

            return (
              (t.prototype.css = function (t, e) {
                if (t && t.length) {
                  if (e) return t.css("z-index", e);
                }
                return null;
              }),
              (t.prototype.createTarget = function () {
                return (
                  (this.target = $(
                    '<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        元素层级2\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="number" class="auto-submit"/>\n        </div>\n    </div>'
                  )),
                  this.target
                );
              }),
              (t.prototype.getValue = function () {
                var t = this.target.find("input").val();
                if (t) return parseInt(t.toString());
              }),
              (t.prototype.setValue = function (t) {
                this.target.find("input").val(t);
              }),
              (t.prototype.destroy = function () {
                this.target.remove();
              }),
              t
            );
          })(),
        ],
        movingDistance: 2.5,
        text: {
          tabs: [
            // 隐藏部分
            {
              // name: '测试', // tab名称 可忽略
              options: [], // 必须包含 options
            }, // 当修改第二个 tabs 时,必须把他之前的 tabs 都列举出来.
            {
              name: "样式",
              options: [
                {
                  name: "scale",
                  after: "transform", // 自定义参数，插入在 transform 之后
                  hidden: false,
                },
              ],
            },
          ],
          supportOptions: [
            {
              name: "styler",
              hidden: true,
            },
            {
              name: "scale", // 自定义参数，supportOptions 必须得添加
              after: "transform", // 自定义参数，插入在 transform 之后
              hidden: false,
            },
            {
              name: "formatter",
              hidden: true,
            },
          ],
        },
        image: {
          tabs: [
            {
              // 整体替换
              replace: true,
              name: "基本",
              options: [
                {
                  name: "field",
                  hidden: false,
                },
                {
                  name: "src",
                  hidden: false,
                },
                {
                  name: "fit",
                  hidden: false,
                },
              ],
            },
          ],
        },
      });
      // eslint-disable-next-line no-undef
      hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));
      $("#hiprint-printTemplate").empty();
      let that = this;
      this.template = hiprintTemplate = new hiprint.PrintTemplate({
        template: {},
        // 图片选择功能
        onImageChooseClick: (target) => {
          // console.log("onImageChooseClick", target);
          // 测试 3秒后修改图片地址值
          setTimeout(() => {
            // target.refresh(url,options,callback)
            // callback(el, width, height) // 原元素,宽,高
            // target.refresh(url,false,(el,width,height)=>{
            //   el.options.width = width;
            //   el.designTarget.css('width', width + "pt");
            //   el.designTarget.children('.resize-panel').trigger($.Event('click'));
            // })
            target.refresh(
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAIIAQMAAAB99EudAAAABlBMVEUmf8vG2O41LStnAAABD0lEQVR42u3XQQqCQBSAYcWFS4/QUTpaHa2jdISWLUJjjMpclJoPGvq+1WsYfiJCZ4oCAAAAAAAAAAAAAAAAAHin6pL9c6H/fOzHbRrP0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0u/SY9LS0tLS0tLS0tLS0n+edm+UlpaWlpaWlpaWlpaW/tl0Ndyzbno7/+tPTJdd1wal69dNa6abx+Lq6TSeYtK7BX/Diek0XULSZZrakPRtV0i6Hu/KIt30q4fM0pvBqvR9mvsQkZaW9gyJT+f5lsnzjR54xAk8mAUeJyMPwYFH98ALx5Jr0kRLLndT7b64UX9QR/0eAAAAAAAAAAAAAAAAAAD/4gpryzr/bja4QgAAAABJRU5ErkJggg==",
              {
                // auto: true, // 根据图片宽高自动等比(宽>高?width:height)
                // width: true, // 按宽调整高
                // height: true, // 按高调整宽
                real: true, // 根据图片实际尺寸调整(转pt)
              }
            );
          }, 3000);
          // target.getValue()
          // target.refresh(url)
        },
        // 自定义可选字体
        // 或者使用 hiprintTemplate.setFontList([])
        // 或元素中 options.fontList: []
        fontList: [
          { title: "微软雅黑", value: "Microsoft YaHei" },
          { title: "黑体", value: "STHeitiSC-Light" },
          { title: "思源黑体", value: "SourceHanSansCN-Normal" },
          { title: "王羲之书法体", value: "王羲之书法体" },
          { title: "宋体", value: "SimSun" },
          { title: "华为楷体", value: "STKaiti" },
          { title: "cursive", value: "cursive" },
        ],
        dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
        history: true, // 是否需要 撤销重做功能
        onDataChanged: (type, json) => {
          console.log(type); // 新增、移动、删除、修改(参数调整)、大小、旋转
          console.log(json); // 返回 template
          
          
          that.jsonIn = JSON.stringify(json)
          // that.$emit('input',JSON.stringify(json))
        },
        onUpdateError: (e) => {
          console.log(e);
        },
        settingContainer: "#PrintElementOptionSetting",
        paginationContainer: ".hiprint-printPagination",
      });
      hiprintTemplate.design("#hiprint-printTemplate", { grid: true });
      // hiprintTemplate.setFields([{"text":'姓名2',"field":'name'},{"text":'性别2',"field":'gender'}]);
      // console.log(hiprintTemplate);
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1;

      this.$nextTick(()=>{
        // console.log(this.template)
        if (this.value) {
          let o = JSON.parse(this.value)
          this.setPaper('other',{height:o.panels[0].height,width:o.panels[0].width})
        }
      })
    },
    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = {
            type: type,
            width: value.width,
            height: value.height,
          };
          hiprintTemplate.setPaper(value.width, value.height);
        } else {
          this.curPaper = {
            type: "other",
            width: value.width,
            height: value.height,
          };
          hiprintTemplate.setPaper(value.width, value.height);
        }
      } catch (error) {
        this.$message.error(`操作失败: ${error}`);
      }
    },
    otherPaper() {
      let value = {};
      value.width = this.paperWidth;
      value.height = this.paperHeight;
      this.paperPopVisible = false;
      this.setPaper("other", value);
    },
    changeScale(big) {
      let scaleValue = this.scaleValue;
      if (big) {
        scaleValue += 0.1;
        if (scaleValue > this.scaleMax) scaleValue = 5;
      } else {
        scaleValue -= 0.1;
        if (scaleValue < this.scaleMin) scaleValue = 0.5;
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(scaleValue);
        this.scaleValue = scaleValue;
      }
    },
    rotatePaper() {
      if (hiprintTemplate) {
        hiprintTemplate.rotatePaper();
      }
    },
    preView() {
      // 测试, 点预览更新拖拽元素
      hiprint.updateElementType("defaultModule.text", (type) => {
        type.title = "123这是更新后的元素123";
        return type;
      });
      // 测试, 通过socket刷新打印机列表； 默认只有连接的时候才会获取到最新的打印机列表
      hiprint.refreshPrinterList((list) => {
        console.log("refreshPrinterList");
        console.log(list);
      });
      // 测试, 获取IP、IPV6、MAC地址、DNS
      // 参数格式：
      // 1. 类型（ip、ipv6、mac、dns、all、interface、vboxnet）
      // 2. 回调 data => {addr, e}  addr: 返回的数据 e:错误信息
      // 3. 其他参数 ...args
      // hiprint.getAddress("ip", (data) => {
      //   console.log("ip");
      //   console.log(data);
      // });
      // hiprint.getAddress("ipv6", (data) => {
      //   console.log("ipv6");
      //   console.log(data);
      // });
      // hiprint.getAddress("mac", (data) => {
      //   console.log("mac");
      //   console.log(data);
      // });
      // hiprint.getAddress("dns", (data) => {
      //   console.log("dns");
      //   console.log(data);
      // });
      hiprint.getAddress("all", (data) => {
        console.log("all");
        console.log(data);
      });
      // // 各个平台不一样, 用法见: https://www.npmjs.com/package/address
      // hiprint.getAddress(
      //   "interface",
      //   (data) => {
      //     console.log("interface");
      //     console.log(data);
      //   },
      //   "IPv4",
      //   "eth1"
      // );
      console.log('hiprintTemplate',hiprintTemplate)
      this.$refs.preView.show(hiprintTemplate, printData);
    },
    onlyPrint() {
      let hiprintTemplate = this.$print(
        undefined,
        panel,
        printData,
        {},
        {
          styleHandler: () => {
            let css =
              '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
            return css;
          },
        }
      );
      console.log(hiprintTemplate);
    },
    onlyPrint2() {
      let that = this;
      if (window.hiwebSocket.opened) {
        let hiprintTemplate = this.$print2(undefined, panel, printData, {
          printer: "",
          title: "Api单独打印",
          styleHandler: () => {
            // let css = '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
            let css =
              "<style>.hiprint-printElement-text{color:red !important;}</style>";
            return css;
          },
        });
        let key = "Api单独直接打印";
        hiprintTemplate.on("printSuccess", function () {
          that.$notification.success({
            key: key,
            placement: "topRight",
            message: key + " 打印成功",
            description: "Api单独直接打印回调",
          });
        });
        return;
      }
      this.$error({
        title: "客户端未连接",
        content: (h) => (
          <div>
            连接【{hiwebSocket.host}】失败！
            <br />
            请确保目标服务器已
            <a
              href="https://gitee.com/CcSimple/electron-hiprint/releases"
              target="_blank"
            >
              下载
            </a>
            并
            <a href="hiprint://" target="_blank">
              运行
            </a>
            打印服务！
          </div>
        ),
      });
    },
    print() {
      if (window.hiwebSocket.opened) {
        const printerList = hiprintTemplate.getPrinterList();
        console.log(printerList);
        hiprintTemplate.print2(printData, {
          printer: "",
          title: "hiprint测试打印",
        });
        return;
      }
      this.$error({
        title: "客户端未连接",
        content: (h) => (
          <div>
            连接【{hiwebSocket.host}】失败！
            <br />
            请确保目标服务器已
            <a
              href="https://gitee.com/CcSimple/electron-hiprint/releases"
              target="_blank"
            >
              下载
            </a>
            并
            <a href="hiprint://" target="_blank">
              运行
            </a>
            打印服务！
          </div>
        ),
      });
    },
    clearPaper() {
      try {
        hiprintTemplate.clear();
      } catch (error) {
        this.$message.error(`操作失败: ${error}`);
      }
    },
    exportPdf(type) {
      hiprintTemplate
        .toPdf(printData, "测试导出pdf", { isDownload: false, type: type })
        .then((res) => {
          console.log("type:", type);
          console.log(res);
        });
    },
    ippPrintAttr() {
      // 不知道打印机 ipp 情况， 可通过 '客户端' 获取一下
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p);
      // 系统不同， 参数可能不同
      let url = p.options["printer-uri-supported"];
      // 测试 获取 ipp打印 支持参数
      hiprint.ippPrint(
        {
          url: url,
          // 打印机参数： {version,uri,charset,language}
          opt: {},
          action: "Get-Printer-Attributes", // 获取打印机支持参数
          // ipp参数
          message: null,
        },
        (res) => {
          // 执行的ipp 任务回调 / 错误回调
          console.log(res);
        },
        (printer) => {
          // ipp连接成功 回调 打印机信息
          console.log(printer);
        }
      );
    },
    ippPrintTest() {
      // 不知道打印机 ipp 情况， 可通过 '客户端' 获取一下
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p);
      // 系统不同， 参数可能不同
      let url = p.options["printer-uri-supported"];
      // 测试 打印文本
      hiprint.ippPrint(
        {
          url: url,
          // 打印机参数： {version,uri,charset,language}
          opt: {},
          action: "Print-Job",
          // ipp参数
          message: {
            "operation-attributes-tag": {
              "requesting-user-name": "hiPrint", // 用户名
              "job-name": "ipp Test Job", // 任务名
              "document-format": "text/plain", // 文档类型
            },
            // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
            // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
            // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
            // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
            // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
            // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
            // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
            data: "test test test test test test test",
            encoding: "utf-8", // 默认可不传
          },
        },
        (res) => {
          // 执行的ipp 任务回调 / 错误回调
          console.log(res);
        },
        (printer) => {
          // ipp连接成功 回调 打印机信息
          console.log(printer);
        }
      );
    },
    // 自定义 ipp 请求
    ippRequestTest() {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p);
      // 系统不同， 参数可能不同
      let url = p.options["printer-uri-supported"];
      // 详见： https://www.npmjs.com/package/ipp
      hiprint.ippRequest(
        {
          url: url,
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          data: {
            operation: "Get-Printer-Attributes",
            "operation-attributes-tag": {
              // 测试发现 Request下列3个必须要有
              "attributes-charset": "utf-8",
              "attributes-natural-language": "zh-cn",
              "printer-uri": url,
            },
          },
        },
        (res) => {
          // 执行的ipp 任务回调 / 错误回调
          console.log(res);
        }
      );
    },
    ippRequestPrint() {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p);
      // 系统不同， 参数可能不同
      let url = p.options["printer-uri-supported"];
      let str = "ippRequestPrint ippRequestPrint ippRequestPrint";
      let array = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
      }
      let testData = array.buffer;
      // 详见： https://www.npmjs.com/package/ipp
      hiprint.ippRequest(
        {
          url: url,
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
          data: {
            operation: "Print-Job",
            "operation-attributes-tag": {
              // 测试发现 Request下列3个必须要有
              "attributes-charset": "utf-8",
              "attributes-natural-language": "zh-cn",
              "printer-uri": url,
              "requesting-user-name": "hiPrint", // 用户名
              "job-name": "ipp Request Job", // 任务名
              "document-format": "text/plain", // 文档类型
            },
            data: testData,
          },
        },
        (res) => {
          // 执行的ipp 任务回调 / 错误回调
          console.log(res);
        }
      );
    },
    updateJson() {
      if (hiprintTemplate) {
        try {
          hiprintTemplate.update(JSON.parse(this.jsonIn));
        } catch (e) {
          this.$message.error(`更新失败: ${e}`);
          console.log(e)
        }
      }
    },
    exportJson() {
      if (hiprintTemplate) {
        this.jsonOut = JSON.stringify(hiprintTemplate.getJson() || {});
      }
    },
    setElsAlign(e) {
      hiprintTemplate.setElsAlign(e);
    },
    setElsSpace(h) {
      hiprintTemplate.setElsSpace(10, h);
    },
    getSelectEls() {
      let els = hiprintTemplate.getSelectEls();
      console.log(els);
    },
    updateFontSize() {
      hiprintTemplate.updateOption("fontSize", 12);
    },
    updateFontWeight() {
      hiprintTemplate.updateOption("fontWeight", "bolder");
    },
  },
};
</script>
  
  <style lang="scss" scoped>
// 拖拽
.drag_item_box {
  height: 100%;
  padding: 6px;
}

.drag_item_box > div {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag_item_box > div > a {
  text-align: center;
  text-decoration-line: none;
}

.drag_item_box > div > a > span {
  font-size: 28px;
}

.drag_item_box > div > a > p {
  margin: 0;
}

.drag_item_title {
  font-size: 16px;
  padding: 12px 6px 0 6px;
  font-weight: bold;
}

// 默认图片
::v-deep .hiprint-printElement-image-content {
  img {
    content: url("~@/assets/images/qt.png");
  }
}

// 辅助线样式
::v-deep .toplineOfPosition {
  border: 0;
  border-top: 1px dashed purple;
}

::v-deep .bottomlineOfPosition {
  border: 0;
  border-top: 1px dashed purple;
}

::v-deep .leftlineOfPosition {
  border: 0;
  border-left: 1px dashed purple;
}

::v-deep .rightlineOfPosition {
  border: 0;
  border-left: 1px dashed purple;
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}

.print-template-detail {
  height: 100%;
  display: flex;

  &__body {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
  }
}

.system-view-nav {
  // height: 50vh;
  width: 300px;
  position: relative;
  background: #fff;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
  .left-scrollbar {
    height: 100%;
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .QT-common-title {
    padding: 0 10px;
    margin-bottom: 10px;
    height: 39px;
    h2 {
      font-size: 14px;
      line-height: 39px;
    }
  }
}

.system-view-content {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  border-radius: 4px;
  ::v-deep .tox-tinymce {
    border: none;
  }
}
</style>