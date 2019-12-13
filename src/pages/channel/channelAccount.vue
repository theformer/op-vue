<template>
  <div>
    <pt-search :items="items" :params="searchParams"></pt-search>
    <div class="pt-table margin-top20 inside-margin">
      <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
        <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
        <el-table-column v-for="(column,index) in columns_left" :key="index" :prop="column.prop"
                         :label="column.label"
                         :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column v-for="(column,index) in columns_right" :key="'info2-'+index" :prop="column.prop"
                         :label="column.label"
                         :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column label="更新/添加时间">
          <template slot-scope="scope">
            <div>{{scope.row.updatedTime}}</div>
            <div class="create-date">{{scope.row.createdTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="text" icon="el-icon-edit" class="btn-operation"
                         @click="handleEdit(scope.row)" v-if="$hasButton('channel-account-edit')"></el-button>
            </el-tooltip>
            <el-tooltip content="查看">
              <el-button type="text" icon="el-icon-view" class="btn-operation"
                         @click="handleCheckDetail(scope.row)" v-if="$hasButton('channel-account-check')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="jumper, prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="total || 0"
        :current-page="searchParams.pageNum"
        @size-change="handleSizeChange($event, 'searchParams')"
        @current-change="handleCurrentChange($event, 'searchParams')"
        :disabled="searchLoading"
      ></el-pagination>

      <el-dialog :title="newAccountTitle" :visible.sync="newAccountVisible" append-to-body width="40%"
                 :close-on-click-modal="false" @close="handleClose">
        <el-row>
          <el-col :offset="2">
            <el-form :model="newAccount" label-width="120px" :rules="accountRules" ref="newAccount"
                     :disabled="newAccountMode === 'check'" :hide-required-asterisk="newAccountMode === 'check'">
              <el-row>
                <el-col :span="14">
                  <el-form-item label="渠道" prop="channelId">
                    <el-select v-model="newAccount.channelId" placeholder="请选择渠道" filterable :disabled="newAccountMode === 'edit'">
                      <el-option v-for="item in channelList" :key="item.id" :label="item.text"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="姓名" prop="username">
                    <el-input v-model.trim="newAccount.username" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model.trim="newAccount.phone" placeholder="请输入手机号"
                              :disabled="newAccountMode === 'edit'"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="身份证号" prop="idCard">
                    <el-input v-model.trim="newAccount.idCard" placeholder="请输入身份证号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="身份证正面照片" prop="idCardfront">
                <PtUpload
                  uploadTitle="点击上传身份证正面照片"
                  :imgUrl="newAccount.idCardfront"
                  :isCheck="newAccountMode === 'check'"
                  @success="uploadSuccess($event, 'front')"
                >
                </PtUpload>
              </el-form-item>
              <el-form-item label="身份证反面照片" prop="idCardback">
                <PtUpload
                  uploadTitle="点击上传身份证反面照片"
                  :imgUrl="newAccount.idCardback"
                  :isCheck="newAccountMode === 'check'"
                  @success="uploadSuccess($event, 'back')"
                >
                </PtUpload>
              </el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="风控结果" class="maxLength">
                    <span :class="{colorGray:newAccountMode ==='check'}">{{riskResult}}</span>
                    <div v-show="newAccountMode !=='check'" class="divDisplay">
                      <el-button v-if="riskResult !== '风控结果获取中'" :loading="saveRiskLoading" :disabled="saveRiskLoading"
                                 @click="getResult">获取风控结果
                      </el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="角色" prop="accountType">
                <el-checkbox-group v-model="newAccount.accountType">
                  <el-checkbox :label="3" disabled>业务员</el-checkbox>
                  <el-checkbox :label="2">渠道管理员</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="状态" prop="accountStatus">
                <el-radio-group v-model="newAccount.accountStatus">
                  <el-radio :label="false">启用</el-radio>
                  <el-radio :label="true">停用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newAccountVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveAccount" :loading="saveLoading" :disabled="saveLoading"
                     v-if="newAccountMode !== 'check'">保存
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {getAllChannel} from '@/service/income/income'
  import {getAccountDetail} from '@/service/rights/rights'
  import {
    addChannelAccount,
    updateChannelAccount,
    getAccountList,
    getQueryRiskResult,
    queryChannel,
    getChannelRiskResult
  } from '@/service/channel/channel'
  import PtUpload from './upload'

  export default {
    name: 'channelAccount',
    components: {PtUpload},
    data() {
      return {
        list: [],
        channelId: null,
        loginAccountType: this.$getLocalStorage('userInfo').accountType,// 当前登录账号的性质
        channelList: [],
        searchParams: {
          pageSize: 10,
          pageNum: 1,
          channelId: ''
        },
        riskResult: '',
        columns_left: [
          {label: '渠道名称', prop: 'channelName'},
          {label: '姓名', prop: 'username'},
          {label: '手机号码', prop: 'phone'},
        ],
        columns_right: [
          {label: '状态', prop: 'accountStatus'},
          {label: '创建人', prop: 'createdByUsername'},
        ],
        baseNum: 1,
        total: 0,
        searchLoading: false,
        newAccountVisible: false,
        saveRiskLoading: false,
        saveLoading: false,
        newAccountTitle: '',
        newAccountMode: '',
        newAccount: {
          channelId: '',
          accountType: [3],
          oldChannelId: ''
        },
        accountRules: {
          channelId: [{required: true, message: '请选择渠道', trigger: 'change'}],
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入汉字', trigger: 'blur'},
            {min: 2, max: 14, message: '长度在2-14个汉字', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          idCard: [
            {pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur'}
          ],
          accountType: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          accountStatus: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        },
      }
    },
    computed: {
      items() {
        return [
          {
            type: 'select',
            label: '渠道',
            key: 'channelId',
            placeholder: '',
            filterable: true,
            options: this.channelList,
            hidden: this.loginAccountType === 'channelAdmin'
          },
          {type: 'input', label: '姓名', key: 'username', placeholder: ''},
          {type: 'input', label: '手机号码', key: 'phone', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearch, disabled: this.searchLoading},
              {label: '重置', function: this.handleResetSearch}
            ]
          },
          {
            type: 'rightButtonGroup',
            buttons: [
              {
                label: '添加账号',
                type: 'primary',
                function: this.handleAddAccount,
                hidden: !this.$hasButton('channel-account-add')
              },
            ]
          }
        ]
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath != from.fullPath) {
        delete this.channelId
        delete this.searchParams.channelId;
        this.getAccountList()
        next();
      }
    },
    methods: {
      getAccountDetail(row) {
        getAccountDetail(row.accountId, row.channelId, row.accountType).then(res => {
          if (res.code === '200') {
            this.newAccount = {
              id: res.body.id,
              accountId: res.body.accountId,
              channelId: res.body.channelId,
              username: res.body.username,
              phone: res.body.phone,
              accountType: res.body.accountType,
              accountStatus: res.body.accountStatus,
              idCard: res.body.idCardf,
              front: res.body.front,
              back: res.body.back,
              idCardfront: res.body.front,
              idCardback: res.body.back,
              isModifyFront: false,
              isModifyBack: false,
              oldChannelId: res.body.channelId
            };
            this.newAccount.accountType = [this.newAccount.accountType];
            if (this.newAccount.accountType && this.newAccount.accountType == 2) {
              this.newAccount.accountType = [2, 3]
            } else {
              this.newAccount.accountType = [3]
            }
            this.riskResult = res.body.riskResult
          }
        })
      },
      channelAccess() {
        if (this.loginAccountType === 'channelAdmin') {
          this.queryChannel()
        } else {
          this.getAllChannel()
        }
      },
      queryChannel() {
        queryChannel().then(res => {
          if (res.code === '200') {
            this.channelList = [];
            if (res.body) {
              let result_ = [];
              result_ = [res.body];
              result_.forEach(ele => {
                this.channelList.push({
                  text: ele.channelName,
                  value: ele.id,
                  id: ele.id
                })
              })
            }
          }
        })
      },
      getAllChannel() {
        getAllChannel().then(res => {
          if (res.code === '200') {
            this.channelList = [];
            if (res.body && res.body.length) {
              res.body.forEach(ele => {
                this.channelList.push({
                  text: ele.channelName,
                  value: ele.id,
                  id: ele.id
                })
              })
            }
            // this.searchParams.channelId = this.channelId
          }
        })
      },
      resetFields(form) {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      handleClickSearch() {
        this.searchParams.pageNum = 1;
        this.getAccountList()

      },
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize
        }
      },
      handleAddAccount() {
        this.newAccountVisible = true;
        this.newAccountTitle = '添加账号';
        this.resetFields('newAccount');
        this.riskResult = '';
        this.newAccountMode = 'add';
        this.newAccount = {
          channelId: '',
          accountType: [3],
          oldChannelId: ''
        }

      },
      uploadSuccess(value, type) {
        this.$set(this.newAccount, `idCard${type}`, value.image);
        this.$set(this.newAccount, type, value.file);
        if (this.newAccountMode === 'edit') {
          if (type === 'front') {
            this.newAccount.isModifyFront = true
          } else {
            this.newAccount.isModifyBack = true
          }
        }
      },
      handleClose() {
        clearInterval(this.clearIntervalId);
      },
      getResult() {
        const search = {
          phone: this.newAccount.phone,
          idCard: this.newAccount.idCard,
          username: this.newAccount.username
        };
        if (search.phone && search.idCard && search.username) {
          this.saveRiskLoading = true;
          getChannelRiskResult(search).then(res => {
            if (res.code === '200') {
              this.riskResult = '风控结果获取中';
              let that = this;
              if (that.newAccountMode == 'add' || that.newAccountMode == 'edit') {
                let printInt = function () {
                  getQueryRiskResult({phone: search.phone}).then(res => {
                    if (res.code === '200') {
                      if (res.body) {
                        that.riskResult = res.body;
                        clearInterval(that.clearIntervalId)
                      }
                    }
                  }).finally(() => {
                    this.saveRiskLoading = false;
                  })
                };
                that.clearIntervalId = setInterval(printInt, 5000);
              }
            }
          }).finally(() => {
            this.saveRiskLoading = false;
          });
        } else if (!search.username) {
          this.$message({
            showClose: true,
            type: "error",
            message: '请输入姓名'
          });
        } else if (!search.phone) {
          this.$message({
            showClose: true,
            type: "error",
            message: '请输入手机号'
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: '请输入身份证号'
          });
        }
      },
      handleSaveAccount() {
        this.$refs.newAccount.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            const params = this.$deepcopy(this.newAccount);
            if (params.accountType.length > 1) {
              params.accountType = 2
            } else {
              params.accountType = 3
            }
            this.newAccount.front ? params.front = this.newAccount.front : delete params.front;
            this.newAccount.back ? params.back = this.newAccount.back : delete params.back;
            delete params.idCardfront;
            delete params.idCardback;
            let fd = new FormData();
            let keys = Object.keys(params);
            keys.forEach(key => {
              fd.append(key, params[key])
            });
            if (params.id) {
              updateChannelAccount(fd).then(response => {
                this.handleConfirm(response, '编辑成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            } else {
              addChannelAccount(fd).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            }
          } else {
            return false;
          }
        })
      },

      handleEdit(row) {
        this.newAccountVisible = true;
        this.resetFields('newAccount');
        this.newAccountMode = 'edit';
        this.newAccountTitle = '编辑账号';
        this.getAccountDetail(row);
      },
      handleCheckDetail(row) {
        this.newAccountVisible = true;
        this.resetFields('newAccount');
        this.newAccountMode = 'check';
        this.newAccountTitle = '查看账号';
        this.getAccountDetail(row);

      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: message
          });
          this.newAccountVisible = false;
          this.searchParams.pageNum = 1;
          this.getAccountList();
        }
      },
      getAccountList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        search.channelId = this.channelId;
        if (search.channelId === undefined) {
          delete search.channelId;
          if (this.searchParams.channelId) {
            search.channelId = this.searchParams.channelId
          }
        } else if (this.channelId && this.searchParams.channelId) {
          search.channelId = this.searchParams.channelId
        } else {
          delete search.channelId;
        }
        getAccountList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].accountStatus == false) {
                this.list[i].accountStatus = '启用'
              } else {
                this.list[i].accountStatus = '停用'
              }
            }
            this.total = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getAccountList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getAccountList()
      },
      keyupSubmit() {
        document.onkeydown = e => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            e.preventDefault();
            this.getAccountList()
          }
        }
      },
    },
    created() {
      this.channelId = this.$route.query.id || null;
      this.keyupSubmit();
      if (this.channelId === null) {
        delete this.channelId;
      } else if (this.channelId) {
        this.searchParams.channelId = parseInt(this.channelId)
      }
      this.channelAccess();
      this.getAccountList();
    },
  }
</script>
<style>
  .colorGray {
    color: #c0c4cc;
  }

  .maxLength {
    width: 80%;
  }

  .divDisplay {
    display: inline;
    margin-left: 15px;
  }
</style>