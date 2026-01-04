<template>
    <el-dialog :visible.sync="visible" fullscreen lock-scroll class="QT-full-dialog" :show-close="false" :modal="false">
        <div class="QT-full-dialog-header">
            <div class="header-title">
                <!-- <img src="@/assets/images/qt.png" class="header-logo" /> -->
                <p class="header-txt">应用中心</p>
            </div>
            <div>
                <el-input
                    placeholder="请输入关键词"
                    v-model="listQuery.keyword" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="initData()"></el-button>
                </el-input>
            </div>
            <div class="options">
                <el-button @click="closeDialog()">{{ $t('common.cancelButton') }}</el-button>
            </div>
        </div>
        <div class="main QT-common-layout" v-loading="loading">
            <div class="QT-common-layout-left">
                <div class="QT-common-title">
                    <h5>功能分类</h5>
                    <span class="options">
                        <el-dropdown>
                            <el-link icon="icon-qt icon-qt-mpMenu" :underline="false" />
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="loadCategoryList()">刷新数据</el-dropdown-item>
                                <!-- <el-dropdown-item @click.native="toggleExpand(true)"
                            >展开全部</el-dropdown-item
                        >
                        <el-dropdown-item @click.native="toggleExpand(false)"
                            >折叠全部</el-dropdown-item
                        > -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </div>
                <el-scrollbar class="QT-common-el-tree-scrollbar" v-loading="treeLoading">
                    <el-tree ref="treeBox" :data="categoryList" :props="{ children: 'children', label: 'fullName' }"
                        :default-expand-all="true" highlight-current :expand-on-click-node="true" node-key="id"
                        @node-click="handleNodeClick" class="QT-common-el-tree" :accordion="true">
                        <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">
                            <!-- <i :class="data.icon" /> -->
                            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
                        </span>
                    </el-tree>
                </el-scrollbar>
            </div>
            <div class="QT-common-layout-center">
                <el-empty v-if="!tableData.length" description="暂无数据"></el-empty>
                <div v-else class="QT-common-layout-main QT-flex-main">
                    <el-row :gutter="0" class="tableContainer">
                        <el-col :span="4" v-for="(item, index) in tableData" :key="index">
                            <el-card class="box-card" :body-style="{height: '150px'}" style="margin: 10px;" shadow="hover">
                                <div slot="header" class="clearfix">
                                    <span>{{ item.fullName }}</span>
                                    <el-button style="float: right; padding: 3px 0" type="text" @click="importApp(item)">导入</el-button>
                                </div>
                                <div class="text item">
                                   功能说明：{{ item.description }}
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>

                    <pagination
                    :total="total"
                    :page.sync="listQuery.currentPage"
                    :limit.sync="listQuery.pageSize"
                    @pagination="initData"
                    />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            loading: false,
            categoryList: [],
            treeLoading: false,            
            total: 0,
            listQuery: {
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "creatorTime",
                category: '',
                keyword:''
            },
            tableData:[]
        }
    },
    methods: {
        init() {
            this.visible = true

            this.$nextTick(async()=>{
               await this.loadCategoryList()
               this.$refs.treeBox.setCurrentKey('')
               this.initData() 
               
            })
        },
        initData(){
            this.loading = true
            this.$request({
                baseURL:'/tenant-api',
                url:'/api/visualdev/base',
                method:'get',
                data:this.listQuery
            }).then(res=>{
                this.tableData = res.data.list
                this.total = res.data.pagination.total
                this.loading = false
            }).catch(_=>{
                this.loading = false
            })
        },
        closeDialog(isRefresh) {
            this.visible = false
            this.$emit('close', isRefresh)
        },
        async loadCategoryList() {
            this.treeLoading = true
            this.categoryList = [{id:'',fullName:'全部分类'}]
            await this.$request({
                baseURL:'/tenant-api',
                url:'/api/system/AppCategory/list',
                method:'get',
                data:{}
            }).then(res=>{
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        this.categoryList.push(item)
                    })
                }
                this.treeLoading = false
            }).catch(_=>{
                this.treeLoading = false
            })
        },
        handleNodeClick(data) {
            if (this.listQuery.category === data.id) return
            this.listQuery.category = data.id
            // this.type = data.type
            this.reset()
        },
        reset() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.keyword = ''
            this.initData()
        },
        importApp(data){
            this.loading = true
            this.$request({
                baseURL:'/tenant-api',
                url:'/api/visualdev/base/'+data.id,
                method:'get'
            }).then(res=>{
                
                this.$request({
                    url:'/api/visualdev/OnlineDev/Model/Actions/CloudImportData',
                    method:'post',
                    data:res.data
                }).then(ss =>{
                    this.loading = false
                    this.closeDialog(true)
                }).catch(_=>{
                    this.loading = false
                })
            }).catch(_=>{
                this.loading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.tableContainer{
    overflow-y: auto;
}
</style>