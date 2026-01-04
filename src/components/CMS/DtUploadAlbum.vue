<template>
	<div class="album-box">
		<el-upload class="list-bin" list-type="picture-card" multiple :action="action"
			accept="image/*"
			:http-request="handleUpload"
			:before-upload="handleBefore"
			:on-error="handleError"
			:on-exceed="handleExceed" 
			:limit="limit"
			:file-list="listData"
			:show-file-list="false" 
			:auto-upload="true">
			<i slot="default" class="el-icon-plus"></i>
		</el-upload>
		<div class="list-box" v-for="(file,index) in listData" :key="index">
			<div class="img-box">
				<img :src="file.url" />
			</div>
			<span class="text-box" v-if="file.remark">{{file.remark}}</span>
			<div class="tools-box">
				<span class="icon" @click="handleRemove(file,index)">
					<i class="el-icon-delete"></i>
				</span>
				<span class="icon" @click="handlePreview(file,index)">
					<i class="el-icon-zoom-in"></i>
				</span>
				<span class="icon" @click="handleRemark(file,index)">
					<i class="el-icon-edit"></i>
				</span>
			</div>
			<el-progress v-if="file.progressFlag" type="circle" :width="96" :height="96" :percentage="file.progressPercent"></el-progress>
		</div>
		<el-dialog :modal="false" title="图片预览" :visible.sync="showImgDialog">
			<img width="100%" :src="showImgUrl" />
		</el-dialog>
	</div>
</template>

<script>
	/*
	 * 相册组件
	 * value 绑定的数组
	 * action 上传地址
	 * limit 最大允许上传个数，0不限制
	 * size 上传大小 单位KB 默认2048KB
	 * water 是否加水印 1加0不加 默认1
	 * thumb 生成缩略图 1生成0不生成 默认1
	 * exts 允许上传的类型 多个类型用逗号分开，例如 jpg,png,gif
	 */
	export default {
		props: {
			value: {
				type: Array,
				default:[]
			},
			action: {
				type: String,
				default: '/api/cms/upload',
			},
			size: {
				type: Number,
				default: 2048,
			},
			limit: {
				type: Number,
				default: 0
			},
			water: {
				type: Number,
				default: 1
			},
			thumb: {
				type: Number,
				default: 1
			},
		},
		data() {
			return {
				listData: [],
				showImgDialog: false,
				showImgUrl: null,
			}
		},
		methods: {
			//上传前检查
			handleBefore(file) {
				let _this = this;
				const isImg = /^image\/\w+$/i.test(file.type);
				if (!isImg) {
					this.$message.error('只能上传 JPG、PNG、GIF 格式');
					return false;
				}
				let fileSize = parseFloat(file.size / 1024); //字节转为KB
				if (fileSize > _this.size) {
					_this.$message.error(`图片大小不能超过${_this.size}KB`);
					return false;
				}
				file.url = URL.createObjectURL(file);
				_this.listData.push(file);
				return true;
			},
			//上传文件
			handleUpload(item) {
				let _this = this;
				const formData = new FormData();
				formData.append("file", item.file);
				_this.$request({
					method: 'post',
					headers : {
						"content-type": "multipart/form-data"
					},
					url: `${_this.action}?water=${_this.water}&thumb=${_this.thumb}`,
					data: formData,
					onUploadProgress: event=> _this.handleProcess(event, item.file),
					// progress(event) {
					// 	_this.handleProcess(event, item.file);
					// },
					// success(res) {
					// 	_this.handleSuccess(res.data, item.file);
					// },
				}).then(res=>{
					_this.handleSuccess(res.data, item.file)
				});
			},
			//上传成功
			handleSuccess(res, file) {
				let _this = this;
				let index = -1;
				_this.listData.forEach(function (item, i) {
					if (item === file) {
						index = i;
					}
				});
				file.id = 0;
				file.url = _this.qt.loadFile(res[0].thumbPath[0]);
				file.progressFlag = false;
				file.progressPercent = 0;
				file.thumbPath = res[0].thumbPath[0];
				file.originalPath = res[0].filePath;
				file.remark = null;
				if (index != -1) {
					_this.listData.splice(index, 1, file);
					_this.$emit('input', _this.listData);
				}
			},
			//上传进度
			handleProcess(event, file) {
				let _this = this;
				let index = -1;
				_this.listData.forEach(function (item,i) {
					if (item == file) {
						index = i;
					}
				});
				file.progressFlag = true;
				file.progressPercent = Math.abs((event.loaded / event.total * 100).toFixed(0));
				if (index != -1) {
					_this.listData.splice(index, 1, file);
				}
			},
			//超出限制
			handleExceed(files, fileList) {
				this.$message.error("错误：超出上传最大限制数量");
			},
			//上传失败
			handleError(err, file, fileList) {
				this.$message.error(err.message);
			},
			//删除文件
			handleRemove(file, i) {
				let _this = this; //当前页面
				_this.$confirm('确认要删除该图片吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					_this.listData.splice(i, 1);
					_this.$emit('input', _this.listData);
				}).catch((meg) => console.log(meg));
			},
			//查看图片
			handlePreview(file, i) {
				this.showImgUrl = this.qt.loadFile(file.originalPath);
				this.showImgDialog = true;
			},
			//修改备注
			handleRemark(file, i) {
				let _this = this; //当前页面
				_this.$prompt("请输入备注：", "图片描述", {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: file.remark,
					closeOnClickModal: false,
				}).then(({ value }) => {
					file.remark = value;
					_this.listData.splice(i, 1, file);
					_this.$emit('input', _this.listData);
				}).catch(() => { });
			},
		},
		watch: {
			value(newVal) {
				let _this = this;
				if (newVal.length > 0 && _this.listData.length == 0) {
					this.$nextTick(() => {
						_this.listData = newVal;
					});
				}
			},
			listData(newVal) {
				let _this = this;
				if (newVal) {
					newVal.forEach(val => {
						// console.log('listData..watch',val.status,val.url)
						if (val.url && !val.url.indexOf('http') == 0 && !val.url.indexOf('blob:http') == 0 
						&& val.status !='success' && !val.url.indexOf(this.define.comUrl) == 0) {
							val.url = _this.qt.loadFile(val.url);
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.album-box {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		margin-right: -20px;
		&.small {
			margin-right: -10px;
			.el-upload--picture-card {
				width: 106px;
				height: 106px;
			}
			.list-bin {
				margin: 0 10px 10px 0;
			}
			.list-box {
				margin: 0 10px 10px 0;
				width: 106px;
				height: 106px;
			}
		}
		.el-upload--picture-card {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 98px;
			height: 98px;
			border-radius: 4px;
		}
		.list-bin {
			margin: 0 20px 20px 0;
		}
		.list-box {
			display: block;
			position: relative;
			margin: 0 20px 20px 0;
			width: 98px;
			height: 98px;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid #DCDFE6;
			overflow: hidden;
			&:hover {
				.tools-box {
					opacity: 1;
					transition: opacity .3s;
				}
			}
			.el-progress {
				position: absolute;
				top: 0;
				left: 0;
				background-color: rgba(0, 0, 0, 0.3);
				.el-progress__text {
					color: #409EFF;
				}
			}
			.img-box {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				img {
					max-width: 100%;
					max-height: 100%;
				}
			}
			.text-box {
				display: block;
				position: absolute;
				left: 0;
				bottom: 0;
				box-sizing: border-box;
				padding: 0 10px;
				width: 100%;
				color: #606266;
				font-size: 12px;
				text-shadow: 1px 1px 1px #fff;
				height: 28px;
				line-height: 28px;
				background-color: rgba(255, 255, 255, 0.6);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.tools-box {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				width: 100%;
				height: 100%;
				color: #fff;
				font-size: 20px;
				left: 0;
				top: 0;
				opacity: 0;
				transition: opacity .3s;
				background-color: rgba(0, 0, 0, 0.5);
				.icon {
					display: block;
					margin: 5px;
					width: 20px;
					height: 20px;
					line-height: 20px;
					cursor: pointer;
				}
			}
		}
	}
</style>