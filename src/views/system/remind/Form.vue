<template>
	<transition name="el-zoom-in-center">
		<div class="QT-preview-main" v-loading.body="loading">
			<div class="QT-common-page-header">
				<el-page-header @back="goBack" :content="readonly?'详情': !dataForm.id ? '新建' : '编辑'"/>
				<div class="options">
					<el-button v-if="!readonly" type="primary" @click="dataFormSubmit()" :loading="btnLoading">确 定</el-button>
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>
			<div :style="{margin: '0 auto',width:'100%'}">
				<el-row :gutter="15" class=" main">
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :rules="rules" :disabled="readonly">
					<el-col :span="12">
						<el-form-item label="名称" prop="fullName">
							<el-input v-model='dataForm.fullName' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="描述" prop="description">
							<el-input v-model='dataForm.description' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="sql语句" prop="sqlTemplate">
							<el-input v-model='dataForm.sqlTemplate' placeholder='请输入' required show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":10,"maxRows":10}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序码" prop="sortCode">
							<el-input-number v-model='dataForm.sortCode' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="有效标志" prop="enabledMark">
							<el-switch v-model='dataForm.enabledMark' :active-value='1' :inactive-value='0' >
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能主键" prop="moduleId">
							<QTTreeSelect v-model="dataForm.moduleId" :options="moduleIdOptions" :props="moduleIdProps" placeholder='请选择' ></QTTreeSelect>
						</el-form-item>
					</el-col>
				</el-form>
				</el-row>
			</div>
		</div>
	</transition>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import { getSelectorAll } from '@/api/system/menu'
	export default {
		components: {},
		props: [],
		data() {
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				readonly: false,
				dataForm: {
					id:'',
					fullName:undefined,
					description:undefined,
					sqlTemplate:undefined,
					sortCode:undefined,
					enabledMark:0,
					moduleId:undefined,
				},
				rules: {
					fullName:[
						{
							required:true,
							message:'请输入名称',
							trigger:'"blur"'
						},
					],
					sqlTemplate:[
						{
							required:true,
							message:'请输入sql语句',
							trigger:'"blur"'
						},
					],
				},
				moduleIdOptions:[],
				moduleIdProps:{"multiple":false,"label":"fullName","value":"id","children":"children"},
			}
		},
		computed: {},
        watch: {},
        async created() {
			await getSelectorAll({ category: 'Web' }).then(res => {
                // console.log(res)
                this.moduleIdOptions = res.data.list;
            })

		},
		mounted() {
        },
		methods: {
			goBack() {
                this.$emit('refresh')
            },
			init(id,readonly) {
				this.dataForm.id = id || 0;
				this.readonly = readonly || false;
                this.visible = true;
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.id) {
						this.loading = true
						request({
							url: '/api/Emp/BaseModuleremind/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
							this.dataForm = res.data;
						}).finally(_=> this.loading = false);
					}
				});
				this.$store.commit('generator/UPDATE_RELATION_DATA', {})
			},
			dataFormSubmit() {
				this.$refs['elForm'].validate((valid) => {
                    if (valid) {
						this.btnLoading = true;
						if (!this.dataForm.id) {
                            request({
                                url: `/api/Emp/BaseModuleremind`,
                                method: 'post',
                                data: this.dataForm,
                            }).then((res) => {
                                this.$message({
                                    message: res.msg,
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
										this.btnLoading = false;
                                        this.visible = false,
                                        this.$emit('refresh', true)
                                    }
                                })
                            }).finally(_=> this.btnLoading = false)
                        } else {
                            request({
                                url: '/api/Emp/BaseModuleremind/' + this.dataForm.id,
                                method: 'PUT',
                                data: this.dataForm
                            }).then((res) => {
                                this.$message({
                                    message: res.msg,
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
										this.btnLoading = false;
                                        this.visible = false
                                        this.$emit('refresh', true)
                                    }
                                })
                            }).finally(_=> this.btnLoading = false)
                        }
                    }
                })
			},
		}
	}
</script>
