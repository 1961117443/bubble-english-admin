<template>
	<div class="select-wrap">
		<div class="select-box">
			<el-table :data="selectData" border class="table-form">
				<el-table-column prop="title" label="名称" min-width="120"></el-table-column>
				<el-table-column label="适用范围" width="100">
					<template slot-scope="scope">
						<el-tag size="small" type="success" effect="dark" v-if="scope.row.useType==1">商品券</el-tag>
						<el-tag size="small" effect="dark" v-else>店铺券</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="amount" label="面额(元)" width="90"></el-table-column>
				<el-table-column prop="minAmount" label="门槛(元)" width="90"></el-table-column>
				<el-table-column prop="endTime" label="结束时间" width="160"></el-table-column>
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
		<el-dialog title="选择优惠券" :visible.sync="showDialog" fullscreen>
			<div class="search-box" style="margin-bottom:20px">
				<el-input placeholder="输入关健字" v-model="keyword" clearable>
					<el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
				</el-input>
			</div>
			<div class="content-box" style="padding:0">
				<el-card class="table-card">
					<el-table ref="singleTable" v-loading="loading" :data="listData"
							  stripe highlight-current-row @current-change="handleSelectChange" class="table-list">
						<el-table-column prop="title" label="名称" min-width="120"></el-table-column>
						<el-table-column label="适用范围" width="100">
							<template slot-scope="scope">
								<el-tag size="small" type="success" effect="dark" v-if="scope.row.useType==1">商品券</el-tag>
								<el-tag size="small" effect="dark" v-else>店铺券</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="amount" label="面额(元)" width="90"></el-table-column>
						<el-table-column prop="minAmount" label="门槛(元)" width="90"></el-table-column>
						<el-table-column prop="endTime" label="结束时间" width="160"></el-table-column>
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
				showDialog: false,//弹窗状态
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
				let sendUrl = "/admin/shop/coupon";
				sendUrl += "?status=0&pageSize=" + _this.pageSize;
				sendUrl += "&pageIndex=" + _this.pageIndex;
				if (_this.keyword.length > 0) {
					sendUrl += "&keyword=" + encodeURI(_this.keyword);
				}
				_this.$api.request({
					url: sendUrl,
					beforeSend() {
						_this.loading = true
					},
					success(res) {
						_this.listData = res.data;
						let pageInfo = JSON.parse(res.headers["x-pagination"]);
						_this.totalCount = pageInfo.totalCount;
						_this.pageSize = pageInfo.pageSize;
						_this.pageIndex = pageInfo.pageIndex;
					},
					error(err) {
						_this.listData = [];
					},
					complete() {
						_this.loading = false
					}
				});
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
		}
	}
</script>