<template>
	<div class="select-wrap">
		<div class="select-box">
			<el-table :data="selectData" border class="table-form">
				<el-table-column label="商品名称" min-width="220">
					<template slot-scope="scope">
						<el-image class="pic" fit="contain" :src="qt.loadFile(scope.row.shopGoods.imgUrl)">
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<h4>{{scope.row.shopGoods.title}}</h4>
						<span class="date">
							<i class="el-icon-time"></i>
							{{qt.toDate(scope.row.shopGoods.addTime)}}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="规格" min-width="120">
					<template slot-scope="scope">
						<span class="nowrap">{{scope.row.specText}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="shopGoods.sellPrice" label="原售价" width="90"></el-table-column>
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
					<el-table ref="singleTable" v-loading="loading" :data="listData"
						stripe highlight-current-row @current-change="handleSelectChange" class="table-list">
						<el-table-column label="商品名称" min-width="220">
							<template slot-scope="scope">
								<el-image class="pic" fit="contain" :src="qt.loadFile(scope.row.shopGoods.imgUrl)">
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<h4>{{scope.row.shopGoods.title}}</h4>
								<span class="date">
									<i class="el-icon-time"></i>
									{{qt.toDate(scope.row.shopGoods.addTime)}}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="规格" min-width="150">
							<template slot-scope="scope">
								<span class="nowrap">{{scope.row.specText}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="sellPrice" label="销售价" width="90"></el-table-column>
						<el-table-column prop="stockQuantity" label="库存" width="90"></el-table-column>
						<el-table-column label="状态" width="80" align="center">
							<template slot-scope="scope">
								<el-tag size="small" type="success" effect="dark" v-if="scope.row.shopGoods.status==0">上架</el-tag>
								<el-tag size="small" type="warning" effect="dark" v-else-if="scope.row.shopGoods.status==1">下架</el-tag>
								<el-tag size="small" type="warning" effect="dark" v-else-if="scope.row.shopGoods.status==2">待审</el-tag>
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
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
			value: {
				type: Number,
				default: function () {
					return 0;
				}
			},
			data: {
				type: Object,
				default: function () {
					return null;
				}
			},
		},
		data() {
			return {
				showDialog: false,
				loading: false,
				keyword: '',
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				selectData: [],
				listData: [],
				
			}
		},
		methods: {
			//加载列表
			initData() {
				let _this = this;
				let sendUrl = "/api/cms/admin/shop/goods/product";
				sendUrl += "?isLock=0&status=0&pageSize=" + _this.pageSize;
				sendUrl += "&pageIndex=" + _this.pageIndex;
				if (_this.keyword.length > 0) {
					sendUrl += "&keyword=" + encodeURI(_this.keyword);
				}
				_this.loading = true
				_this.$request({
					url: sendUrl
				}).then(res=>{
					_this.listData = res.data.list || [];
					let pageInfo =  res.data.pagination; // JSON.parse(res.headers["x-pagination"]);
					_this.totalCount = pageInfo.total;
					_this.pageSize = pageInfo.pageSize;
					_this.pageIndex = pageInfo.pageIndex;
				})
				.catch( _=> _this.listData = [])
				.finally(_=>_this.loading = false);
			},
			//显示弹窗加载列表
			handleOpenDialog() {
				this.showDialog = true;
				this.initData();
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
			//选中表格行
			handleSelectChange(val) {
				if (val) {
					this.selectData = [val];
					this.showDialog = false;
					this.$emit('input', val.id);
				}
			},
			//删除已选择
			removeRow(index) {
				this.selectData = [];
				this.$emit('input', 0);
			},
		},
		watch: {
			data: {
				immediate: true,
				handler(newVal) {
					let _this = this;
					if (newVal) {
						_this.selectData = [newVal];
					}else{
						_this.selectData = [];
					}
				}
			}
		},
	}
</script>