<template>
	<div class="input-upload">
		<div class="up-control">
			<el-input :placeholder="placeholder" v-model="filePath"></el-input>
			<el-upload :disabled="imgUrlUploading"
				:action="action"
				:show-file-list="false"
				:http-request="handleUpload"
				:before-upload="handleBefore"
				:on-error="handleError">
				<el-button type="primary" :loading="imgUrlUploading">{{imgUrlProgress}}</el-button>
			</el-upload>
		</div>
		<div v-if="isImg" class="img-preview">
			<el-image v-if="imgSrc" :style="'width:'+ width+';'+'height:'+height+';'"
				:src="imgSrc"
				:fit="fit"
				:preview-src-list="new Array(imgSrc)">
			</el-image>
		</div>
	</div>
</template>

<script>
	/* 
	 * 文本域上传组件
	 * value 绑定的值
	 * placeholder 显示文本
	 * width 预览图片的宽度，支持px,%单位
	 * height 预览图片的高度，支持px,%单位
	 * fit 图片显示类型 fill / contain / cover / none / scale-down
	 * size 上传大小 单位KB 默认1024KB
	 * water 是否加水印 1加水印0不加 默认0
	 * thumb 生成缩略图 1生成0不生成 默认0
	 * exts 允许上传的类型 多个类型用逗号分开，例如 jpg,png,gif
	 * action 上传地址
	 */
	export default {
		props: {
			value: String,
			placeholder: String,
			width: {
				type: String,
				default: '40%',
			},
			height: {
				type: String,
				default: '30%',
			},
			fit: {
				type: String,
				default: 'contain',
			},
			size: {
				type: Number,
				default: 1024,
			},
			water: {
				type: Number,
				default: 0,
			},
			thumb: {
				type: Number,
				default: 0,
			},
			exts: {
				type: String,
				default: 'jpg,jpeg,png,gif,bmp',
			},
			action: {
				type: String,
				default: '/upload',
			}
		},
		data() {
			return {
				filePath: null,
				imgSrc: null,
				imgUrlProgress: '浏览...',
				imgUrlUploading: false,
				isImg: false,
			}
		},
		methods: {
			//上传前检查
			handleBefore(file) {
				let _this = this;
				let isUploadExt = false;
				let fileName = file.name;
				//检查是否合法的扩展名
				if (fileName.lastIndexOf(".") === -1) {
					_this.$message.error('不支持的上传类型!');
					return false;
				}
				let ext = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
				let extArr = _this.exts.toLowerCase().split(',');//允许的扩展名数组
				let extObj = extArr.find(val => val == ext);
				if (!extObj) {
					_this.$message.error('不支持的上传类型!');
					return false;
				}
				//计算文件大小
				let fileSize = parseFloat(file.size / 1024);//转换成KB
				if (fileSize > _this.size) {
					_this.$message.error(`文件大小不能超过${_this.size}KB!`);
					return false;
				}
				//检查是否是图片，如果是图片要显示出来
				_this.isImg = _this.verifyImage(fileName);
				_this.imgUrlUploading = true;
				return true;
			},
			//上传文件
			handleUpload(item) {
				let _this = this;
				const formData = new FormData();
				formData.append("file", item.file);
				_this.$request({
					method: 'post',
					url: `${_this.action}?water=${_this.water}&thumb=${_this.thumb}`,
					data: formData,
					// progress(event) {
					// 	_this.handleProcess(event, item.file);
					// },
					// success(res) {
					// 	_this.handleSuccess(res.data, item.file);
					// }
				}).then(res=> _this.handleSuccess(res.data, item.file));
			},
			//上传成功
			handleSuccess(res, file) {
				this.imgUrlProgress = "浏览...";
				this.imgUrlUploading = false;
				this.filePath = res[0].filePath;
			    
			},
			//上传进度
			handleProcess(event, file) {
				this.imgUrlProgress = (event.loaded / event.total * 100).toFixed(0) + '%';
			},
			//上传失败
			handleError(err, file, fileList) {
				this.imgUrlUploading = false;
				this.$message.error(err.message);
			},
			//验证是否是图片
			verifyImage(src) {
				let _this = this;
				if (!src) return false;
				let imgExtArr = ['jpg', 'jpeg', 'png', 'gif'];
				let startIndex = src.lastIndexOf(".");
				if (startIndex === -1) {
					return false;
				}
				let ext = src.substring(startIndex + 1, src.length).toLowerCase();
				let extObj = imgExtArr.find(val => val == ext);
				if (extObj) return true;
				return false;
			},
			//给预览图赋值
			setImage(src) {
				let _this = this;
				//如果是图片则赋值给预览图
				_this.isImg = _this.verifyImage(src);
				if (_this.isImg) {
					_this.imgSrc = _this.qt.loadFile(src);
				}
			}
		},
		mounted() {
			if (this.value) {
				this.filePath = this.value;
				this.setImage(this.value);
			}
		},
		watch: {
			value(newVal) {
			    this.filePath = newVal;
			    this.setImage(newVal);
			},
			filePath(newVal) {
			    this.setImage(newVal);
			    this.$emit('input', newVal);
			}
		}
	}
</script>

<style lang="scss">
	.input-upload {
		.up-control {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.el-input__inner {
				border-top-right-radius: 0px;
				border-bottom-right-radius: 0px;
			}
			.el-button {
				border-top-left-radius: 0px;
				border-bottom-left-radius: 0px;
			}
		}
		.img-preview {
			margin: 10px 0px;
		}
	}
</style>