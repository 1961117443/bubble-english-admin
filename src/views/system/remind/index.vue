<template>
	<div class="QT-common-layout">
		<div class="QT-common-layout-center">
			<el-row class="QT-common-search-box" :gutter="16">
				<el-form @submit.native.prevent="">
					<el-col :span="6">
						<el-form-item label="名称">
							<el-input v-model="query.fullName" placeholder="名称" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<div class="QT-common-layout-main QT-flex-main">				
                <QT-table v-loading="listLoading" :data="list">
					<template #actions> 
						<div class="QT-common-head">
							<div>
								<el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
							</div>
							<div class="QT-common-head-right">
								<el-tooltip effect="dark" content="刷新" placement="top">
									<el-link icon="icon-qt icon-qt-Refresh QT-common-head-icon" :underline="false" @click="reset()" />
								</el-tooltip>
							</div>
						</div>										
					</template>
					<el-table-column prop="fullName" label="名称" align="left" />
					<el-table-column prop="description" label="描述" align="left" />
					<el-table-column prop="enabledMark" label="有效标志" align="left" />
					<el-table-column prop="sortCode" label="排序码" align="left" />
					<el-table-column label="操作" fixed="right" width="100">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.id)" class='QT-table-delBtn' >删除</el-button>
						</template>
					</el-table-column>
				</QT-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
		<QT-Form v-if="formVisible" ref="QTForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import QTForm from './Form'
	export default {
	    components: { QTForm },
	    data() {
	        return {
	            query: {
	                fullName: undefined,
				},
                list: [],
                listLoading: true,
                multipleSelection: [], 
				total: 0,
                listQuery: {
                    currentPage: 1,
                    pageSize: 20,
					sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    { prop: 'fullName', label: '名称' },
                    { prop: 'description', label: '描述' },
                    { prop: 'enabledMark', label: '有效标志' },
                    { prop: 'sortCode', label: '排序码' },
				],
				moduleIdOptions:[{'fullName':"选项一",'id':"1"},{'fullName':"选项二",'id':"2"}],
			}
        },
		computed: {
            menuId() {
                return this.$route.meta.modelId || ''
            }
        },
		created() {
			this.initData()
		},
		methods: {
			initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query,
					menuId : this.menuId,
                };
                let query = {}
                for (let key in _query) {
                    if (Array.isArray(_query[key])) {
                        query[key] = _query[key].join()
                    } else {
                        query[key] = _query[key]
                    }
                }
                request({
                    url: `/api/Emp/BaseModuleremind`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    this.list = res.data.list
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },
			handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/Emp/BaseModuleremind/${id}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {
                });
            },
			addOrUpdateHandle(id,readonly) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.QTForm.init(id,readonly)
                })
            },
			search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "",
                }
                this.initData()
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) this.reset()
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "",
                }
                this.initData()
            }
		}
    }
</script>