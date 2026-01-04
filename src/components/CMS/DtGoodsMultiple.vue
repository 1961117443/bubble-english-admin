<template>
	<div class="select-wrap">
		<div class="select-box">
			<el-table :data="selectData" border class="table-form">
				<el-table-column label="商品名称" min-width="220">
					<template slot-scope="scope">
						<el-image class="pic" fit="contain" :src="qt.loadFile(scope.row.imgUrl)">
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<h4>{{scope.row.title}}</h4>
						<span class="date">
							<i class="el-icon-time"></i>
							{{qt.toDate(scope.row.addTime)}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="sellPrice" label="销售价" width="90"></el-table-column>
				<el-table-column prop="stockQuantity" label="库存" width="90"></el-table-column>
				<el-table-column fixed="right" width="80" align="center">
					<template slot="header" slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-plus" style="margin:auto;" @click="handleOpenDialog">添加</el-button>
					</template>
					<template slot-scope="scope">
						<el-link :underline="false" icon="el-icon-delete" @click="removeRow(scope.$index)"></el-link>
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<el-dialog title="选择商品" :visible.sync="showDialog" fullscreen append-to-body>
			<div class="search-box" style="margin-bottom:20px">
				<el-input placeholder="输入关健字" v-model="keyword" clearable>
					<el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
				</el-input>
			</div>
			<div class="content-box" style="padding:0">
				<el-card class="table-card">
					<el-table ref="multipleTable" v-loading="loading" :data="listData" stripe class="table-list" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="45"></el-table-column>
						<el-table-column label="商品名称" min-width="220">
							<template slot-scope="scope">
								<el-image class="pic" fit="contain" :src="qt.loadFile(scope.row.imgUrl)">
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<h4>{{scope.row.title}}</h4>
								<span class="date">
									<i class="el-icon-time"></i>
									{{qt.toDate(scope.row.addTime)}}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="categoryTitle" label="所属类别" min-width="160">
							<template slot-scope="scope">
								<div class="nowrap">
									<el-tag size="small" v-for="(item,index) in scope.row.categoryTitle.split(',')"
											:key="item.index">
										{{ item }}
									</el-tag>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sellPrice" label="销售价" width="90"></el-table-column>
						<el-table-column prop="stockQuantity" label="库存" width="90"></el-table-column>
						<el-table-column label="状态" width="90" align="center">
							<template slot-scope="scope">
								<el-tag size="small" type="success" effect="dark" v-if="scope.row.status==0">上架</el-tag>
								<el-tag size="small" type="warning" effect="dark" v-else-if="scope.row.status==1">下架</el-tag>
								<el-tag size="small" type="warning" effect="dark" v-else-if="scope.row.status==2">待审</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<div class="pager-box">
					<el-pagination background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="pageIndex"
						:page-sizes="[10, 20, 50, 100]"
						:page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="totalCount">
					</el-pagination>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" icon="el-icon-edit" @click="handleConfirm">确 定</el-button>
				<el-button type="warning" @click="showDialog=false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
			value: {
				type: Array,
				default: function () {
					return [];
				}
			},
		},
		data() {
			return {
				showDialog: false,
				loading: false,
				keyword: '',
				totalCount: 0,
				pageIndex: 1,
				pageSize: 10,
				listData: [],
				selectData: [],
				multipleSelection: []
			}
		},
		methods: {
			//加载商品列表
			initData() {
				let _this = this;
				let sendUrl = "/api/cms/admin/shop/goods?isLock=0&status=0";
				sendUrl += "&pageSize=" + _this.pageSize;
				sendUrl += "&pageIndex=" + _this.pageIndex;
				if (_this.keyword.length > 0) {
					sendUrl += "&keyword=" + encodeURI(_this.keyword);
				}
				_this.loading = true
				_this.$request({
					url: sendUrl
				}).then(res=>{
					_this.listData = res.data.list || [];
					let pageInfo = res.data.pagination
					// let pageInfo = JSON.parse(res.headers["x-pagination"]);
					_this.totalCount = pageInfo.total;
					_this.pageSize = pageInfo.pageSize;
					_this.pageIndex = pageInfo.pageIndex;
					//选中已选项
					_this.$nextTick(() => {
						if (_this.selectData.length > 0) {
							_this.listData.map(item => {
								let hasKey = false;
								_this.selectData.map(row => {
									if (row.id === item.id) {
										hasKey = true;
									}
								})
								if (hasKey) {
									_this.$refs.multipleTable.toggleRowSelection(item, true);
								}
							});
						}
					});
				})
				.catch( _=> _this.listData = [])
				.finally(_=>_this.loading = false);
			},
			//显示弹窗加载商品列表
			handleOpenDialog() {
				this.showDialog = true;
				this.initData();
			},
			//选中商品回调
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//每页显示数量
			handleSizeChange(val) {
				if (this.pageSize != val) {
					this.pageSize = val;
					this.initData();
				}
			},
			//跳转到第几页
			handleCurrentChange(val) {
				if (this.pageIndex != val) {
					this.pageIndex = val;
					this.initData();
				}
			},
			//确认选择商品
			handleConfirm() {
				let _this = this; //当前页面
				//拿到选中的数据
				let list = _this.multipleSelection;
				//检查是否有选中
				if (!list.length) {
					_this.$message({ type: 'warning', message: '请选择要关联的商品！' });
					return false;
				}
				_this.selectData = list;
				_this.$emit('input', _this.selectData);
				_this.showDialog = false;
			},
			//删除已选择的商品
			removeRow(index) {
				this.selectData.splice(index, 1);
			},
		},
		watch: {
			value: {
				immediate: true,
				handler(newVal) {
					let _this = this;
					if (newVal.length) {
						_this.selectData = newVal;
					}
				}
			},
		}
	}
</script>