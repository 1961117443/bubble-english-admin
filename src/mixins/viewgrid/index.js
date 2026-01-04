import request from "@/utils/request";
import { getMenuPrint } from "@/api/system/menu";
import { mapGetters} from 'vuex'
export default {
    provide() {
        return {
            getApi: () => this.api,
            controller:this.controller
        }
    },
    data() {
        return {
            controller:'',
            // 接口地址，继承的页面都需要配置
            api: {
                list: "", // 列表查询接口
                export: "", //导出查询接口
                submit: "", //增删改的接口，删改会自动追加id，method类型：增=post，改=put，删=delete
                detail: "", //获取详情接口，自动追加id
            },
            // 列表查询
            listLoading: false,
            query: {},
            list: [],
            total: 0,
            listQuery: {
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            // 固定的参数，不会变动
            constParam:{

            },
            // form页面
            formVisible: false,
            // 多选
            multipleSelection: [],
            // 导出
            exportBoxVisible: false,
            // 初始化时候是否查询数据
            initQuery: true,
            // 导入
            importFormVisible: false, 
            span:{
                xs:{span:24},
                sm:{span:12} ,
                md:{span:12},
                lg:{span:8} ,
                xl:{span:6}
            },
            printDevList:[]
        }
    },
    computed: {
        menuId() {
         return this.$route.meta.modelId || "";
        },
        ...mapGetters(['userInfo'])
    },
    async created(){
        // console.log('1.base..create')
        // 如果配置了controller,自动生成api
        this.setApi()
        // console.log('mixins created:',JSON.stringify(this.api))

        // if (!this.__initQuery) {
        //     this.__initQuery = JSON.parse(JSON.stringify(this.query))
        // }
        
        // 加载打印模板
        if (this.modelId) {
            await getMenuPrint(this.modelId).then((res) => (this.printDevList = res.data));
        }
        // console.log('2.base..created')
    },
    async mounted() {
        // console.log('4.base...mounte')
        await this.loadData()
        if (this.initQuery) {
            await this.initData()
        }

        if (!this.__initQuery) {
            this.__initQuery = JSON.parse(JSON.stringify(this.query))
        }

        // console.log('8.base...mounted')
        
    },
    methods: {
        setApi(){
            if (this.controller) {
                if (!this.api.list) {
                    this.api.list = this.controller 
                }
                if (!this.api.submit) {
                    this.api.submit = this.controller 
                }
                if (!this.api.detail) {
                    this.api.detail = this.controller 
                }
            }
        },
        async loadData(){

        },
        async initData() {
            let _query = {
                ...this.listQuery,
                ...this.query,
                ...this.constParam,
                menuId: this.menuId,
            };
            let query = {};
            for (let key in _query) {
                if (Array.isArray(_query[key])) {
                    query[key] = _query[key].join();
                } else {
                    query[key] = _query[key];
                }
            }
            const flag = await this.beforeQuery(query)

            if (flag === false) {
                return
            }
            this.listLoading = true;
            await request({
                url: this.api.list,
                method: "GET",
                data: query,
            }).then((res) => {
                this.afterQuery(res.data)
                this.list = res.data.list;
                this.total = res.data.pagination.total;
                this.listLoading = false;
            });
        },
        reset() {
            // console.log(this.__initQuery)
            this.query = JSON.parse(JSON.stringify(this.__initQuery))
            // for (let key in this.query) {
            //     this.query[key] = undefined
            //     if (this.__initQuery[key]) {
            //         this.query[key] = this.__initQuery[key]
            //     }
            // }
            this.listQuery = {
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            }
            this.initData()
        },
        search() {
            this.listQuery = {
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            }
            this.initData()
        },
        download(data) {
            let query = { ...data, ...this.listQuery, ...this.query, menuId:this.menuId }
            request({
                // url: `/api/Erp/ErpCustomer/Actions/Export`,
                url: this.api.export,
                method: 'GET',
                data: query
            }).then(res => {
                if (!res.data.url) return
                this.qt.downloadFile(res.data.url)
                if (this.$refs.ExportBox) {
                    this.$refs.ExportBox.visible = false
                }               
                this.exportBoxVisible = false
            })
        },
        handleDel(id) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                type: "warning",
            })
                .then(() => {
                    request({
                        url: `${this.api.submit}/${id}`,
                        method: "DELETE",
                    }).then((res) => {
                        this.$message({
                            type: "success",
                            message: res.msg,
                            onClose: () => {
                                this.initData();
                            },
                        });
                    });
                })
                .catch(() => { });
        },
        //多选删除
        deleteCheckAll() {
            let _this = this; //当前页面
            //拿到选中的数据
            let list = _this.multipleSelection;
            //检查是否有选中
            if (!list.length) {
                _this.$message({ type: 'warning', message: '请选择要删除的记录！' });
                return false;
            }
            //执行删除操作
            _this.$confirm('确认要删除该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                let delIds = [];//创建一个数组
                list.forEach((item, index) => {
                    //遍历源数据
                    _this.list.forEach((v, i) => {
                        if (item.id == v.id) {
                            delIds.push(item.id);
                        }
                    })
                });
                _this.$request({
                    method: 'delete',
                    url:`${this.api.submit}ids=${delIds.toString()}`
                }).then(res=>{
                    _this.initData(); //重新加载列表
                    //清除选中状态
                    // _this.$refs.multipleTable.clearSelection();
                })
            }).catch(function () { });
        },
        // 添加、编辑、详情（readonly=true）
        addOrUpdateHandle(id, readonly) {
            this.formVisible = true;
            this.$nextTick(() => {
                this.$refs.QTForm.init(id, readonly);
            });
        },
        refresh(isrRefresh) {
            this.formVisible = false;
            if (isrRefresh) this.initData();
        },
        afterQuery(data){

        },
        beforeQuery(query){

        },
        //选中第几行
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        
    },
    // computed: {
    //     menuId() {
    //         return this.$route.meta.modelId || ''
    //     }
    // },
}