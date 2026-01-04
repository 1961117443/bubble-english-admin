<template>
	<div class="select-wrap">
		<div class="select-box">
			<el-button size="small" icon="el-icon-plus" @click="handleOpenDialog" v-if="!title">
				<span v-if="placeholder">{{ placeholder }}</span>
			</el-button>
			<el-tag effect="plain" disable-transitions closable @close="handleSelectClear" v-if="title">
				{{ title }}
			</el-tag>
		</div>

		<el-dialog title="选择会员" :visible.sync="showDialog" @close="handleDialogClose" fullscreen append-to-body>
			<div class="search-box" style="margin-bottom:20px;">
				<el-input placeholder="输入关健字" v-model="keyword" clearable @keyup.enter.native="initData">
					<el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
				</el-input>
			</div>
			<div class="content-box" style="padding:0">
				<el-card class="table-card">
					<el-table v-loading="loading" :data="listData" highlight-current-row
						@current-change="handleDialogChange" class="table-list">
						<el-table-column prop="userName" label="用户名" min-width="120"></el-table-column>
						<el-table-column prop="groupTitle" label="会员组" width="120"></el-table-column>
						<el-table-column label="状态" width="90">
							<template slot-scope="scope">
								<el-tag size="small" type="success" effect="dark"
									v-if="scope.row.status == 0">正常</el-tag>
								<el-tag size="small" type="warning" effect="dark"
									v-else-if="scope.row.status == 1">待验证</el-tag>
								<el-tag size="small" type="warning" effect="dark"
									v-else-if="scope.row.status == 2">待审核</el-tag>
								<el-tag size="small" type="info" effect="dark" v-else>黑名单</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="regTime" label="注册时间" width="160"></el-table-column>
					</el-table>
				</el-card>
				<div class="pager-box">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: {
		placeholder: {
			type: String,
			default: function () {
				return null;
			}
		},
		value: {
			type: [Number,String],
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
			title: null,
			totalCount: 0,
			pageIndex: 1,
			pageSize: 10,
			listData: [],
		}
	},
	methods: {
		initData() {
			let _this = this;
			let sendUrl = "/api/cms/admin/member";
			sendUrl += "?status=0&pageSize=" + _this.pageSize;
			sendUrl += "&pageIndex=" + _this.pageIndex;
			if (_this.keyword.length > 0) {
				sendUrl += "&keyword=" + encodeURI(_this.keyword);
			}
			_this.loading = true;
			_this.$request({
				url: sendUrl
			}).then(res => {
				_this.listData = res.data.list || [];
				// let pageInfo = JSON.parse(res.headers["x-pagination"]);
				// _this.totalCount = pageInfo.totalCount;
				// _this.pageSize = pageInfo.pageSize;
				// _this.pageIndex = pageInfo.pageIndex;

                _this.total = res.data.pagination.total;
			}).catch(e => {
				_this.listData = [];
			}).finally(() => {
				_this.loading = false
			});
		},
		//打开弹窗回调
		handleOpenDialog() {
			this.showDialog = true;
			this.initData();
		},
		//关闭弹窗回调
		handleDialogClose() {
			this.keyword = '';
		},
		//选中回调
		handleDialogChange(val) {
			if (val) {
				this.title = val.userName;
				this.showDialog = false;
				this.$emit('input', val.userId);
			}
		},
		//删除选中
		handleSelectClear() {
			this.title = null;
			this.$emit('input', null);
		},
		//设置每页显示
		handleSizeChange(val) {
			if (this.pageSize != val) {
				this.pageSize = val;
				this.initData();
			}
		},
		//跳转第几页
		handleCurrentChange(val) {
			if (this.pageIndex != val) {
				this.pageIndex = val;
				this.initData();
			}
		}
	},
	watch: {
		value(newVal) {
			let _this = this;
			if (newVal) {
				_this.$request({
					url: `/api/cms/admin/member/${_this.value}`
				}).then(res => {
					_this.title = res.data.userName;
				});
			} else {
				_this.title = null;
			}
		}
	},
}
</script>

<style lang="scss">
.select-box {
	.el-button {
		margin-right: 12px;
		padding: 9px 10px;
	}
}
</style>