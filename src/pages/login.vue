<template>
    <div class="pt-login">
        <h3 class="login-title">登录</h3>
        <el-form class="login-content" ref="loginForm" :rules="loginRules" :model="loginForm" v-if="loginType === 'password'">
            <el-form-item prop="phone">
                <el-input v-model.trim="loginForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model.trim="loginForm.password" placeholder="6-20位，数字、字母、符号至少包含两种" type="password"></el-input>
            </el-form-item>
            <el-button class="content-login" type="primary" @click="handleClickLogin" :disabled="loginLoading" :loading="loginLoading">登录</el-button>
            <el-button type="text" @click="handleChangeLoginType('code')" class="content-register" size="mini">手机验证码登录</el-button>
            <el-button type="text" @click="handleResetPassword" class="content-forget" size="mini">忘记密码？</el-button>
        </el-form>
        <el-form class="login-content" ref="loginForm" :rules="loginRules" :model="loginForm" v-else>
            <el-form-item prop="phone">
                <el-input v-model.trim="loginForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="phoneCode">
                <el-input v-model.trim="loginForm.phoneCode" placeholder="验证码">
                    <el-button slot="append" @click="handleSendCode('login')" :disabled="disabledCode.login" class="login-codeBtn">{{btnCountDown.login ? btnCountDown.login : '短信验证码'}}</el-button>
                </el-input>
            </el-form-item>
            <el-button class="content-login" type="primary" @click="handleClickLogin">登录</el-button>
            <el-button type="text" @click="handleChangeLoginType('password')" class="content-register" size="mini">密码登录</el-button>
            <el-button type="text" @click="handleResetPassword" class="content-forget" size="mini">忘记密码？</el-button>
        </el-form>
        <!--<el-tabs v-model="activeName" class="pt-login-tabs">
            <el-tab-pane label="注册" name="register">
                <el-form class="login-content" ref="registerForm" :rules="registerRules" :model="registerForm">
                    <el-form-item prop="username">
                        <el-input v-model.trim="registerForm.username" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input v-model.trim="registerForm.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="phoneCode">
                        <el-input v-model.trim="registerForm.phoneCode" placeholder="短信验证码">
                            <el-button slot="append" @click="handleSendCode('register')" :disabled="disabledCode.register" class="login-codeBtn">{{btnCountDown.register ? btnCountDown.register : '短信验证码'}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model.trim="registerForm.password" placeholder="6-20位，数字、字母、符号至少包含两种" type="password"></el-input>
                    </el-form-item>
                    <el-button class="content-login" type="primary" @click="handleClickRegister" :disabled="registerLoading" :loading="registerLoading">注册</el-button>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="登录" name="login">
                <el-form class="login-content" ref="loginForm" :rules="loginRules" :model="loginForm" v-if="loginType === 'password'">
                    <el-form-item prop="phone">
                        <el-input v-model.trim="loginForm.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    &lt;!&ndash;<el-form-item prop="phoneCode">
                        <el-input v-model.trim="loginForm.phoneCode" placeholder="验证码">
                            <el-button slot="append" @click="handleSendCode('login')" :disabled="disabledCode.login" class="login-codeBtn">{{btnCountDown.login ? btnCountDown.login : '短信验证码'}}</el-button>
                        </el-input>
                    </el-form-item>&ndash;&gt;
                    <el-form-item prop="password">
                        <el-input v-model.trim="loginForm.password" placeholder="6-20位，数字、字母、符号至少包含两种" type="password"></el-input>
                    </el-form-item>
                    <el-button class="content-login" type="primary" @click="handleClickLogin" :disabled="loginLoading" :loading="loginLoading">登录</el-button>
                    <el-button type="text" @click="handleChangeLoginType('code')" class="content-register" size="mini">手机验证码登录</el-button>
                    <el-button type="text" @click="handleResetPassword" class="content-forget" size="mini">忘记密码？</el-button>
                </el-form>
                <el-form class="login-content" ref="loginForm" :rules="loginRules" :model="loginForm" v-else>
                    <el-form-item prop="phone">
                        <el-input v-model.trim="loginForm.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="phoneCode">
                        <el-input v-model.trim="loginForm.phoneCode" placeholder="验证码">
                            <el-button slot="append" @click="handleSendCode('login')" :disabled="disabledCode.login" class="login-codeBtn">{{btnCountDown.login ? btnCountDown.login : '短信验证码'}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-button class="content-login" type="primary" @click="handleClickLogin">登录</el-button>
                    <el-button type="text" @click="handleChangeLoginType('password')" class="content-register" size="mini">密码登录（手机号）</el-button>
                </el-form>
            </el-tab-pane>
        </el-tabs>-->

        <el-dialog title="重置密码" :visible.sync="resetVisible" append-to-body width="450px" :close-on-click-modal="false" :modal="false" class="pt-resetPas-dialog">
            <p class="text-gray">为了保证你的账号安全，请验证身份。验证成功后才可以重置密码</p>
            <el-form :model="resetForm" :rules="resetRules" ref="resetForm" class="reset-content">
                <el-form-item prop="phone">
                    <el-input v-model.trim="resetForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="phoneCode">
                    <el-input v-model.trim="resetForm.phoneCode" placeholder="短信验证码">
                        <el-button slot="append" @click="handleSendCode('reset')" :disabled="disabledCode.reset" class="login-codeBtn">{{btnCountDown.reset ? btnCountDown.reset : '短信验证码'}}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="newPassword">
                    <el-input v-model.trim="resetForm.newPassword" placeholder="6-20位，数字、字母、符号至少包含两种" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSaveReset" class="content-resetPas" :disabled="resetLoading" :loading="resetLoading">重置密码</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {R_AsideMenus, login, fastLogin, sendCode, resetPwd, register, checkToken} from '@/service/account/account';
  import { $getLocalStorage } from "../lib/methods";

  export default {
    data() {
      return {
        orgCode: this.$route.params.orgCode,//机构号
        activeName: 'login',
        loginForm: {},
        registerForm: {},
        loginType: 'password',
        loginRules: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {pattern: this.$valid.password, message: '您输入的密码格式错误，请重新输入', trigger: 'blur'}
          ],
          phoneCode: [
            {required: true, message: '请输入短信验证码', trigger: 'blur'},
            {pattern: this.$valid.code, message: '请输入正确的短信验证码', trigger: 'blur'}
          ]
        },
        registerRules: {
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入汉字', trigger: 'blur' },
            { min: 2, max: 14, message: '长度在2-14个汉字', trigger: 'blur' }
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          phoneCode: [
            {required: true, message: '请输入短信验证码', trigger: 'blur'},
            {pattern: this.$valid.code, message: '请输入正确的短信验证码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {pattern: this.$valid.password, message: '您输入的密码格式错误，请重新输入', trigger: 'blur'}
          ]
        },
        resetRules: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          phoneCode: [
            {required: true, message: '请输入短信验证码', trigger: 'blur'},
            {pattern: this.$valid.code, message: '请输入正确的短信验证码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {pattern: this.$valid.password, message: '您输入的密码格式错误，请重新输入', trigger: 'blur'}
          ]
        },
        resetForm: {},
        resetVisible: false,
        rePassword: {},
        prefixUrl: '/' + this.$route.params.orgCode,
        indexUrl: '',
        disabledCode: {},
        btnCountDown: {},
        registerLoading: false,
        loginLoading: false,
        resetLoading: false
      }
    },
    methods: {
      handleChangeLoginType(type) {
        this.loginType = type;
        if (this.$refs['loginForm']) {
          this.$refs['loginForm'].clearValidate()
        }
      },
      handleResetPassword() {
        this.resetVisible = true;
        this.resetForm = {};
        if (this.$refs['resetForm']) {
          this.$refs['resetForm'].clearValidate()
        }
      },
      // 注册
      handleClickRegister() {
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            window.$cookies.remove('tenantToken');
            window.$cookies.remove('opfunToken');
            this.registerLoading = true;
            const params = this.$deepcopy(this.registerForm);
            params.tenantNo = this.orgCode;
            register(params).then(res => {
              if (res.code === '200') {
                this.$alert(res.message, '提示', {
                  confirmButtonText: '关闭',
                  callback: () => {
                    this.$refs['registerForm'].resetFields();
                    this.activeName = 'login';
                  }
                })
              }
            }).finally(() => {
              this.registerLoading = false;
            })
          }
        });
      },
      // 登录
      handleClickLogin() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            window.$cookies.remove('tenantToken');
            window.$cookies.remove('opfunToken');
            this.loginLoading = true;
            const params = this.$deepcopy(this.loginForm);
            params.tenantNo = this.orgCode;
            let api = '';
            if (this.loginType === 'password') {
              api = login;
              delete params.phoneCode;
            } else {
              api = fastLogin;
              delete params.password;
            }
            api(params).then(res => {
              if (res.code === '200') {
                let accountType;
                switch (res.body.accountType) {
                  case 0:
                    accountType = 'orgAdmin';//机构管理系统后台账号
                    break;
                  case 1:
                    accountType = 'institutionalAccount';//进件管理系统：机构账号
                    break;
                  case 2:
                    accountType = 'channelAdmin';//进件管理系统：渠道管理员
                    break;
                  case 3:
                    accountType = 'channelSalesman';//进件管理系统：渠道业务员
                    break;
                }
                this.$setLocalStorage('userInfo', {nickName: params.phone, accountType: accountType});
                // 获取菜单权限
                this.getAsideMenus()
              } else {
                this.loginLoading = false;
              }
            }, () => {
              this.loginLoading = false;
            })
          }
        });
      },
      //验证码倒计时
      countDown(type, sec) {
        if (sec > 0) {
          this.$set(this.disabledCode, type, true);
          this.$set(this.btnCountDown, type, `${sec}秒后重发`);
          setTimeout(() => {
            this.countDown(type, --sec);
          }, 1000)
        } else {
          this.$set(this.disabledCode, type, false);
          this.$set(this.btnCountDown, type, '');
        }
      },
      handleSendCode(type) {
        // 校验手机号
        this.$refs[`${type}Form`].validateField('phone', (err) => {
          if (!err) {
            window.$cookies.remove('tenantToken');
            window.$cookies.remove('opfunToken');
            let params = {
              phone: this[`${type}Form`].phone,
              isOSSSend: true
            };
            switch (type){
              case 'reset':
                params.usage = 'RESET_PASSWORD';
                break;
              default:
                params.usage = type.toUpperCase();
                break;
            }
            params.tenantNo = this.orgCode;
            sendCode(params).then(res => {
              if (res.code === '200') {
                this.countDown(type, 60)
              }
            });
          }
        })
      },
      handleSaveReset() {
        this.$refs['resetForm'].validate((valid) => {
          if (valid) {
            window.$cookies.remove('tenantToken');
            window.$cookies.remove('opfunToken');
            this.resetLoading = true;
            const params = this.$deepcopy(this.resetForm);
            params.tenantNo = this.orgCode;
            resetPwd(params).then(res => {
              if (res.code === '200') {
                this.resetVisible = false
              }
            }).finally(() => {
              this.resetLoading = false;
            });
          }
        });
      },
      getAsideMenus() {
        this.$store.dispatch('saveButtons', []);
        // 获取菜单权限
        R_AsideMenus().then((data) => {
          if (data.code === '200') {
            data = data.body;
            const userInfo = this.$getLocalStorage('userInfo');
            if (data && data.length) {
              /*let urls = [''];
              data.forEach((item) => {
                urls.push(item.url);
                if (item.child) {
                  item.child.forEach((item2) => {
                    urls.push(item.url + item2.url);
                    if (item2.child) {
                      item2.child.forEach((item3) => {
                        urls.push(item.url + item2.url + item3.url);
                      })
                    }
                  })
                }
              });*/

              this.$setLocalStorage('asideMenus', data);
              /*this.$setLocalStorage('authUrls', urls);*/
              this.getIndexUrl(data[0]);
              userInfo.indexUrl = this.indexUrl;
              this.$setLocalStorage('userInfo', userInfo);
              if (this.$route.query.returnUrl) {
                this.$router.push(this.$route.query.returnUrl)
              } else {
                this.$router.push(this.indexUrl);
              }
            } else {
              // 无权限，登录后页面为空
              this.$removeLocalStorage('asideMenus');
              userInfo.indexUrl = `/${this.orgCode}/blank`;
              this.$setLocalStorage('userInfo', userInfo);
              this.$router.push(`/${this.orgCode}/blank`);
            }
          }
        }).finally(() => {
          this.loginLoading = false;
        });
      },
      // 根据用户菜单权限获取首页地址
      getIndexUrl(menu) {
        if (menu.child && menu.child.length) {
          this.prefixUrl = this.prefixUrl + menu.url;
          this.getIndexUrl(menu.child[0])
        } else {
          this.indexUrl = this.indexUrl + this.prefixUrl + menu.url
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      const userInfo = $getLocalStorage('userInfo');
      if (!userInfo) {
        next();
      } else {
        const tenantNo = to.params.orgCode;
        checkToken({tenantNo}).then(res => {
          if (res.code === '200') {
            userInfo.indexUrl ? next({path: userInfo.indexUrl}) : next();
          } else {
            next();
          }
        }, () => {
          next();
        })
      }
    },
  }
</script>

<style lang="scss">
    .pt-login {
        height: 100%;
        text-align: center;
        background: #F6FAFC;
        padding-top: 7%;
        color: white;
        .pt-login-tabs{
            width: 500px;
            margin: 0 auto;
            .el-tabs__header{
                width: 200px;
                margin: 0 auto 15px;
            }
            .el-tabs__nav{
                width: 100%!important;
                .el-tabs__item{
                    width: 50%!important;
                    text-align: center!important;
                }
            }
        }

        .login-title{
            font-size: 18px;
            color: #409EFF;
        }

        .login-content {
            //background: rgba(255, 255, 255, .1);
            text-align: center;
            border-radius: 10px;
            padding: 0 40px;
            width: 400px;
            margin: 0 auto;

            .login-codeBtn:hover{
                background: transparent;
            }

            .content-register {
                float: left;
            }

            .content-forget {
                float: right;
                color: #787878;
            }

            .content-login {
                margin-bottom: 15px;
                width: 100%;
            }
        }

    }
    .pt-resetPas-dialog{
        .el-dialog{
            box-shadow: 0 0 80px 0 rgba(0, 0, 0, .4);
        }
        .el-dialog__header{
            background: linear-gradient(to bottom, #1d7fe2, #0865c2);
            padding-top: 10px;
            .el-dialog__title{
                color: white;
                font-size: 15px;
                font-weight: 700;
                text-shadow: 0 1px 1px rgba(0, 0, 0, .4);
            }
            .el-dialog__headerbtn{
                top: 13px;
                i{
                    color: white;
                }
            }
        }
        .el-dialog__body{
            padding: 0 20px;
            .text-gray{
                color: #999;
            }
            .reset-content{
                width: 80%;
                margin: 0 auto;
            }
            .login-codeBtn:hover{
                background: transparent;
            }
        }
        .dialog-footer{
            text-align: center;
            .content-resetPas{
                width: 80%;
            }
        }
    }
</style>