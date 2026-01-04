<template>
	<div :style="{margin: '0 auto',width:'100%'}">
        <el-row :gutter="15" class=" main">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" :disabled="setting.readonly">
				<el-col :span="8" v-if="judgeShow('billDate')">
					<el-form-item label="报销日期" prop="billDate">
						<el-date-picker v-model='dataForm.billDate' placeholder='请选择' clearable required :disabled='judgeWrite("billDate")' :style='{"width":"100%"}' type='date' format='yyyy-MM-dd' value-format='timestamp' >
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
							<el-form-item label="订单编号" prop="billNo">
								<el-input v-model='dataForm.billNo' placeholder='系统自动生成' readonly>
								</el-input>
							</el-form-item>
						</el-col>
				<el-col :span="8" v-if="judgeShow('amount')">
					<el-form-item label="金额" prop="amount">
						<span>{{ dataForm.amount }}</span>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="judgeShow('label')">
					<el-form-item label="标签" prop="label">
						<qt-lable-user-select v-model='dataForm.label' placeholder='请输入' category="qterp" clearable :disabled='judgeWrite("label")' :style='{"width":"100%"}' />
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="judgeShow('imageJson')">
					<el-form-item label="图片" prop="imageJson">
						<QT-UploadImg v-model='dataForm.imageJson' :disabled='judgeWrite("imageJson")' :fileSize='5' sizeUnit='MB' :limit='9' size="mini" >
						</QT-UploadImg>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="judgeShow('remark')">
					<el-form-item label="报销说明" prop="remark">
						<el-input v-model='dataForm.remark' placeholder='请输入' :disabled='judgeWrite("remark")' show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":3,"maxRows":3}' >
						</el-input>
					</el-form-item>
				</el-col>
                <el-col :span="24" v-if="judgeShow('ext_expense_detail') && formOperates">
                    <el-form-item label-width="0">
						<div class="QT-common-head">
							<div>
								<el-button  type="primary" size='mini' icon="el-icon-plus" @click="addHandleExtExpenseDetailEntityList()" v-if="!setting.readonly && !judgeWrite('ext_expense_detail')">新增</el-button>
							<el-button  size='mini' icon="el-icon-tickets" @click="addHandlePaybox()" v-if="!setting.readonly && !judgeWrite('ext_expense_detail')">选择记账单</el-button>
							</div>
						</div>
                        <el-table :data="dataForm.extExpenseDetailList" size='mini' :show-summary="false" :summary-method='getExtExpenseDetail' border>
                            <el-table-column type="index" width="50" label="序号" align="center" />
                            <el-table-column prop="title" label="报销内容" v-if="judgeShow('ext_expense_detail-title')">
								<template slot="header" v-if="judgeRequired('ext_expense_detail-title')">
									<span class="required-sign">*</span>报销内容
								</template>
                                <template slot-scope="scope">
									<el-input v-model="scope.row.title" :style='{"width":"100%"}' placeholder='请输入' clearable :disabled="judgeWrite('ext_expense_detail') || judgeWrite('ext_expense_detail-title')" required >
									</el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" label="金额" v-if="judgeShow('ext_expense_detail-amount')" align="center">
								<template slot="header" v-if="judgeRequired('ext_expense_detail-amount')">
									<span class="required-sign">*</span>金额
								</template>
                                <template slot-scope="scope">
									<span v-if="scope.row.inid">{{ scope.row.amount }}</span>
									<el-input-number v-else v-model="scope.row.amount" @change="calcAmount()" :style='{"width":"100%"}' placeholder='请输入' clearable :disabled="judgeWrite('ext_expense_detail') || judgeWrite('ext_expense_detail-amount')" required >
									</el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="50" v-if="!setting.readonly && !judgeWrite('ext_expense_detail')">
								<template slot-scope="scope">
									<el-button size="mini" type="text" class="QT-table-delBtn" @click="handleDelExtExpenseDetailEntityList(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<!-- <div class="table-actions" @click="addHandleExtExpenseDetailEntityList()" v-if="!setting.readonly && !judgeWrite('ext_expense_detail')">
							<el-button type="text" icon="el-icon-plus">新增</el-button>
						</div> -->
					</el-form-item>
				</el-col>
            </el-form>
        </el-row>
        <UserBox v-if="userBoxVisible" ref="userBox" @submit="submit" />
		<PayBox v-if="payBoxVisible" ref="payBox" @refreshDataList="initList" />
    </div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import PayBox from './PayBox.vue'
	export default {
		components:{PayBox},
		data(){
			return {
				visible: false,
				setting:{},
				eventType: '',
				userBoxVisible:false,
				dataForm: {
					id:'',
					flowId:'',
					billNo: undefined,
					billDate:undefined,
					amount:undefined,
					label:undefined,
					remark:undefined,
					imageJson:[],
					extExpenseDetailList:[],
				},
				rules: {
					billDate:[
						{
							required:true,
							message:'请输入报销日期',
							trigger:'"change"'
						},
					],

				},
				tableRequiredData:{},
				payBoxVisible:false
			}
		},
		computed: {
			formOperates() {
				return this.setting.formOperates
			}
		},
        watch: {},
        created() {
		},
		mounted() {},
		methods: {
			goBack() {
                this.$emit('refresh')
            },
			updateDataRule() {
				let newRules = {}
				for (let i = 0; i < this.setting.formOperates.length; i++) {
					const item = this.setting.formOperates[i]
					if (!item.id.includes('-')) {
						const newRulesItem = {
							required: item.required || false,
							message: item.name + '不能为空',
							trigger: item.trigger || 'blur'
						}
						if (!this.rules.hasOwnProperty(item.id)) {
							if (item.required) this.$set(newRules, item.id, [newRulesItem])
						} else {
							let withoutRequiredItem = true
							for (let i = 0; i < this.rules[item.id].length; i++) {
								if (this.rules[item.id][i].hasOwnProperty('required')) {
									this.rules[item.id][i].required = item.required || false
									withoutRequiredItem = false
								}
							}
							if (withoutRequiredItem && item.required) this.rules[item.id].push(newRulesItem)
						}
					} else {
						let key = item.id.split('-')[0]
						let newId = item.id.split('-')[1]
						let newItem = {
							...item,
							id: newId
						}
						if (!this.tableRequiredData.hasOwnProperty(key)) {
							this.$set(this.tableRequiredData, key, [newItem])
						} else {
							this.tableRequiredData[key].push(newItem)
						}
					}
				}
				this.rules = { ...this.rules, ...newRules }
			},
			exist() {
				let isOk = true
				for (let key in this.tableRequiredData) {
					if (this.dataForm[key] && Array.isArray(this.dataForm[key])) {
						for (let i = 0; i < this.dataForm[key].length; i++) {
							let item = this.dataForm[key][i]
							inner: for (let id in item) {
								let arr = this.tableRequiredData[key].filter(o => o.id === id) || []
								if (!arr.length) continue inner
								if (arr[0].required) {
									let msg = `${arr[0].name}不能为空`
									let boo = true
									if (arr[0].dataType === 'array') {
										boo = !this.qt.isEmptyArray(item[id])
									} else {
										boo = !this.qt.isEmpty(item[id])
									}
									if (!boo) {
										this.$message({
											message: msg,
											type: 'error',
											duration: 1000
										})
										isOk = false
										break
									}
								}
							}
						}
					}
				}
				return isOk
			},
			judgeRequired(id) {
				if (!this.formOperates || !this.formOperates.length) return false
				let arr = this.formOperates.filter(o => o.id === id) || []
				if (!arr.length) return false
				let item = arr[0]
				return item.required
			},
			init(data) {
				this.dataForm.id = data.id || 0;
                this.loading = true
				this.setting = data
				this.visible = true;
				this.updateDataRule()
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.id) {
						request({
							url: '/api/extend/ExtExpenseRecord/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
							this.dataForm = res.data;
							if(!this.dataForm.imageJson)this.dataForm.imageJson=[];
						})
					}
					this.loading = false
					this.$emit('setPageLoad')
				});
				this.$store.commit('generator/UPDATE_RELATION_DATA', {})				
			},
			dataFormSubmit(eventType) {				
				this.$refs['elForm'].validate((valid) => {
					if (valid) {
						if (this.exist && !this.exist()) return
						if (eventType === 'audit' || eventType === 'reject') {
            				this.$emit('eventReceiver', this.dataForm, eventType)
            				return
          				}
						this.dataForm.flowState = eventType === 'submit' ? 0 : 1
						this.dataForm.flowId = this.setting.flowId
						this.eventType = eventType
						if (this.eventType === 'save') this.$emit('setLoad',true)
						if (this.eventType === 'submit') {
							this.$confirm('您确定要提交当前流程吗, 是否继续?', '提示', {
								type: 'warning'
							}).then(() => {
								this.request()
							}).catch(() => { });
						} else {
							this.request()
						}
					}
				})
			},
			request() {
				if (!this.dataForm.id) {
					delete (this.dataForm.id)
					request({
						url: '/api/extend/ExtExpenseRecord',
						method: 'post',
						data: this.dataForm
					}).then((res) => {
						this.$message({
							message: res.msg,
							type: 'success',
							duration: 1000,
							onClose: () => {
								this.visible = false
								if (this.eventType === 'save') this.$emit('setLoad', false)
								this.$emit('close', true)
							}
						})
					}).catch(()=>{
						if (this.eventType === 'save') this.$emit('setLoad', false)
					})
				}else{
					request({
						url: '/api/extend/ExtExpenseRecord/' + this.dataForm.id,
						method: 'PUT',
						data: this.dataForm
					}).then((res) => {
						this.$message({
							message: res.msg,
							type: 'success',
							duration: 1000,
							onClose: () => {
								this.visible = false
								if (this.eventType === 'save') this.$emit('setLoad', false)
								this.$emit('close', true)
							}
						})
					}).catch(()=>{
						if (this.eventType === 'save') this.$emit('setLoad', false)
					})
				}
			},
			judgeShow(id) {
				if (!this.setting.formOperates || !this.setting.formOperates.length) return true
				let arr = this.setting.formOperates.filter(o => o.id === id) || []
				if (!arr.length) return true
				let item = arr[0]
				return item.read
			},
			judgeWrite(id) {
				if (!this.setting.formOperates || !this.setting.formOperates.length) return false
				let arr = this.setting.formOperates.filter(o => o.id === id) || []
				if (!arr.length) return true
				let item = arr[0]
				return !item.write
			},
			addHandleExtExpenseDetailEntityList() {
				let item = {
					title:undefined,
					amount:undefined,
				}
				this.dataForm.extExpenseDetailList.push(item)
			},
			handleDelExtExpenseDetailEntityList(index) {
				this.dataForm.extExpenseDetailList.splice(index, 1);
				this.calcAmount()
			},
			getExtExpenseDetail(param) {
				const summaryField = ["amount"]
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					if (!summaryField.includes(column.property)) {
						sums[index] = '';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
					} else {
						sums[index] = '';
					}
				});
				return sums
			},
			initList(list){
				console.log(list)

				for (let index = 0; index < list.length; index++) {
					const row = list[index];
					if (this.dataForm.extExpenseDetailList.findIndex(x => x.inid == row.id) == -1) {
						let item = {
							title:row.remark,
							amount:row.amount,
							inid:row.id
						}
						this.dataForm.extExpenseDetailList.push(item)
					}
				}
				this.calcAmount()
			},
			addHandlePaybox(){
				this.payBoxVisible = true
				this.$nextTick(()=>{
					this.$refs.payBox.init()
				})
			},
			calcAmount(){
				this.dataForm.amount = this.qt.sum(this.dataForm.extExpenseDetailList,'amount')
			}
		}
	}
</script>

