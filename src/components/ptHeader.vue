<template>
  <el-header>

    <div class="header-title">
      <img :src="logoUrl" alt="" v-if="logoUrl">
      <img src="../assets/logo.png" alt="" class="default-logo" v-else>
      盘古OSS
    </div>

    <pt-menu/>

    <el-dropdown trigger="click" @command="handleCommand">
      <el-button type="text">{{userName}}，欢迎您!<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="resetPwd">重置密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="重置密码" :visible.sync="resetVisible" append-to-body width="450px" :close-on-click-modal="false" class="pt-resetPas-dialog">
      <el-form :model="resetForm" :rules="resetRules" ref="resetForm" class="reset-content" style="margin-top: 20px">
        <el-form-item prop="phone">
          <el-input v-model.trim="resetForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="phoneCode">
          <el-input v-model.trim="resetForm.phoneCode" placeholder="短信验证码">
            <el-button slot="append" @click="handleSendCode" :disabled="disabledCode" class="login-codeBtn">{{btnCountDown ? btnCountDown : '短信验证码'}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input v-model.trim="resetForm.newPassword" placeholder="6-20位，数字、字母、符号至少包含两种" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model.trim="resetForm.rePassword" placeholder="确认新密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div><el-button type="primary" @click="handleSaveReset" class="content-resetPas">提交</el-button></div>
        <el-button @click="resetVisible = false" class="content-resetPas margin-top10">取消</el-button>
      </div>
    </el-dialog>

  </el-header>
</template>

<script>
  import {logout, sendCode, resetPwd} from '@/service/account/account'
  import ptMenu from './ptMenu'
  export default {
    components: {ptMenu},
    mounted() {
      this.userName = this.$getLocalStorage('userInfo').nickName
      this.logoUrl = this.$getLocalStorage('logoUrl')
    },
    data() {
      const validateRePsw = (rule, value, callback) => {
        if (this.resetForm.newPassword) {
          if (value && value !== this.resetForm.newPassword) {
            callback('两次密码不一致')
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      return {
        userName: '',
        logoUrl: '',
        resetVisible: false,
        resetForm: {},
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
          ],
          rePassword: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {validator: validateRePsw, trigger: 'blur'}
          ]
        },
        disabledCode: false,
        btnCountDown: '',
        orgCode: this.$getLocalStorage('orgCode') || this.$route.params.orgCode
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.$alert('您确定要退出账号?', '退出提示', {
              showCancelButton: true,
              type: 'warning',
              callback: action => {
                if (action === 'confirm') {
                  logout(this.orgCode).then(res => {
                    if (res.code === '200') {
                      this.$clearLocalStorage();
                      this.$store.dispatch('saveBreadcrumbs', []);
                      this.$router.replace(`/${this.orgCode}/login`);
                    }
                  })
                }
              }
            });
            break;
          case 'resetPwd':
            this.resetVisible = true
            this.resetForm = {}
            if (this.$refs['resetForm']) {
              this.$refs['resetForm'].clearValidate()
            }
            break;
          default:
            break;
        }
      },
      //验证码倒计时
      countDown(sec) {
        if (sec > 0) {
          this.disabledCode = true;
          this.btnCountDown = `${sec}秒后重发`;
          setTimeout(() => {
            this.countDown(--sec);
          }, 1000)
        } else {
          this.disabledCode = false;
          this.btnCountDown = '';
        }
      },
      handleSendCode() {
        // 校验手机号
        this.$refs['resetForm'].validateField('phone', (err) => {
          if (!err) {
            let params = {
              phone: this.resetForm.phone,
              usage: 'RESET_PASSWORD',
              tenantNo: this.orgCode,
              isOSSSend: true
            };
            sendCode(params).then(res => {
              if (res.code === '200') {
                this.countDown(60)
              }
            });
          }
        })
      },
      handleSaveReset() {
        this.$refs['resetForm'].validate((valid) => {
          if (valid) {
            const params = this.$deepcopy(this.resetForm);
            params.tenantNo = this.orgCode;
            resetPwd(params).then(res => {
              if (res.code === '200') {
                this.resetVisible = false
              }
            });
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .el-header {
    width: 100%;
    align-items: center;
    display: flex;

    .header-title {
      align-items: center;
      display: flex;
      font-size: 20px;
      color: white;

      img {
        height: 32px;
        width: 32px;
      }
      .default-logo {
        height: 60px;
        width: auto;
        margin-right: 5px;
      }
    }

    .el-dropdown {
      position: absolute;
      right: 20px;
      .el-button--text{
        color: white;
        font-weight: normal;
      }
    }
  }
</style>