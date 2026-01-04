import request from '@/utils/request'
import { mapGetters} from 'vuex'
export default {
    inject: ['getApi','controller'],
    data() {
        return {
            // 表单标题宽度
            formLabelWidth: '120px',
            // 表单数据
            dataForm: {
                // 表单数据
                id: undefined
            },
            // 表单验证规则
            rules: {
                // 表单验证规则
            },
            // 是否只读
            readonly: false,
            // 是否显示弹窗
            visible: false,
            loading: false,
            // 确定按钮的状态
            btnLoading: false,
            span:{
                xs:{span:24},
                sm:{span:12} ,
                md:{span:12},
                lg:{span:8} ,
                xl:{span:6}
            },
            // 是否刷新主表数据
            refreshTableList:false
        }
    },
    computed:{
        menuId() {
            return this.$route.meta.modelId || "";
        },
        zhTitle(){
            return this.$route.meta.zhTitle || this.$route.meta.title || ""
        },
        formTitle(){
            let t = this.dataForm.id?'编辑':'新增'

            if(this.readonly){
                t = '查看'
            }

            return this.zhTitle + ' - ' + t
        },
        ...mapGetters(['userInfo'])
    },
    methods: {
        async init(id, readonly,...params) {
            this.dataForm.id = id || undefined;
            this.readonly = readonly || false;
            this.visible = true;
            this.loading = true;
            this.refreshTableList = false;
            await this.onInit(id, readonly,...params);
            this.$nextTick(() => {
                if (!readonly) {
                    if (this.$refs['elForm']) {
                        this.$refs['elForm'].resetFields(); 
                    }
                    
                }
                
                if (this.dataForm.id) {
                    const { detail } = this.getApi()
                    request({
                        url: `${detail}/${this.dataForm.id}`,//'/api/IOT/IotGateway/' + this.dataForm.id,
                        method: 'get'
                    }).then(res => {
                        this.dataForm = res.data;
                        // 表单赋值结束
                        this.onInitAfter(this.dataForm, 'update');
                    }).finally(_ => this.loading = false);
                } else {
                    // 表单赋值结束
                    this.onInitAfter(this.dataForm, 'insert');                    
                    this.loading = false
                }
            });
            this.$store.commit('generator/UPDATE_RELATION_DATA', {})
        },
        // 表单初始化前
        async onInit(id, readonly) {
            // this.$store.dispatch('base/getDictionaryData', { sort: '' }).then((res) => this.options = JSON.parse(JSON.stringify(res)))
        },
        // 表单初始化
        onInitAfter(data, action) {

        },
        onSubmitBefore(data, action){
            return true
        },
        dataFormSubmit() {
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    const { submit } = this.getApi()
                    const data = JSON.parse(JSON.stringify(this.dataForm));
                    if (!this.onSubmitBefore(data, !this.dataForm.id?'insert':'update')) {
                        return
                    }
                    this.btnLoading = true;
                    if (!this.dataForm.id) {
                        request({
                            url: submit,
                            method: 'post',
                            data: data,
                        }).then((res) => {
                            this.$message({
                                message: res.msg,
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.btnLoading = false;
                                    this.visible = false;
                                    this.$emit('refresh', true)
                                }
                            })
                        }).finally(_ => this.btnLoading = false)
                    } else {
                        request({
                            url: `${submit}/${this.dataForm.id}`,
                            method: 'PUT',
                            data: data
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
                        }).finally(_ => this.btnLoading = false)
                    }
                }
            })
        },
        goBack() {
            this.$emit('refresh',this.refreshTableList)
        },
    },
}