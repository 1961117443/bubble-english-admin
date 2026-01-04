<template>
	<div class="dropdown">
		<el-dropdown :trigger="trigger" placement="bottom-start">
			<el-button class="check" size="small" icon="el-icon-plus"></el-button>
			<el-dropdown-menu slot="dropdown" class="qt-dropdown-menu">
				<el-tree ref="tree" :data="data" node-key="id" default-expand-all show-checkbox check-on-click-node 
					:check-strictly="checkStrictly" 
					:expand-on-click-node="false"
					@check="handleCheck">
					<span slot-scope="{ node, data }">{{ data.title }}</span>
				</el-tree>
			</el-dropdown-menu>
		</el-dropdown>
		<el-tag :key="item.id" v-for="item in value" effect="dark" disable-transitions closable size="medium"
			@close="handleClose(item)" style="margin-left:3px">
			{{item.title}}
		</el-tag>
	</div>
</template>

<script>
	/*
	 * 复选框下拉树
	 * data 树形数据
	 * value 绑定选中节点
	 * check-strictly 是否严格的遵循父子不互相关联的做法 
	 * checked-keys 选中值，数组
	 * trigger 触发下拉的行为hover或click
	 */
	export default {
		props: {
			trigger: {
				type: String,
				default: function () {
					return 'click';
				},
			},
			checkStrictly: {
				type: Boolean,
				default: true,
			},
			checked: {
				type: Array,
				default: function () {
					return [];
				},
			},
			value: {
				type: Array,
				default: function () {
					return [];
				},
			},
			data: {
				type: Array,
				default: function () {
					return [];
				},
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			//删除Tag的回调
			handleClose(val) {
				let _this = this; //当前页面
				//删除当前选中项
				_this.value.forEach((item, i) => {
					if (item == val) {
						_this.value.splice(i, 1);
					}
				})
				//重新设置选中值
				let nodeKeys = [];
				_this.value.forEach((item, i) => {
					nodeKeys.push(item.id);
				})
				_this.$refs.tree.setCheckedKeys(nodeKeys);
				_this.$emit('input', _this.value)
			},
			//选中发生变化回调
			handleCheck() {
				let _this = this; //当前页面
				let nodes = []; //临时节点
				_this.$refs.tree.getCheckedNodes().map(item => {
					nodes.push(item);
				});
				_this.$emit('input', nodes);
			}
		},
		watch: {
			data(newVal) {
				if (newVal.length > 0) {
					this.$nextTick(() => {
						this.$refs.tree.setCheckedKeys(this.checked);
						this.handleCheck();
					});
				}
			},
			checked(newVal) {
				if (newVal.length > 0) {
					this.$nextTick(() => {
						this.$refs.tree.setCheckedKeys(newVal);
						this.handleCheck();
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.qt-dropdown-menu {
	margin: 0;
	padding: 0;
	>>> .el-tree {
		padding: 5px 12px 5px 5px;
		min-width: 200px;
		max-height: 300px;
		border-radius: 4px;
		overflow: hidden;
		overflow-y: auto;
		>>>.el-tree-node__content {
			height: 32px;
			margin-left: 5px;
			padding-right: 10px;
			border-radius: 4px;
		}
	}
}
</style>