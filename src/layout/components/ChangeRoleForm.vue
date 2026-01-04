<template>
  <el-dialog title="切换角色" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"
    :close-on-click-modal="false" :close-on-press-escape="false" top="30vh">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
      <el-form-item label-width="0">
        <el-alert
          title="切换角色前，请先保存数据！切换角色后，请刷新页面！"
          type="error"
          :closable="false">
        </el-alert>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="dataForm.roleId" placeholder="选择角色" filterable clearable style="width: 100%;" @change="roleChange">
          <el-option v-for="item in userInfo.roles" :key="item.id"
              :label="item.name" :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织" prop="organizeId">
        <el-select v-model="dataForm.organizeId" placeholder="选择角色" filterable clearable style="width: 100%;" @visible-change="visibleChange">
          <el-option v-for="item in roleTreeData" :key="item.id"
              :label="item.fullName" :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
    
    <!-- <div v-for="g in roleList" :key="g.id">
      <el-alert
        :title="g.fullName"
        type="success"
        :closable="false">
      </el-alert>
      <el-radio-group v-model="roleId" style="padding-top: 5px;">
        <el-row :gutter="16">
          <el-col :span="12" v-for="item in g.children" :key="item.id">
            <el-radio style="width: 100%;" :label="item.id" border>{{ item.fullName }}</el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
    </div> -->
    
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="handleOk()" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Loading } from 'element-ui';
import { mapGetters } from 'vuex';
import { setMajor } from '@/api/permission/userSetting';
import {getRoleByOrganize} from '@/api/permission/role'
import { resetRouter } from '@/router'
export default {
  data() {
    return {
      dialogVisible: false,
      loadingInstance: undefined,
      btnLoading: false,
      roleList:[],
      dataForm:{
        roleId:'',
        organizeId:''
      },
      dataRule:{
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    // ...mapState({
    //   showLanguage: state => state.settings.showLanguage,
    //   showSearch: state => state.settings.showSearch,
    //   showSettings: state => state.settings.showSettings,
    // }),
    ...mapGetters(['userInfo']),
    // sysConfig() {
    //   return this.$store.state.settings.sysConfig
    // },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    roleTreeData(){
      return this.roleList.filter(it=>it.hasChildren && it.children.some(x=>x.id == this.dataForm.roleId))
    }
  },
  methods: {
    async showDialog() {
      this.dialogVisible = true;
      this.loadingInstance = Loading.service({ fullscreen: true });

      const organizeIds= this.userInfo.companys.map(it=> it.id)
      await getRoleByOrganize(organizeIds).then(res=>{
        this.roleList = res.data.list
      })
      this.dataForm.roleId = this.userInfo.lastRoleId;
      this.dataForm.organizeId = this.userInfo.organizeId;
      

    },
    handleClose(done) {
      if (!this.userInfo.lastRoleId) {
        return this.$message.error('请选择角色')
      }      
      if (this.loadingInstance) {
        this.loadingInstance.close()
      }
      done()
      //
      // if (this.roleId != this.userInfo.lastRoleId) {

      // }

    },
    /** 刷新当前页面 */
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        let { fullPath } = view
        // 对外链刷新的处理，：需要转义
        if (fullPath.indexOf(':') > -1) {
          fullPath = fullPath.replace('/', '')
          fullPath = '/' + encodeURIComponent(fullPath)
        }
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    handleOk() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setMajor({
            majorType: 'Role',
            majorId: `${this.dataForm.roleId}:${this.dataForm.organizeId}`
          }).then(async res => {
            this.$message.success(res.msg)
            // 清了菜单然后跳转到首页
            const view = this.visitedViews.find(x => x.fullPath == this.$route.fullPath)
            

            this.$store.commit('user/SET_MENULIST',[])
            resetRouter()
            await this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews })=>{
              // console.log(visitedViews)
              // this.$router.push({path:'/'})
              // this.$nextTick(()=>{
              //   this.$router.push({ path: '/home' });
              //   this.onClose()
              // })

              if (view && (view.path == '/home' || view.path == '/dashboard')) {
                this.refreshSelectedTag(view)
              }else{
                this.$router.push({ path: '/' });
              }

              this.onClose()
            })
            
            
          })
        }
      })
    },
    onClose(){
      this.dialogVisible = false
      this.btnLoading = false
      if (this.loadingInstance) { 
        this.loadingInstance.close()
      }
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.roleId) this.$message.warning('请先选择角色')
    },
    roleChange(){
      if (this.dataForm.organizeId && !this.roleTreeData.some(it=>it.id == this.dataForm.organizeId)) {
        this.dataForm.organizeId = ''
      }

      if (!this.dataForm.organizeId && this.roleTreeData.length == 1) {
        this.dataForm.organizeId = this.roleTreeData[0].id
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>