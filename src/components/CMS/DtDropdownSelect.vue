<template>
	<div class="dropdown">
		<el-dropdown ref="drop" :trigger="trigger" placement="bottom-start">
			<el-button class="select" plain>
				<span>{{title}}</span>
				<i class="el-icon-arrow-down el-icon--right"></i>
			</el-button>
			<el-dropdown-menu slot="dropdown" class="dropdown-menu" >
				<el-tree ref="tree" :data="data" node-key="id" default-expand-all :current-node-key="value" :highlight-current="true"
					:expand-on-click-node="false" @node-click="handleClick">
					<span slot-scope="{ node, data }">{{ data.title }}</span>
				</el-tree>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
	/*
	 * 单选下拉树
	 * data 树形数据
	 * value 绑定选中节点
	 * placeholder 没有选中节点时提示
	 * disabled 不能选中的节点
	 * trigger 触发下拉的行为hover或click
	 */
	export default {
		props: {
			trigger: {
				type: String,
				default: function () {
					return 'click';
				}
			},
			placeholder: {
				type: String,
				default: function () {
					return '请选择..';
				}
			},
			value: {
				type: Number,
				default: function () {
					return 0;
				}
			},
			disabled: {
				type: [Number,String],
				default: function () {
					return 0;
				}
			},
			data: {
				type: Array,
				default: function () {
					return [];
				}
			}
		},
		data() {
			return {
				title: this.placeholder
			}
		},
		methods: {
			//选中回调
			handleClick(data, node, tList) {
				let _this = this; //当前页面
				if (_this.disabled == data.id) {
					_this.$message.error('不能将自己设为父级');
					_this.$refs.tree.setCurrentKey(_this.value);
					return false;
				}
				_this.title = data.title;
				_this.$emit('input', data.id);
				//触发组件的点击事件关闭下拉框
				_this.$refs.drop.hide();
			},
			//迭代遍历树
			initData(obj) {
				let _this = this;
				obj.map(function (item) {
					if (item.id == _this.value) {
						_this.title = item.title;
						_this.$refs.tree.setCurrentKey(item.id);
						return false;
					}else if (item.children) {
						_this.initData(item.children);
					}
				});
			}
		},
		watch: {
			data(newVal) {
				let _this = this;
				if (this.value > 0 && newVal.length > 0) {
					_this.$nextTick(() => {
						_this.initData(newVal);
					});
				}
			},
			value(newVal, oldVal) {
				let _this = this;
				if (oldVal == 0 && newVal > 0 && _this.data.length > 0) {
					_this.$nextTick(() => {
						_this.initData(_this.data);
					});
				}
			}
		}
	}
</script>

<style lang="scss">
</style>