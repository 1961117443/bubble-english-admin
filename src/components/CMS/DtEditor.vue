<template>
    <div class="editor-container">
		<Toolbar
			class="toolbar-box"
			:editor="editor"
			:defaultConfig="toolbarConfig"
			:mode="mode"
		/>
		<Editor
			class="editor-box"
			v-model="content"
			:defaultConfig="editorConfig"
			:mode="mode"
			@onCreated="onCreated"
			@onChange="onChange"
			@onFocus="onFocus"
			@onBlur="onBlur"
			@click="onClick"
		/>
	</div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
	components: { Editor, Toolbar },
	name: 'DtEditor',
	props: {
		mini: {
			type: Boolean,
			default: false,
		},
		value: String,
		placeholder: String,
	},
	data() {
		return {
			isload: false,
			editor: null,
			content: '',
			toolbarConfig: { },
			editorConfig: {
				placeholder: this.placeholder,
				MENU_CONF: {
					//配置上传图片
					uploadImage: {
						customUpload: this.uploadImage
					},
					//配置上传视频
					uploadVideo: {
						customUpload: this.uploadVideo
					},
				},
			},
			mode: this.mini ? 'simple' : 'default',
		}
	},
	methods: {
		//创建编辑器
		onCreated(editor) {
			this.editor = Object.seal(editor);
			//如果动态加载时有问题，所以加上下面这些代码
			if(this.value){
				this.editor.setHtml(this.content);
			}
			// console.log('创建编辑器onCreated', editor.getEditableContainer());
		},
		//编辑器响应
		onChange(editor) {
			let html = editor.getHtml();
			//替换图片成相对路径
			let newContent = this.qt.replaceEditor(html);
			//通知更新
			this.$emit('input', newContent);
		},
		//编辑器焦点
		onFocus(editor) {
			// console.log('编辑器焦点onFocus', editor);
			this.$emit('focus');
		},
		//编辑器失去焦点
		onBlur(editor) {
			// console.log('编辑器失去焦点onBlur', editor);
			this.$emit('blur');
		},
		//上传图片
		uploadImage(file, insertFn) {
			const _this = this;
			const formData = new FormData();
			formData.append('file', file);
			//开始上传
			_this.$request({
				url: '/api/cms/upload',
				method: 'post',
				data: formData,
			}).then(res=>{
				let src = _this.qt.loadFile(res.data[0].filePath);
				let name = res.data[0].fileName;
				insertFn(src, name, '');
			});
		},
		//上传视频
		uploadVideo(file, insertFn) {
			const _this = this;
			const formData = new FormData();
			formData.append('file', file);
			//开始上传
			_this.$request({
				url: '/api/cms/upload',
				method: 'post',
				data: formData,
			}).then(res=>{
				let src = _this.qt.loadFile(res.data[0].filePath);
				insertFn(src, '');
			});
		},
		onClick(V){
			// console.log('onClick',V);
		}
	},
	watch: {
		//把图片视频相对地址转换API地址
		value(newVal) {
			// console.log('value...change',newVal,this.isload)
			if(newVal && !this.isload) {
				//解决自动聚焦导致AJAX内容无法赋值
				var replaceStr = newVal.replace('<p><br></p>', '');
				if (replaceStr) {
					let newContent = this.qt.loadEditor(newVal);
					this.isload = true;
					this.content = newContent;
				}
			}
			if (!newVal) {
				let newContent = this.qt.loadEditor(newVal);
				this.content = newContent;
			}
		}
	},
	beforeDestroy() {
		const editor = this.editor;
		if (editor == null) return;
		editor.destroy(); // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
	.editor-container {
		border: 1px solid #DCDFE6;
		border-radius: 4px;
		z-index: 5;
		.toolbar-box {
			margin: 0;
			padding: 0;
			border-bottom: 1px solid #DCDFE6;
			border-radius: 4px 4px 0 0;
			overflow: inherit;
		}
		.editor-box {
			margin: 0;
			padding: 0;
			line-height: normal;
			min-height: 280px !important;
			border-radius: 4px;
			overflow: hidden;
		}
	}
</style>
<style>
::v-deep .w-e-text-container {
  height: 280px !important;
}
.w-e-text-container .w-e-scroll {
  height: 280px !important;
  -webkit-overflow-scrolling: touch;
}

.w-e-full-screen-container .w-e-text-container .w-e-scroll{
  min-height: 280px !important;
  height: 100% !important;
  -webkit-overflow-scrolling: touch;
}
</style>
