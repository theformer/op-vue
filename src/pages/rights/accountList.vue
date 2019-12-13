<template>
  <div>
    <pt-search :items="items" :params="searchParams"></pt-search>
    <div class="pt-table margin-top20 inside-margin">
      <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
        <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
        <el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label"
                         :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column label="更新/添加时间">
          <template slot-scope="scope">
            <div>{{scope.row.updatedTime}}</div>
            <div class="create-date">{{scope.row.createdTime}}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop"
                         :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="修改">
              <el-button type="text" icon="el-icon-edit" class="btn-operation"
                         @click="handleEdit(scope.row)" v-if="$hasButton('rights-account-edit')"></el-button>
            </el-tooltip>
            <el-tooltip content="删除">
              <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete"
                         @click="handleDelete(scope.row)" v-if="$hasButton('rights-account-delete')"></el-button>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="searchLoading"
      ></el-pagination>
    </div>

    <el-dialog :title="accountDetailTitle" :visible.sync="accountVisible" append-to-body width="40%"
               :close-on-click-modal="false">
      <el-form :model="accountDetail" label-width="100px" :rules="accountRules" ref="accountDetail">
        <el-form-item label="姓名" prop="username">
          <el-input v-model.trim="accountDetail.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.trim="accountDetail.phone" :disabled="this.mode ==='edit'"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles" class="required">
          <el-checkbox-group v-model="accountDetail.roles">
            <el-checkbox v-for="role in roleData" :label="role.id.toString()" :key="role.id">{{role.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="accountStatus">
          <el-radio-group v-model="accountDetail.accountStatus">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAccount"
                   :disabled="!accountDetail.phone  || !accountDetail.roles.length || !accountDetail.username || saveLoading"
                   :loading="saveLoading">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAccountList,
    querySysAccount,
    getRoleList,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountDetail
  } from '@/service/rights/rights'
  /*
  * 系统管理员的角色id是1，渠道管理员是2，渠道业务员是3
  * */
  export default {
    name: "accountList",
    data() {
      const statusFilterMap = {true: '停用', false: '启用'};
      return {
        list: [],
        baseNum: 1,
        originalVal: '',
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        accountVisible: false,
        accountDetailTitle: '添加账号',
        accountDetail: {
          roles: []
        },
        mode: '',
        accountRules: {
          roles: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          accountStatus: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入汉字', trigger: 'blur'},
            {min: 2, max: 14, message: '长度在2-14个汉字', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
        },
        columns: {
          left: [
            {label: '账号', prop: 'phone'},
            {label: '姓名', prop: 'username'},
            {
              label: '角色', prop: 'roleList',
              formatter: (row, col, val) => {
                if (val && val.length) {
                  return val.join('，')
                } else {
                  return val
                }
              }
            },
            {label: '创建人', prop: 'createdByPhone'}
          ],
          right: [
            {
              label: '状态', prop: 'accountStatus',
              formatter: (row, col, val) => statusFilterMap[val]
            }
          ]
        },
        total: 0,
        roleData: [],
        accountSearchRules: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: this.$valid.phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ]
        },
        accountSearchParams: {},
        accountSearchLoading: false,
        accountColumns: [
          {label: '手机号码', prop: 'phone'},
          {label: '姓名', prop: 'realName'}
        ],
        accountList: [],
        saveLoading: false,
        searchLoading: false,
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '账号', key: 'phone', placeholder: ''},
          {type: 'input', label: '姓名', key: 'username', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearch, disabled: this.searchLoading},
              {label: '重置', function: this.handleResetSearch},
            ]
          },
          {
            type: 'rightButtonGroup',
            buttons: [
              {label: '+添加账号', type: 'primary', function: this.handleAddAccount, hidden: !this.$hasButton('rights-account-add')}
            ]
          }
        ]
      }
    },
    methods: {
      getList() {
        const search = this.$deepcopy(this.searchParams);
        search.accountType = 1;// 机构账户
        this.searchLoading = true;
        getAccountList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.total = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      // 获取角色列表
      getRoleData() {
        getRoleList({pageNum: 1, pageSize: 500}).then(res => {
          if (res.code === '200') {
            this.roleData = res.body.list.filter(ele => {
              return ele.id !== 2 && ele.id !== 3
            });
          }
        })
      },
      keyupSubmit() {
        document.onkeydown = e => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            e.preventDefault();
            if (!this.accountVisible) {
              this.handleClickSearch()
            }
          }
        }
      },
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize
        }
      },
      handleClickSearch() {
        this.searchParams.pageNum = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList()
      },
      resetFields(form = 'accountDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      //添加账号
      handleAddAccount() {
        this.mode = 'add';
        this.resetFields();
        this.resetFields('accountSearchParams');
        this.saveLoading = false;
        this.getRoleData();
        this.accountVisible = true;
        this.accountDetailTitle = '添加账号';
        this.accountDetail = {
          roles: [],
          accountStatus: false
        };
        this.accountList = [];
        this.accountSearchParams = {};
      },
      handleEdit(row) {
        this.mode = 'edit';
        this.accountList = [];
        this.resetFields();
        this.saveLoading = false;
        this.getRoleData();
        getAccountDetail(row.accountId, '', row.accountType).then(response => {
          if (response.code === '200') {
            this.accountVisible = true;
            this.accountDetailTitle = '修改账号';
            let data = response.body;
            this.accountDetail = {
              id: data.id,
              accountId: data.accountId,
              phone: data.phone,
              roles: data.roleList || [],
              accountStatus: data.accountStatus,
              username: data.username
            };
            this.accountList = [{
              phone: data.phone,
              realName: data.username
            }]
          }
        })
      },
      // 查询是否存在该账号
      handleQuerySysAccount() {
        this.$refs.accountSearchParams.validate((valid) => {
          if (valid) {
            this.accountSearchLoading = true;
            querySysAccount(this.accountSearchParams.phone).then(response => {
              if (response.code === '200' && response.body && response.body.userId) {
                this.accountDetail.phone = response.body.phone;
                this.accountDetail.userId = response.body.userId;
                this.accountDetail.username = response.body.realName;
                this.accountList = [{
                  phone: response.body.phone,
                  realName: response.body.realName
                }]
              } else {
                this.accountDetail.phone = '';
                this.accountDetail.userId = '';
                this.accountDetail.username = '';
                this.accountList = []
              }
              this.accountSearchLoading = false;
            }, () => {
              this.accountDetail.phone = '';
              this.accountDetail.userId = '';
              this.accountDetail.username = '';
              this.accountList = [];
              this.accountSearchLoading = false;
            })
          }
        })
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: "success",
            message: message
          });
          this.accountVisible = false;
          this.searchParams.pageNum = 1;
          this.getList();
        }
        this.saveLoading = false;
      },
      handleSaveAccount() {
        this.$refs.accountDetail.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            const params = this.$deepcopy(this.accountDetail);
            params.accountType = 1;// 机构账户
            if (!this.accountDetail.id) {
              addAccount(params).then(response => {
                this.handleConfirm(response, "添加成功");
              }, () => {
                this.saveLoading = false;
              })
            } else {
              updateAccount(params).then(response => {
                this.handleConfirm(response, "修改成功");
              }, () => {
                this.saveLoading = false;
              });
            }
          } else {
            return false;
          }
        })
      },
      handleDelete(row) {
        this.$alert('是否删除该账号?', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '再想想',
          showCancelButton: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              // 确认删除
              deleteAccount(row.id).then(response => {
                if (response.code === '200') {
                  this.$message({
                    showClose: true,
                    type: 'success',
                    message: '删除成功'
                  });
                  this.getList()
                }
              })
            }
          }
        });
      }
    },
    created() {
      this.keyupSubmit();
      this.getList()
    }
  }
</script>

<style lang="scss">
  .pt-search {
    background: #F6F7FB;
    padding-top: 15px;

    .value-width {
      width: 220px !important;
    }

    .pb_15 {
      padding-bottom: 15px;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .show-more {
      text-align: center;
      width: 100%;
      height: 15px;
      margin-top: -10px;

      .more {
        display: inline-block;
        width: 10px;
        height: 10px;
      }
    }
  }
</style>