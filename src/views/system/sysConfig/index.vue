<template>
  <div class="app-container QT-flex-main systemConfig">
    <el-form ref="baseForm" :model="baseForm" :rules="rules" label-width="auto">
      <el-tabs v-model="activeName" type="border-card" class="QT-el_tabs">
        <el-tab-pane label="基本设置" name="first">
          <el-row :gutter="20">
            <!-- <el-col :span="24">
              <el-form-item label="系统图标">
                <div class="img-list">
                  <single-img v-model="baseForm.loginIcon" tip="登录图标" />
                  <div style="text-align: center;">
                    <single-img v-model="baseForm.navigationIcon" tip="导航图标" />
                    <div style="margin-left: -18px;">尺寸：210*60</div>
                  </div>
                  
                  <single-img v-model="baseForm.logoIcon" tip="LOGO图标" />
                  <single-img v-model="baseForm.appIcon" tip="APP图标" />
                </div>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="登录图标">
                <div class="img-list">
                  <single-img v-model="baseForm.loginIcon" tip="登录图标" />
                  <div style="">{{ baseForm.loginIconRemark }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="导航图标">
                <div class="img-list">
                  <single-img v-model="baseForm.navigationIcon" tip="导航图标" />
                  <div style="">{{ baseForm.navigationIconRemark }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="LOGO图标">
                <div class="img-list">
                  <single-img v-model="baseForm.logoIcon" tip="LOGO图标" />
                  <div style="">{{ baseForm.logoIconRemark }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="APP图标">
                <div class="img-list">
                  <single-img v-model="baseForm.appIcon" tip="APP图标" />
                  <div style="">{{ baseForm.appIconRemark }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统名称" prop="sysName">
                <el-input v-model="baseForm.sysName" clearable placeholder="系统名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统版本" prop="sysVersion">
                <el-input v-model="baseForm.sysVersion" maxlength="8" placeholder="系统版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="baseForm.companyName" clearable placeholder="公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版权信息" prop="copyright">
                <el-input v-model="baseForm.copyright" clearable placeholder="版权信息" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司简称" prop="companyCode">
                <el-input v-model="baseForm.companyCode" clearable placeholder="公司简称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input v-model="baseForm.companyAddress" clearable placeholder="公司地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司法人" prop="companyContacts">
                <el-input v-model="baseForm.companyContacts" clearable placeholder="公司法人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司电话" prop="companyTelePhone">
                <el-input v-model="baseForm.companyTelePhone" clearable placeholder="公司电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司邮箱" prop="companyEmail">
                <el-input v-model="baseForm.companyEmail" clearable placeholder="公司邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公司印章">
                <div class="img-list">
                  <single-img v-model="baseForm.companySeal" tip="公司印章" />
                  <div style="">建议150*150</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="系统描述" prop="sysDescription">
                <el-input v-model="baseForm.sysDescription" type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10}" placeholder="系统描述" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                  @click="submitForm()">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全设置" name="second">
          <el-alert title="注意：系统登录安全、黑名单IP限制" type="warning" :closable="false" show-icon />
          <el-row class="mt-20">
            <el-col :span="18">
              <el-form-item label="登录方式">
                <el-select v-model="baseForm.singleLogin" placeholder="请选择">
                  <el-option label="单一登录" :value="1" />
                  <el-option label="同时登录" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="超时登出">
                <el-input-number v-model="baseForm.tokenTimeout" :min="1" :precision="0" :step="1"
                  controls-position="right" /> 分钟
              </el-form-item>
              <el-form-item label="密码错误次数">
                <el-input-number v-model="baseForm.passwordErrorsNumber" :min="0" :precision="0"
                  :step="1" controls-position="right" /> 次
                <div class="tip">输入密码错误将用户锁定，设置3以下值表示不启动该功能</div>
                <el-radio-group v-model="baseForm.lockType">
                  <el-radio :label="1">账号锁定</el-radio>
                  <el-radio :label="2">延时登录</el-radio>
                </el-radio-group>
                <div v-if="baseForm.lockType===2">
                  <span class="lockTime">延迟时间</span>
                  <el-input-number v-model="baseForm.lockTime" :min="1" :precision="0" :step="1"
                    controls-position="right" /> 分钟
                </div>
              </el-form-item>
              <el-form-item label="登录验证码">
                <el-switch v-model="baseForm.enableVerificationCode" :active-value="1"
                  :inactive-value="0" />
              </el-form-item>
              <el-form-item label="验证码位数" v-if="baseForm.enableVerificationCode">
                <el-input-number v-model="baseForm.verificationCodeNumber" :min="3" :max="6"
                  :precision="0" :step="1" controls-position="right" /> 位
              </el-form-item>
              <el-form-item label="登录提示语">
                <el-switch v-model="baseForm.lastLoginTimeSwitch" :active-value="1"
                  :inactive-value="0" />
              </el-form-item>
              <el-form-item v-if="baseForm.lastLoginTimeSwitch">
                <el-card class="box-card" shadow="never" style="width: 300px;"
                  :body-style="{ padding: '0px 20px' }">
                  <div slot="header">
                    <span>上次登录信息提示</span>
                    <i style="float: right; padding: 11px 0" class="el-icon-close" />
                  </div>
                  <div class="item">
                    <p>时间：2018-10-17 12:40</p>
                    <p>地点：上海市</p>
                    <p>IP：255.255.0.0</p>
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="白名单验证">
                <el-switch v-model="baseForm.whitelistSwitch" :active-value="1"
                  :inactive-value="0" />
              </el-form-item>
              <el-form-item label="白名单设置" v-if="baseForm.whitelistSwitch">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}"
                  v-model="baseForm.whiteListIp" placeholder="允许访问IP" />
                <div class="tip">多个IP设置，用英文符号隔开，如192.168.0.1,192.168.0.2</div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                  @click="submitForm()">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="第三方设置" name="third">
          <el-tabs tab-position="left" style="height:100%" v-model="thirdTab" class="thirdTab">
            <el-tab-pane label="阿里短信">
              <!-- <el-alert title="注意：请在短信厂家官网网站开通申请" type="warning" :closable="false" show-icon /> -->
              <el-row style="margin-top: 15px" v-if="thirdTab=='0'">
                <el-col :span="12">
                  <qt-form-tip-item label="AccessKey ID" prop="aliAccessKey" label-width="180px"
                    tip-label="授权ID，【AccessKey管理】中的 AccessKey ID">
                    <el-input v-model="baseForm.aliAccessKey" clearable
                      placeholder="请输入AccessKey ID" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="AccessKey Secret" prop="aliSecret" label-width="180px"
                    tip-label="授权密钥,【AccessKey管理】中的 AccessKey Secret">
                    <el-input v-model="baseForm.aliSecret" show-password clearable
                      placeholder="请输入AccessKey Secret" />
                  </qt-form-tip-item>
                  <el-form-item label-width="180px">
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitSmsForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="腾讯短信">
              <el-row style="margin-top: 15px" v-if="thirdTab=='1'">
                <el-col :span="12">
                  <qt-form-tip-item label="SecretId" prop="tencentSecretId" label-width="180px"
                    tip-label="在【访问管理】-【访问密钥】- 【API密钥管理】中获取 SecretId">
                    <el-input v-model="baseForm.tencentSecretId" clearable
                      placeholder="请输入SecretId" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="SecretKey" prop="tencentSecretKey" label-width="180px"
                    tip-label="在【访问管理】-【访问密钥】- 【API密钥管理】中获取 SecretKey">
                    <el-input v-model="baseForm.tencentSecretKey" show-password clearable
                      placeholder="请输入SecretKey" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="SDK AppID" prop="tencentAppId" label-width="180px"
                    tip-label="【应⽤管理】-【应⽤列表】应⽤中的 SDK AppID">
                    <el-input v-model="baseForm.tencentAppId" clearable
                      placeholder="请输入SDK AppID" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="App Key" prop="tencentAppKey" label-width="180px"
                    tip-label="【应⽤管理】-【应⽤列表】应⽤中的 App Key">
                    <el-input v-model="baseForm.tencentAppKey" clearable placeholder="请输入App Key" />
                  </qt-form-tip-item>
                  <el-form-item label-width="180px">
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitSmsForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="电子邮箱">
              <el-alert title="注意：系统邮件设置成功后所有邮件会由此邮箱发出" type="warning" :closable="false"
                show-icon />
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12">
                  <el-form-item label="POP3服务" prop="emailPop3Host">
                    <el-input v-model="baseForm.emailPop3Host" clearable placeholder="POP3服务" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="SMTP服务" prop="emailSmtpHost">
                    <el-input v-model="baseForm.emailSmtpHost" clearable placeholder="SMTP服务" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="POP3端口" prop="emailPop3Port">
                    <el-input-number v-model="baseForm.emailPop3Port" controls-position="right" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="SMTP端口" prop="emailSmtpPort">
                    <el-input-number v-model="baseForm.emailSmtpPort" controls-position="right" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="显示名称" prop="emailSenderName">
                    <el-input v-model="baseForm.emailSenderName" clearable placeholder="显示名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="邮箱账户" prop="emailAccount">
                    <el-input v-model="baseForm.emailAccount" clearable placeholder="邮箱账户" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="邮箱密码" prop="emailPassword">
                    <el-input v-model="baseForm.emailPassword" show-password placeholder="邮箱密码">
                      <el-button slot="append" @click="checkEmailStatus" :loading="testLoading">测试连接
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="SSL登录" prop="emailSsl">
                    <el-switch v-model="baseForm.emailSsl" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="企业微信">
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="企业号Id" prop="qyhCorpId">
                    <el-input v-model="baseForm.qyhCorpId" clearable placeholder="请输入CorpId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="应用凭证" prop="qyhAgentId">
                    <el-input v-model="baseForm.qyhAgentId" clearable placeholder="请输入AgentId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="凭证密钥" prop="qyhAgentSecret">
                    <el-input v-model="baseForm.qyhAgentSecret" placeholder="请输入AppSecret">
                      <el-button slot="append" @click="checkQy(0)" :loading="testQyLoading">连接测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="同步密钥" prop="qyhCorpSecret">
                    <el-input v-model="baseForm.qyhCorpSecret" placeholder="请输入CorpSecret">
                      <el-button slot="append" @click="checkQy(1)" :loading="testSyncLoading">同步测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="触发事件">
                    <el-table :data="wxEvents" border>
                      <el-table-column prop="select" label="" width="50" align="center">
                        <template slot-scope="scope">
                          <el-checkbox v-model='scope.row.select' />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="触发事件" width="200" />
                      <el-table-column prop="desc" label="描述" />
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="同步反馈">
                    <el-table :data="wxResults" border>
                      <el-table-column prop="synType" label="同步类型" />
                      <el-table-column prop="recordTotal" label="总数" />
                      <el-table-column prop="synSuccessCount" label="同步成功数" />
                      <el-table-column prop="synFailCount" label="同步失败数" />
                      <el-table-column prop="unSynCount" label="未同步数" />
                      <el-table-column prop="synDate" label="同步时间"
                        :formatter="qt.tableDateFormat" />
                      <el-table-column label="操作" width="70">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="syncQy(scope.row)"
                            :loading="scope.row.loading">同步</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="阿里钉钉">
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="企业号Id" prop="dingAgentId">
                    <el-input v-model="baseForm.dingAgentId" clearable placeholder="请输入AgentId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="应用凭证" prop="dingSynAppKey">
                    <el-input v-model="baseForm.dingSynAppKey" clearable placeholder="请输入AppKey" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="凭证密钥" prop="dingSynAppSecret">
                    <el-input v-model="baseForm.dingSynAppSecret" placeholder="请输入AppSecret">
                      <el-button slot="append" @click="checkDing" :loading="testDingLoading">连接测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="触发事件">
                    <el-table :data="ddEvents" border>
                      <el-table-column prop="select" label="" width="50" align="center">
                        <template slot-scope="scope">
                          <el-checkbox v-model='scope.row.select' />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="触发事件" width="200" />
                      <el-table-column prop="desc" label="描述" />
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="同步反馈">
                    <el-table :data="ddResults" border>
                      <el-table-column prop="synType" label="同步类型" />
                      <el-table-column prop="recordTotal" label="总数" />
                      <el-table-column prop="synSuccessCount" label="同步成功数" />
                      <el-table-column prop="synFailCount" label="同步失败数" />
                      <el-table-column prop="unSynCount" label="未同步数" />
                      <el-table-column prop="synDate" label="同步时间"
                        :formatter="qt.tableDateFormat" />
                      <el-table-column label="操作" width="70">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="syncDing(scope.row)"
                            :loading="scope.row.loading">同步</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="三网短信">
              <!-- <el-alert title="注意：请在短信厂家官网网站开通申请" type="warning" :closable="false" show-icon /> -->
              <el-row style="margin-top: 15px">
                <el-col :span="12">
                  <qt-form-tip-item label="应用凭证" prop="thirdAppKey" label-width="180px" tip-label="授权ID，账户名">
                    <el-input v-model="baseForm.thirdAppKey" clearable
                      placeholder="请输入应用凭证" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="凭证密钥" prop="thirdAppSecret" label-width="180px"
                    tip-label="授权密钥">
                    <el-input v-model="baseForm.thirdAppSecret" show-password clearable
                      placeholder="请输入凭证密钥" />
                  </qt-form-tip-item>
                  <qt-form-tip-item label="服务地址" prop="thirdServer" label-width="180px">
                    <el-input v-model="baseForm.thirdServer" clearable
                      placeholder="请输入服务地址" />
                  </qt-form-tip-item>
                  <el-form-item label-width="180px">
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitSmsForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="管理员设置" name="fourth">
          <el-alert title="注意：设为超级管理员后该用户拥有系统最高权限" type="warning" :closable="false" show-icon />
          <el-row :gutter="20" style="margin-top: 15px">
            <el-col :span="12">
              <el-form-item label="超级管理员">
                <user-select v-model="adminIds" placeholder="请选择超级管理员" multiple />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                  @click="setAdminList()">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="登录配置" name="five">
          <el-col :span="12">
            <el-form-item label="登录模式">
              <el-select v-model="baseForm.loginMode" placeholder="请选择" style="width: 100%;">
                <el-option label="模式一" value="LoginMode1" />
                <el-option label="模式二" value="LoginMode2" />
                <el-option label="模式三" value="LoginMode3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="停用单角色模式">
              <el-switch v-model="baseForm.diableSingleRole" :active-value="1"
                :inactive-value="0" />
            </el-form-item>
          </el-col>    
          
          <el-col :span="24">
            <el-form-item label="只读角色">
              <el-select v-model="baseForm.readonlyRoleId" placeholder="该角色只允许查看数据，不允许修改" style="width: 100%;" clearable>
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.fullName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="启用体验角色" label-width="150px">
              <el-switch v-model="baseForm.isUseDemoRole" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="baseForm.isUseDemoRole == true">
            <el-row>
              <el-col :span="12">
                <el-form-item label="体验角色">
                  <el-select v-model="baseForm.defaultRoleId" placeholder="请选择默认的体验角色" style="width: 100%;" clearable>
                    <el-option v-for="item in roleOptions" :key="item.id" :label="item.fullName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体验时间">
                  <el-input-number v-model="baseForm.defaultExperienceDays" :min="1" :max="365" />
                  <span class="u-p-l-10">天</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>      
          <el-col>
            <el-form-item>
              <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                @click="submitForm()">保 存</el-button>
            </el-form-item>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="应用设置" name="six">
          <el-form-item label="分拣启用特殊入库">
            <el-switch v-model="baseForm.erpEnableCreateTs" :active-value="1"
              :inactive-value="0" />
          </el-form-item>
          <el-form-item label="禁止客户下单时间段">
            <el-switch v-model="baseForm.erpDisEnableCustomerOrder" :active-value="1"
              :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="baseForm.erpDisEnableCustomerOrder == 1" label="">
            <el-row type="flex" >
              <el-col :span="2">
                <el-select v-model="baseForm.erpDisEnableCustomerOrder_StartWeek" placeholder="请选择" style="width: 100%;" clearable>
                  <el-option label="周一" :value="1" />
                  <el-option label="周二" :value="2" />
                  <el-option label="周三" :value="3" />
                  <el-option label="周四" :value="4" />
                  <el-option label="周五" :value="5" />
                  <el-option label="周六" :value="6" />
                  <el-option label="周日" :value="0" />
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-time-picker v-model="baseForm.erpDisEnableCustomerOrder_StartTime"  style="width: 100%;" value-format="timestamp">
                </el-time-picker>
              </el-col>
              <span>至</span>
              <el-col :span="2">
                <el-select v-model="baseForm.erpDisEnableCustomerOrder_EndWeek" placeholder="请选择" style="width: 100%;" clearable>
                  <el-option label="周一" :value="1" />
                  <el-option label="周二" :value="2" />
                  <el-option label="周三" :value="3" />
                  <el-option label="周四" :value="4" />
                  <el-option label="周五" :value="5" />
                  <el-option label="周六" :value="6" />
                  <el-option label="周日" :value="0" />
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-time-picker v-model="baseForm.erpDisEnableCustomerOrder_EndTime" style="width: 100%;" value-format="timestamp">
                </el-time-picker>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="共享库存">
            <el-select v-model="erpShareStockList" filterable placeholder="请选择" clearable :style="{ width: '100%' }"
                  multiple>
                  <el-option v-for="(item, index) in oidTreeData" :key="index" :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
              @click="submitForm()">保 存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import {
  getSystemConfig,
  updateSystemConfig,
  testEmail,
  testQy,
  testDing,
  getSynThirdTotal,
  synAllOrganizeSysToDing,
  synAllUserSysToDing,
  synAllOrganizeSysToQy,
  synAllUserSysToQy,
  getAdminList,
  setAdminList
} from '@/api/system/sysConfig'
import singleImg from '@/components/Upload/SingleImg'

import { getOrganizeSelectorList } from "@/api/permission/organize";
export default {
  name: 'system-sysConfig',
  components: { singleImg },
  data() {
    return {
      activeName: 'first',
      listLoading: false,
      btnLoading: false,
      testLoading: false,
      testQyLoading: false,
      testSyncLoading: false,
      testDingLoading: false,
      thirdTab: '0',
      baseForm: {
        sysName: '',
        sysDescription: '',
        sysVersion: '',
        loginIcon: '',
        navigationIcon: '',
        logoIcon: '',
        appIcon: '',
        copyright: '',
        companyName: '',
        companyCode: '',
        companyAddress: '',
        companyContacts: '',
        companyTelePhone: '',
        companyEmail: '',
        singleLogin: '1',
        tokenTimeout: '1',
        lastLoginTimeSwitch: 1,
        whitelistSwitch: 1,
        whiteListIp: '',
        emailPop3Host: '',
        emailPop3Port: '110',
        emailSmtpHost: '',
        emailSmtpPort: '25',
        emailSenderName: '',
        emailAccount: '',
        emailPassword: '',
        emailSsl: 0,
        aliAccessKey: '',
        aliSecret: '',
        tencentSecretId: '',
        tencentSecretKey: '',
        tencentAppId: '',
        tencentAppKey: '',
        qyhCorpId: '',
        qyhAgentId: '',
        qyhAgentSecret: '',
        qyhCorpSecret: '',
        qyhIsSynOrg: 0,
        qyhIsSynUser: 0,
        dingSynAppKey: '',
        dingSynAppSecret: '',
        dingAgentId: '',
        dingSynIsSynOrg: 0,
        dingSynIsSynUser: 0,
        passwordErrorsNumber: 0,
        lockType: 1,
        lockTime: 10,
        enableVerificationCode: 0,
        //新加的设置
        loginMode:'loginMode1',
        loginIconRemark:'',
        navigationIconRemark:'',
        logoIconRemark:'',
        appIconRemark:'',
        //应用设置
        erpEnableCreateTs:0,
        erpDisEnableCustomerOrder:0,
        erpDisEnableCustomerOrder_StartWeek:'',
        erpDisEnableCustomerOrder_StartTime:'',
        erpDisEnableCustomerOrder_EndWeek:'',
        erpDisEnableCustomerOrder_EndTime:'',

        // 三网短信
        thirdAppKey:'',
        thirdAppSecret:'',
        thirdServer:'',
        diableSingleRole: 0,

        companySeal:'', //公司印章,

        readonlyRoleId:'',
        isUseDemoRole:false,
        defaultExperienceDays:3,
        erpShareStock:''
      },
      rules: {
        aliAccessKey: [
          { required: true, message: 'AccessKey ID不能为空', trigger: 'blur' }
        ],
        aliSecret: [
          { required: true, message: 'AccessKey Secret不能为空', trigger: 'blur' }
        ],
        tencentSecretId: [
          { required: true, message: 'SecretId不能为空', trigger: 'blur' }
        ],
        tencentSecretKey: [
          { required: true, message: 'SecretKey不能为空', trigger: 'blur' }
        ],
        tencentAppId: [
          { required: true, message: 'SDK AppID不能为空', trigger: 'blur' }
        ],
        tencentAppKey: [
          { required: true, message: 'App Key不能为空', trigger: 'blur' }
        ],
      },
      wxEvents: [{
        select: false,
        title: '启用同步组织',
        desc: '新增、删除、修改组织信息触发同步组织事件'
      }, {
        select: false,
        title: '启用同步用户',
        desc: '新增、删除、修改用户信息触发同步用户事件'
      }],
      wxResults: [{
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '组织',
        unSynCount: '',
      }, {
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '用户',
        unSynCount: '',
      }],
      ddEvents: [{
        select: false,
        title: '启用同步组织',
        desc: '新增、删除、修改组织信息触发同步组织事件'
      }, {
        select: false,
        title: '启用同步用户',
        desc: '新增、删除、修改用户信息触发同步用户事件'
      }],
      ddResults: [{
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '组织',
        unSynCount: '',
      }, {
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '用户',
        unSynCount: '',
      }],
      adminIds: [],
      roleOptions:[],
      oidTreeData:[],
      erpShareStockList:[]
    }
  },
  watch: {
    thirdTab(val) {
      if (val == 3 || val == 4) {
        const type = val == 3 ? 1 : 2
        this.getSynThirdTotal(type)
      }
    },
    activeName(val) {
      if (val === 'fourth') {
        this.getAdminList()
      }
    }
  },
  created() {
    this.initData()
    this.getRoleList()

    // 获取公司下拉列表
    getOrganizeSelectorList().then((res) => this.oidTreeData = res.data.list);
  },
  methods: {
    initData() {
      this.listLoading = true
      this.$nextTick(() => {
        getSystemConfig().then(res => {
          this.baseForm = res.data
          this.wxEvents[0].select = this.baseForm.qyhIsSynOrg ? true : false
          this.wxEvents[1].select = this.baseForm.qyhIsSynUser ? true : false
          this.ddEvents[0].select = this.baseForm.dingSynIsSynOrg ? true : false
          this.ddEvents[1].select = this.baseForm.dingSynIsSynUser ? true : false
          this.baseForm.smsCompany = this.baseForm.smsCompany ? this.baseForm.smsCompany : '1'
          this.baseForm.lockType = this.baseForm.lockType ? this.baseForm.lockType : 1
          this.baseForm.lockTime = this.baseForm.lockTime ? this.baseForm.lockTime : 10
          this.listLoading = false

          if (!!this.baseForm.erpShareStock) {
            this.erpShareStockList = this.baseForm.erpShareStock.split(',')
          }else{
            this.erpShareStockList = []
          }
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    checkEmailStatus() {
      this.testLoading = true
      const data = {
        account: this.baseForm.emailAccount,
        password: this.baseForm.emailPassword,
        pop3Host: this.baseForm.emailPop3Host,
        pop3Port: this.baseForm.emailPop3Port,
        smtpHost: this.baseForm.emailSmtpHost,
        smtpPort: this.baseForm.emailSmtpPort,
        ssl: this.baseForm.emailSsl
      }
      testEmail(data).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.testLoading = false
          }
        })
      }).catch(() => {
        this.testLoading = false
      })
    },
    checkQy(type) {
      type === 1 ? this.testSyncLoading = true : this.testQyLoading = true
      const data = {
        qyhAgentId: this.baseForm.qyhAgentId,
        qyhAgentSecret: this.baseForm.qyhAgentSecret,
        qyhCorpId: this.baseForm.qyhCorpId,
        qyhCorpSecret: this.baseForm.qyhCorpSecret
      }
      testQy(data, type).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            type === 1 ? this.testSyncLoading = false : this.testQyLoading = false
          }
        })
      }).catch(() => {
        type === 1 ? this.testSyncLoading = false : this.testQyLoading = false
      })
    },
    checkDing() {
      this.testDingLoading = true
      const data = {
        dingAgentId: this.baseForm.dingAgentId,
        dingSynAppKey: this.baseForm.dingSynAppKey,
        dingSynAppSecret: this.baseForm.dingSynAppSecret
      }
      testDing(data).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.testDingLoading = false
          }
        })
      }).catch(() => {
        this.testDingLoading = false
      })
    },
    getSynThirdTotal(type) {
      getSynThirdTotal(type).then(res => {
        let list = res.data.map(o => ({ loading: false, ...o }))
        type == 1 ? this.wxResults = list : this.ddResults = list
      })
    },
    syncQy(row) {
      row.loading = true
      const method = row.synType == '组织' ? synAllOrganizeSysToQy : synAllUserSysToQy
      method().then(res => {
        row.recordTotal = res.data.recordTotal
        row.synDate = res.data.synDate
        row.synFailCount = res.data.synFailCount
        row.synSuccessCount = res.data.synSuccessCount
        row.synType = res.data.synType
        row.unSynCount = res.data.unSynCount
        row.loading = false
        this.$message({
          message: '同步成功',
          type: 'success',
          duration: 1500,
        })
      }).catch(() => {
        row.loading = false
      })
    },
    syncDing(row) {
      row.loading = true
      const method = row.synType == '组织' ? synAllOrganizeSysToDing : synAllUserSysToDing
      method().then(res => {
        row.recordTotal = res.data.recordTotal
        row.synDate = res.data.synDate
        row.synFailCount = res.data.synFailCount
        row.synSuccessCount = res.data.synSuccessCount
        row.synType = res.data.synType
        row.unSynCount = res.data.unSynCount
        row.loading = false
        this.$message({
          message: '同步成功',
          type: 'success',
          duration: 1500,
        })
      }).catch(() => {
        row.loading = false
      })
    },
    submitSmsForm() {
      this.$refs['baseForm'].validate((valid) => {
        if (!valid) return
        this.submitForm()
      })
    },
    submitForm() {
      this.btnLoading = true
      this.baseForm.qyhIsSynOrg = this.wxEvents[0].select ? 1 : 0
      this.baseForm.qyhIsSynUser = this.wxEvents[1].select ? 1 : 0
      this.baseForm.dingSynIsSynOrg = this.ddEvents[0].select ? 1 : 0
      this.baseForm.dingSynIsSynUser = this.ddEvents[1].select ? 1 : 0
      this.baseForm.erpShareStock = this.erpShareStockList && this.erpShareStockList.length > 0 ? this.erpShareStockList.join(',') : ''
      updateSystemConfig(this.baseForm).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
            const sysConfig = {
              sysName: this.baseForm.sysName,
              sysVersion: this.baseForm.sysVersion,
              loginIcon: this.baseForm.loginIcon,
              copyright: this.baseForm.copyright,
              companyName: this.baseForm.companyName,
              navigationIcon: this.baseForm.navigationIcon,
              logoIcon: this.baseForm.logoIcon,
              appIcon: this.baseForm.appIcon
            }
            this.$store.commit('settings/CHANGE_SETTING', { key: "sysConfig", value: sysConfig })
            this.initData()
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },
    getAdminList() {
      getAdminList().then(res => {
        if (!res.data) return
        this.adminIds = res.data.map(o => o.id)
      })
    },
    setAdminList() {
      this.btnLoading = true
      setAdminList(this.adminIds).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
          }
        })
      })
    },
    getRoleList(){
      this.$request.get('/api/permission/role?pageSize=999&organizeId=0').then(res=>{
         this.roleOptions = res.data.list || []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.systemConfig {
  padding: 0;
  >>> .el-card__header {
    padding: 6px 20px;
  }
  >>> .el-tabs--border-card {
    box-shadow: none;
    height: calc(100vh - 120px);
  }
  >>> .el-tabs--border-card > .el-tabs__content {
    padding: 30px 36px 10px 36px;
  }
  .saveBtn {
    width: 100px;
  }
  .el-table >>> th {
    line-height: 23px;
  }
  .thirdTab >>> .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: auto;
    }
  }
  .tip {
    font-size: 14px;
    color: #a5a5a5;
  }
  .lockTime {
    line-height: 32px;
    padding-right: 12px;
    color: #606266;
    font-size: 14px;
  }
  .img-list {
    display: flex;
    >>> .singleImg-container {
      margin-right: 20px;
      :last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
