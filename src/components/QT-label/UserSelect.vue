<template>
    <div>
        <el-input v-model="innerValue" class="input-with-select" v-bind="$attrs" @change="$emit('input', innerValue)"
            readonly>
            <el-button slot="append" icon="el-icon-more" @click="open"></el-button>
        </el-input>
        <!-- <div class="input-with-select"> <el-tag :key="index" v-for="(tag, index) in innerList" :closable="false" :disable-transitions="false"
                size="large" plain type="info">
                {{ tag }}
            </el-tag>

            <el-button class="button-new-tag" size="small" @click="open">选择标签</el-button>
        </div> -->
        <el-dialog class="QT-dialog QT-dialog_center transfer-dialog" lock-scroll title="选择标签" :visible.sync="dialogs"
            v-if="dialogs" append-to-body :close-on-click-modal="false">
            <div v-loading="loading">
                <el-tabs v-model="activeIndex">
                    <el-tab-pane v-for="(item, index) in list" :label="item.label" :key="index">
                        <!-- <template v-if="item.list.length > 2">
                            <el-input v-model="filterValue" placeholder="筛选标签" clearable></el-input>
                            <el-divider></el-divider>
                        </template> -->
                        <!-- <el-empty v-if="filterList.length == 0"></el-empty> -->
                        <el-tag :key="tag" v-for="tag in filterList" :closable="item.editable" :disable-transitions="false"
                            @close="handleClose(tag)" size="large" :plain="!checkSelect(tag)"
                            :type="checkSelect(tag) ? 'success' : 'info'" @click="!item.editable && handleClick(tag)"
                            :effect="checkSelect(tag) ? 'dark' : 'light'">
                            {{ tag }}
                        </el-tag>
                        <template v-if="!item.isGlobal && editable">
                            <template v-if="item.editable">
                                <el-button-group class="button-new-tag" size="small">
                                    <el-button size="small" @click="saveCurrent(item)" type="primary"><i class="el-icon-check el-icon--left"></i>保存</el-button>
                                    <el-button type="danger" @click="loadData()"><i class="el-icon-close el-icon--left"></i>取消</el-button>
                                </el-button-group>
                            </template>
                            <template v-else>
                                <el-input v-if="inputVisible" class="input-new-tag" v-model="inputValue" ref="saveTagInput"
                                    size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                </el-input>
                                <el-button-group v-else-if="list.length < limit" class="button-new-tag" size="small">
                                    <el-button size="small" @click="showInput" type="primary"><i class="el-icon-plus el-icon--left"></i>创建</el-button>
                                    <el-button type="danger" @click="item.editable=!item.editable"><i class="el-icon-setting el-icon--left"></i>管理</el-button>
                                </el-button-group>
                                <!-- <el-button v-else-if="list.length < limit" class="button-new-tag" size="small"
                                    @click="showInput">+
                                    创建新标签</el-button> -->
                            </template>
                        </template>
                      
                    </el-tab-pane>
                    <el-tab-pane disabled name="99">
                        <span slot="label">
                            <span class="options">
                            <el-dropdown style="margin-right: 20px">
                                <el-button plain size="mini" type="primary">
                                {{$t('authorize.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item @click.native="authDataRefresh()"
                                    >刷新</el-dropdown-item
                                > -->
                                <el-dropdown-item
                                    @click.native="handleCheck(true)"
                                >
                                    {{ $t("authorize.checkAll") }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                    @click.native="handleCheck(false)"
                                >
                                    {{ $t("authorize.deselectAll") }}</el-dropdown-item
                                >
                                <!-- <el-dropdown-item
                                    @click.native="setAllExpand('open', 'auth')"
                                    >{{ $t("authorize.expandAll") }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                    @click.native="setAllExpand('close', 'auth')"
                                    >{{ $t("authorize.foldAll") }}
                                </el-dropdown-item> -->
                                </el-dropdown-menu>
                            </el-dropdown>
                            </span>
                        </span>
                        </el-tab-pane>
                </el-tabs>
                <!-- <el-divider>已选</el-divider>
                <div class="input-with-select"> <el-tag :key="index" v-for="(tag, index) in innerList" :closable="false" :disable-transitions="false"
                        size="large" plain type="info">
                        {{ tag }}
                    </el-tag>
                </div> -->

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogs = false">取消</el-button>
                <el-button @click="subMit" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        u: {
            type: String,
        },
        category: {
            type: String,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String],
            default: "",
        },
    },
    data() {
        return {
            list: [],
            innerValue: "",
            closable: false,
            inputValue: "",
            inputVisible: false,
            loading: false,
            limit: 100,
            dialogs: false,
            innerList: [],
            filterValue: '',
            activeIndex: 0,
        };
    },

    watch: {
        // value(val) {
        //     console.log(val)
        //     this.setDefault();
        // },
        value:{
            handler(val){
                // console.log(val)
                this.setDefault(); 
            },
            deep:true,
            immediate:true
        }
    },
    mounted() {
    },
    computed: {
        menuId() {
            return this.$route.meta.modelId || "";
        },
        ...mapGetters(['userInfo']),
        filterList() {
            const list = this.currentList; // this.activeIndex && this.list.length > this.activeIndex ? this.list[this.activeIndex].list : []
            return this.filterValue ? list.filter(item => item.indexOf(this.filterValue) > -1) : list

        },
        currentList(){
            return this.activeIndex && this.list.length > this.activeIndex ? this.list[this.activeIndex].list : []
        }
    },
    methods: {
        async loadData() {
            // this.loading = true
            // await this.$request({
            //     url: `/api/extend/label/${this.category}/user/${this.userInfo.userId}`,
            // }).then((res) => {
            //     this.list = res.data
            //     this.loading = false
            // });

            this.loading = true
            await this.$request({
                url: `/api/extend/label/${this.category}/current`,
            }).then((res) => {
                this.list = res.data
                // console.log(res.data)
                this.loading = false
            });


        },
        async updateData() {
            this.loading = true
            await this.$request({
                url: `/api/extend/label/${this.category}/user/${this.userInfo.userId}`,
                method: 'post',
                data: this.currentList
            }).then((res) => {
                this.loading = false
            });
        },
        handleClose(tag) {
            this.currentList.splice(this.currentList.indexOf(tag), 1);
            // this.updateData()
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                
                if (this.currentList.indexOf(inputValue) > -1) {
                    this.$message.warning('标签已存在！')
                    return
                }
                this.currentList.push(inputValue);
                this.updateData()
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        setDefault() {
            this.innerValue = this.value;
            this.innerList.splice(0)
            if (this.value) {
                this.innerList = this.value.split(',')
            }

        },
        async open() {
            this.dialogs = true;
            this.filterValue = ''
            await this.loadData();
            this.innerList.splice(0)
            if (this.innerValue) {
                this.innerList = this.innerValue.split(',')
            }
        },
        subMit() {
            this.innerValue = this.innerList.join(',')
            this.$emit("input", this.innerValue);
            this.$emit("change", this.innerValue, this.circleCenter);
            this.dialogs = false;
        },
        handleClick(tag) {

            const index = this.innerList.indexOf(tag)

            if (index > -1) {
                this.innerList.splice(index, 1)
            } else {
                this.innerList.push(tag)
            }
        },
        checkSelect(tag) {

            return this.innerList.indexOf(tag) > -1
        },
        async saveCurrent(tab){
            // 判断选中的标签中是否删除了
            if(this.innerList.length > 0){
                for (var index = this.innerList.length-1; index >-1; index--) {
                    var tag = this.innerList[index];
                    let exist  = false
                    for (var j = 0; j < this.list.length; j++) {
                        var ele = this.list[j];
                        if(ele.list.some(x=>x == tag)){
                            exist  = true
                            break;
                        }
                    }
                    if(exist){
                        // console.log('tag  exists',tag)
                        continue;
                    }else{
                        this.innerList.splice(index,1)
                    }
                }
            }
           await this.updateData()
           tab.editable = false
        },
        handleCheck(all){
            console.log(this.innerList,this.currentList)

            this.currentList.forEach(tag=>{
                const index = this.innerList.indexOf(tag)

                if (all) {
                    if (index == -1) {
                        this.innerList.push(tag)
                    }
                }else{
                    if (index > -1) {
                        this.innerList.splice(index, 1)
                    }
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.transfer-dialog {
    padding: 20px;

    >>>.el-dialog__body {

        min-height: 50vh;
    }

    .el-tag+.el-tag {
        margin-left: 10px;
    }

    .el-tag {
        margin: 10px;
        cursor: pointer;
    }

    .button-new-tag {
        margin: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 100px;
        margin: 10px;
        // vertical-align: bottom;
    }
}

.input-with-select {
    .el-tag+.el-tag {
        margin-left: 10px;
    }

    .el-tag+.button-new-tag {
        margin: 10px;

    }

    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

}
</style>