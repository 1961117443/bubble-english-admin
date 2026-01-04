<template>
	<div class="attach-box">
		<el-upload class="list-btn" multiple list-type="picture" :action="action"
			:http-request="handleUpload"
			:before-upload="handleBefore"
			:on-error="handleError"
			:on-exceed="handleExceed"
			:limit="limit"
			:file-list="listData"
			:show-file-list="false"
			:auto-upload="true">
			<el-button size="medium" type="primary">{{placeholder}}</el-button>
			<div slot="tip" class="el-upload__tip" v-if="limit>0">只能上传 {{exts}} 文件，且不超过 {{size}}KB，最多可添加 {{limit}} 个文件。</div>
			<div slot="tip" class="el-upload__tip" v-else>只能上传 {{exts}} 文件，且不超过 {{size}}KB。</div>
		</el-upload>
		<div class="list-wrap">
			<div class="list-box" v-for="(file,index) in listData" :key="index">
				<div class="img-box">
					<span v-if="file.fileExt">{{file.fileExt.toUpperCase()}}</span>
					<i class="el-icon-loading" v-else></i>
				</div>
				<div class="info-box">
					<h3>{{file.fileName}}</h3>
					<dl>
						<dt>
							<span v-if="file.fileSize">大小 {{handleFileSize(file.fileSize)}}</span>
							<span>下载 {{file.downCount}}次</span>
						</dt>
						<dd>
							<span><el-checkbox class="attach-box-checkbox" v-model="file.isMember" :true-label="1" :false-label="0">会员</el-checkbox></span>
							<span @click="handleDownload(file,index)"><i class="el-icon-download"></i></span>
							<span @click="handleUpdate(file,index)"><i class="el-icon-edit"></i></span>
						</dd>
					</dl>
				</div>
				<div class="close" @click="handleRemove(file,index)"><i class="el-icon-close"></i></div>
				<el-progress v-if="file.progressFlag" :show-text="false" :percentage="file.progressPercent"></el-progress>
			</div>
		</div>
	</div>
</template>

<script>
	/* 
	 * 附件上传组件
	 * value 绑定的值
	 * placeholder 显示文本
	 * limit 最大允许上传个数
	 * size 上传大小 单位KB 默认5MB
	 * exts 允许上传的类型 多个类型用逗号分开，例如 jpg,png,gif
	 * action 上传地址
	 */
	export default {
		props: {
			value: {
				type: Array,
				default: [],
			},
			placeholder: {
				type: String,
				default: '点击上传',
			},
			limit: {
				type: Number,
				default: 0,
			},
			size: {
				type: Number,
				default: 5120,
			},
			exts: {
				type: String,
				default: 'jpg,jpeg,png,gif,bmp,pdf,zip',
			},
			action: {
				type: String,
				default: '/api/cms/upload',
			}
		},
		data() {
			return {
				listData: [],
			}
		},
		methods: {
			//上传前检查
			handleBefore(file) {
				let _this = this;
				let isUploadExt = false;
				let fileName = file.name;
				let ext = "";//扩展名
				//获取最后一个.的位置
				let extIndex = fileName.lastIndexOf(".");
				if (extIndex === -1) {
					_this.$message.error('错误：不支持的上传类型');
					return false;
				}
				ext = fileName.substring(extIndex + 1, fileName.length).toLowerCase();
				let extArr = _this.exts.toLowerCase().split(',');//允许的扩展名数组
				//判断是否包含该扩展名
				extArr.forEach(item => {
					if (item === ext) {
						isUploadExt = true;
					}
				})
				if (!isUploadExt) {
					_this.$message.error('错误：不支持的上传类型');
					return false;
				}
				let fileSize = parseFloat(file.size / 1024);//转换成KB
				if (fileSize > _this.size) {
					_this.$message.error(`错误：文件大小不能超过${_this.size}KB`);
					return false;
				}
				file.url = URL.createObjectURL(file);
				file.fileName = file.name;
				file.downCount = 0;
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
			//上传进度
			handleProcess(event, file) {
				let _this = this;
				let index = -1;
				_this.listData.forEach(function (item, i) {
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
			//超出文件限制
			handleExceed(files, fileList) {
				this.$message.error("错误：超出上传最大限制数量");
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
				file.url = _this.qt.loadFile(res[0].filePath);
				file.progressFlag = false;
				file.progressPercent = 0;
				file.fileName = res[0].fileName;
				file.filePath = res[0].filePath;
				file.fileSize = res[0].fileSize;
				file.fileExt = res[0].fileExt;
				file.downCount = 0;
				if (index != -1) {
					_this.listData.splice(index, 1, file);
					_this.$emit('input', _this.listData);
				}
			},
			//修改文件名
			handleUpdate(file, i) {
				let _this = this; //当前页面
				_this.$prompt("请输入新文件名：", "修改名称", {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: file.name,
					closeOnClickModal: false,
				}).then(({ value }) => {
					if (!value) {
						return false;
					}
					file.fileName = value;
					_this.listData.splice(i, 1, file);
					_this.$emit('input', _this.listData);
				}).catch(() => { })
			},
			//下载文件
			handleDownload(file, i) {
				// window.location.href = file.url;
				const url  = file.url  || file.filePath
				if(url){
					window.open(this.qt.loadFile(url),'_blank')
				}				
			},
			//删除文件
			handleRemove(file, i) {
				let _this = this; //当前页面
				_this.$confirm('确认要删除文件吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					_this.listData.splice(i, 1);
					_this.$emit('input', _this.listData);
				}).catch((meg) => console.log(meg));
			},
			//上传失败
			handleError(err, file, fileList) {
				this.$message.error(err.message);
			},
			//转换大小
			handleFileSize(val) {
				if (val < 1024.00)
					return val + "B";
				else if (val >= 1024.00 && val < 1048576)
					return parseInt(val / 1024.00) + "KB";
				else if (val >= 1048576 && val < 1073741824)
					return (val / 1024.00 / 1024.00).toFixed(2) + "MB";
				else if (val >= 1073741824)
					return (val / 1024.00 / 1024.00 / 1024.00).toFixed(2) + "GB";
			}
		},
		watch: {
			value(newVal) {
				let _this = this;
				if (newVal.length > 0 && _this.listData && _this.listData.length == 0) {
					this.$nextTick(() => {
						_this.listData = newVal;
					});
				}
			},
			listData: function (newVal) {
				let _this = this;
				if (newVal) {
					newVal.forEach(val => {
						if (val.url && !val.url.indexOf('http') == 0 && !val.url.indexOf('blob:http') == 0
						&& val.status !='success' && !val.url.indexOf(this.define.comUrl) == 0) {
							val.url = _this.qt.loadFile(val.url);
						}
					});
				}
			},
		},
	}
</script>

<style lang="scss">
	.attach-box {
		.list-btn {
			margin-bottom: 20px;
		}
		.list-wrap {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			margin-right: -20px;
			.list-box {
				display: block;
				position: relative;
				margin: 0 20px 20px 0;
				width: 230px;
				flex-grow: 1;
				box-sizing: border-box;
				border-radius: 4px;
				border: 1px solid #DCDFE6;
				overflow: hidden;
				.img-box {
					display: block;
					float: left;
					margin: 5px 10px 5px 5px;
					color: #fff;
					font-size: 24px;
					width: 60px;
					height: 60px;
					line-height: 60px;
					text-align: center;
					background: #67C23A;
				}
				.info-box {
					margin: 5px;
					h3 {
						margin-bottom: 10px;
						color: #606266;
						font-size: 14px;
						font-weight: 600;
						line-height: 1.5em;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
					dl {
						display: flex;
						justify-content: space-between;
						margin-bottom: 5px;
						dt {
							color: #C0C4CC;
							font-size: 12px;
							line-height: 1em;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							span {
								margin-right: 5px;
							}
						}
						dd {
							display: flex;
							justify-content: space-between;
							color: #67C23A;
							font-size: 20px;
							height: 20px;
							line-height: 20px;
							span {
								margin: 0 5px;
								cursor: pointer;
								&:hover {
									color: #409EFF;
								}
							}
						}
					}
				}
				.close {
					display: block;
					position: absolute;
					top: -20px;
					right: -20px;
					width: 40px;
					height: 40px;
					border-radius: 40px;
					color: #fff;
					font-size: 16px;
					background: #409EFF;
					cursor: pointer;
					overflow: hidden;
					&:hover {
						background: #E6A23C;
					}
					i {
						position: absolute;
						display: block;
						bottom: 4px;
						left: 3px;
					}
				}
			}
		}

		.attach-box-checkbox{
			.el-checkbox__input{
				margin: 0px !important;
			}
			.el-checkbox__label{
				padding-left: 0px;
				margin:0px !important;
			}
		}
	}
</style>