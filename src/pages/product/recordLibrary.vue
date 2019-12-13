<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="用户公司信息">
                <pt-search :items="userItems" :params="search" :label-width="150"></pt-search>
                <div class="pt-table margin-top20 inside-margin">
                    <el-table :data="userList" header-cell-class-name="thead" cell-class-name="tbody">
                        <el-table-column label="序号" type="index" width="50" fixed="left"
                                         :index="baseUserNumber"></el-table-column>
                        <el-table-column v-for="(column,index) in userColumn" :key="index" :prop="column.prop"
                                         :label="column.label"
                                         :formatter="column.formatter" :width="column.width"></el-table-column>
                        <el-table-column label="更新/添加时间">
                            <template slot-scope="scope">
                                <div>{{scope.row.updatedTime}}</div>
                                <div class="create-date">{{scope.row.createdTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(column,index) in userRight" :key="'inf0'+index" :prop="column.prop"
                                         :label="column.label"
                                         :formatter="column.formatter" :width="column.width"></el-table-column>
                        <el-table-column label="操作" fixed="right" width="200">
                            <template slot-scope="scope">
                                <el-tooltip content="修改">
                                    <el-button type="text" icon="el-icon-edit" class="btn-operation"
                                               @click="handleUserEdit(scope.row)" v-if="$hasButton('product-record-user-edit')"></el-button>
                                </el-tooltip>
                                <el-tooltip content="删除">
                                    <el-button type="text" icon="el-icon-delete"
                                               class="btn-operation btn-operation-delete"
                                               @click="handleUserDelete(scope.row)" v-if="$hasButton('product-record-user-delete')"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            layout="jumper, prev, pager, next, sizes, total"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :total="pageTotal||0"
                            :current-page="search.pageNum"
                            @size-change="handleSizeChange($event,'search')"
                            @current-change="handleCurrentChange($event,'search')"
                            :disabled="searchLoading"
                    ></el-pagination>
                </div>
                <el-dialog :title="productDetailTitle" :visible.sync="productUserVisible" append-to-body width="60%"
                           :close-on-click-modal="false">
                    <el-form :model="productUserDetail" label-width="240px" :rules="productUserDetailRule"
                             ref="productUserDetail">
                        <el-form-item label="公司名称：" prop="companyName">
                            <el-input v-model.trim="productUserDetail.companyName"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称字段编号：" prop="companyNameField">
                            <el-input v-model.trim="productUserDetail.companyNameField" readonly="readonly"
                                      @focus="addField('userCompanyNameField')"></el-input>
                        </el-form-item>
                        <el-form-item label="统一社会信用代码：" prop="socialCreditCode">
                            <el-input v-model.trim="productUserDetail.socialCreditCode"></el-input>
                        </el-form-item>
                        <el-form-item label="统一社会信用代码字段编号：" prop="socialCreditCodeField">
                            <el-input v-model.trim="productUserDetail.socialCreditCodeField" readonly="readonly"
                                      @focus="addField('socialCreditUserCodeField')"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="productUserVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleSaveUserProduct" :loading="saveLoading"
                                   :disabled="saveLoading"
                        >保存
                        </el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="保险公司信息">
                <pt-search :items="items" :params="searchParams" :label-width="150"></pt-search>
                <div class="pt-table margin-top20 inside-margin">
                    <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                        <el-table-column label="序号" type="index" width="50" fixed="left"
                                         :index="baseNumber"></el-table-column>
                        <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop"
                                         :label="column.label"
                                         :formatter="column.formatter" :width="column.width"></el-table-column>
                        <el-table-column label="更新/添加时间">
                            <template slot-scope="scope">
                                <div>{{scope.row.updatedTime}}</div>
                                <div class="create-date">{{scope.row.createdTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(column,index) in top" :key="'info2'+index" :prop="column.prop"
                                         :label="column.label"
                                         :formatter="column.formatter" :width="column.width"></el-table-column>
                        <el-table-column label="操作" fixed="right" width="200">
                            <template slot-scope="scope">
                                <el-tooltip content="修改">
                                    <el-button type="text" icon="el-icon-edit" class="btn-operation"
                                               @click="handleEdit(scope.row)" v-if="$hasButton('product-record-insurance-edit')"></el-button>
                                </el-tooltip>
                                <el-tooltip content="删除">
                                    <el-button type="text" icon="el-icon-delete"
                                               class="btn-operation btn-operation-delete"
                                               @click="handleDelete(scope.row)" v-if="$hasButton('product-record-insurance-delete')"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            layout="jumper, prev, pager, next, sizes, total"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :total="listPageTotal||0"
                            :current-page="searchParams.pageNum"
                            @size-change="handleSizeChange($event,'searchParams')"
                            @current-change="handleCurrentChange($event,'searchParams')"
                            :disabled="fieldSearchLoading"
                    ></el-pagination>
                </div>
                <el-dialog :title="productDetailTitle" :visible.sync="productVisible" append-to-body width="60%"
                           :close-on-click-modal="false">
                    <el-form :model="productDetail" label-width="240px" :rules="productRules" ref="productDetail">
                        <el-form-item label="保险公司全称：" prop="companyName">
                            <el-input v-model.trim="productDetail.companyName"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司全称字段编号：" prop="companyNameField">
                            <el-input v-model.trim="productDetail.companyNameField" readonly="readonly"
                                      @focus="addField('companyNameField')"></el-input>
                        </el-form-item>
                        <el-form-item label="开户银行名称：" prop="openBankName">
                            <el-input v-model.trim="productDetail.openBankName"></el-input>
                        </el-form-item>
                        <el-form-item label="开户银行名称字段编号：" prop="openBankNameField">
                            <el-input v-model.trim="productDetail.openBankNameField" readonly="readonly"
                                      @focus="addField('openBankNameField')"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司开户名：" prop="companyOpenName">
                            <el-input v-model.trim="productDetail.companyOpenName"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司开户名字段编号：" prop="companyOpenNameField">
                            <el-input v-model.trim="productDetail.companyOpenNameField" readonly="readonly"
                                      @focus="addField('companyOpenNameField')"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司账号：" prop="companyAccount">
                            <el-input v-model.trim="productDetail.companyAccount"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司账号字段编号：" prop="companyAccountField">
                            <el-input v-model.trim="productDetail.companyAccountField" readonly="readonly"
                                      @focus="addField('companyAccountField')"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="productVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleSaveProduct" :loading="dataSourceLoading"
                                   :disabled="dataSourceLoading"
                        >保存
                        </el-button>
                    </div>
                </el-dialog>
                <el-dialog title="添加字段" :visible.sync="fieldVisible" append-to-body width="60%"
                           :close-on-click-modal="false"  ref="dialogForm"  @close="closeDialog" >
                    <pt-search :items="fieldParamsItems" :params="fieldParams" width="135"></pt-search>
                    <div class="pt-table margin-top20">
                        <el-table :data="addFieldList" header-cell-class-name="thead" cell-class-name="tbody"
                                  @row-dblclick="handleSaveField">
                            <el-table-column fixed label="双击记录自动添加" width="140" align="center" type="index" :index="baseNum">
                            </el-table-column>
                            <el-table-column label="字段编号" prop="fieldNumber"></el-table-column>
                            <el-table-column label="字段名称" prop="fieldName"></el-table-column>
                            <el-table-column label="字段类型" prop="fieldType"
                                             :formatter="(row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.FieldTypeEnum)"></el-table-column>
                        </el-table>
                        <el-pagination
                                background
                                layout="jumper, prev, pager, next, sizes, total"
                                :page-sizes="[10, 20, 30, 50, 100]"
                                :total="pageTotals||0"
                                :current-page="fieldParams.pageNum"
                                @size-change="handleSizeChange($event,'fieldParams')"
                                @current-change="handleCurrentChange($event,'fieldParams')"
                        ></el-pagination>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import {
    addUserRecordLibrary, getAllUserList, searchUserList, deleteUserRecord, updateUserRecord,
    addInsuranceRecord, getInsuranceList, getInsuranceRecord, delectInsuranceRecord, updateInsuranceRecord, getFieldList
  } from '../../service/product/product'

  export default {
    name: "recordLibrary",
    data() {
      return {
        baseNumber: 1,
        baseUserNumber: 1,
        baseNum: 1,
        pageTotal: 0,
        pageTotals: 0,
        listPageTotal: 0,
        fieldParams: {
          pageNum: 1,
          pageSize: 10,
        },
        userList: [],
        list: [],
        addFieldList: [],
        companyNameField:'',
        fieldVisible: false,
        fieldSearchLoading:false,
        searchLoading: false,
        saveLoading: false,
        dataSourceLoading: false,
        productDetailTitle: '添加备案',
        productVisible: false,
        productUserVisible: false,
        userItems: [
          {type: 'input', label: '公司名称', key: 'companyName', placeholder: '',},
          {type: 'input', label: '统一社会信用代码', key: 'socialCreditCode', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickUserSearch,disabled: this.searchLoading},
              {label: '重置', function: this.handleResetUserSearch},
            ]
          },
          {
            type: 'rightButtonGroup',
            buttons: [
              {label: '新增备案', type: 'primary', function: this.handleAddUserRecord, hidden: !this.$hasButton('product-record-user-add')}
            ]
          }
        ],
        items: [
          {type: 'input', label: '保险公司全称', key: 'companyName', placeholder: '',},
          {type: 'input', label: '开户银行名称', key: 'openBankName', placeholder: ''},
          {type: 'input', label: '保险公司开户名', key: 'companyOpenName', placeholder: ''},
          {type: 'input', label: '保险公司账号', key: 'companyAccount', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearch,disabled: this.fieldSearchLoading},
              {label: '重置', function: this.handleResetSearch},
            ]
          },
          {
            type:'rightButtonGroup',
            buttons:[
              {label:'新增备案',type:'primary',function:this.handleAddRecord, hidden: !this.$hasButton('product-record-insurance-add')}
            ]
          }
        ],
        fieldParamsItems: [
          {type: 'input', label: '字段编号', key: 'fieldNumber', placeholder: '',},
          {type: 'input', label: '字段名称', key: 'fieldName', placeholder: '',},
          {
            type: 'select',
            label: '字段类型',
            key: 'fieldType',
            placeholder: '',
            options: this.$store.state.enums.FieldTypeEnum
          },
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleFieldClickSearch,},
            ]
          },
        ],
        userColumn: [
          {label: '公司名称', prop: 'companyName'},
          {label: '统一社会信用代码', prop: 'socialCreditCode'},
        ],
        userRight: [
          {label: '最后操作人', prop: 'updatedByName'}
        ],
        columns: [
          {label: '保险公司全称', prop: 'companyName'},
          {label: '开户银行名称', prop: 'openBankName'},
          {label: '保险公司开户名', prop: 'companyOpenName'},
          {label: '保险公司账号', prop: 'companyAccount'},
        ],
        top: [
          {label: '最后操作人', prop: 'updatedByName'},
        ],
        pagination: {
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        searchParams: {pageNum: 1, pageSize: 10},
        search: {pageNum: 1, pageSize: 10},
        productDetail: {
          companyAccount: '',
          companyAccountField: '',
          companyName: '',
          companyNameField: '',
          companyOpenName: '',
          companyOpenNameField: '',
          openBankName: '',
          openBankNameField: ''
        },
        productUserDetail: {
          companyName: '',
          companyNameField: '',
          socialCreditCode: '',
          socialCreditCodeField: ''
        },
        productUserDetailRule: {
          companyName: [{required: true, message: "请输入公司名称", trigger: "blur"}],
          companyNameField: [{required: true, message: "请输入公司名称字段编号", trigger: "onchange"}],
          socialCreditCode: [{required: true, message: "请输入统一社会信用代码", trigger: "blur"}],
          socialCreditCodeField: [{required: true, message: "请输入统一社会信用代码字段编号", trigger: "onchange"}]
        },
        productRules: {
          companyAccount: [{required: true, message: "请输入保险公司账号", trigger: "blur"}],
          companyAccountField: [{required: true, message: "请输入保险公司账号字段信息", trigger: "onchange"}],
          companyName: [{required: true, message: "请输入保险公司全称", trigger: "blur"}],
          companyNameField: [{required: true, message: "请输入保险公司全称字段编号", trigger: "onchange"}],
          companyOpenName: [{required: true, message: "请输入保险公司开户名", trigger: "blur"}],
          companyOpenNameField: [{required: true, message: "请输入保险公司开户名字段编号", trigger: "onchange"}],
          openBankName: [{required: true, message: "请输入开户银行名称", trigger: "blur"}],
          openBankNameField: [{required: true, message: "请输入开户银行名称字段信息", trigger: "onchange"}],
        }
      }
    },
    methods: {
      keyupSubmit() {
        document.onkeydown = e => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            e.preventDefault()
            if (this.productUserVisible) {
              this.handleClickUserSearch();
            } else {
              this.handleClickSearch();
            }
          }
        }
      },
      closeDialog(){
       this.fieldParams = {
         pageNum:1,
         pageSize:10
       }
      },
      addField(userCompanyNameField) {
        this.fieldVisible = true;
        const search = this.$deepcopy(this.fieldParams);
        getFieldList(search).then(res => {
          if (res.code === '200') {
            this.addFieldList = res.body.list;
            this.pageTotals = res.body.total;
            this.companyNameField = userCompanyNameField;
            this.baseNum = 1 + (this.fieldParams.pageNum - 1) * this.fieldParams.pageSize;
          }else if (res.code === 'FIELD_LIBRARY_UNRELATED_FIELD') {
            this.$message({
              showClose: true,
              type: 'error',
              message: res.message
            });
            this.addFieldList = [];
            this.pageTotals = 0;
            this.baseNum = 1;
          }
        }).finally(() => {
        })

      },
      searchUserList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.search);
        searchUserList(search).then(res => {
          if (res.code === '200') {
            this.userList = res.body.list;
            this.pageTotal = res.body.total;
            this.baseUserNumber = 1 + (this.search.pageNum - 1) * this.search.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      getInsuranceRecord() {
        this.fieldSearchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getInsuranceRecord(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.listPageTotal = res.body.total;
            this.baseNumber = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.fieldSearchLoading = false
        })
      },

      handleSizeChange(pageSize, type) {
        this[type]['pageSize'] = pageSize;
        if (type === 'search') {
          this.searchUserList();
        } else if(type === 'searchParams') {
          this.getInsuranceRecord()
        }else {
          this.addField(this.companyNameField)
        }
      },
      handleCurrentChange(pageNum, type) {
        this[type]['pageNum'] = pageNum;
        if (type === 'search') {
          this.searchUserList();
        } else if(type === 'searchParams') {
          this.getInsuranceRecord()
        }else {
          this.addField(this.companyNameField)
        }
      },
      resetFields(form = 'productUserDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      resetField(form = 'productDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      handleFieldClickSearch() {
        this.fieldParams.pageNum = 1;
        this.addField(this.companyNameField)
      },
      handleClickSearch() {
        this.searchParams.pageNum = 1;
        this.getInsuranceRecord()
      },
      handleClickUserSearch() {
        this.search.pageNum = 1;
        this.searchUserList();
      },
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize
        }
      },
      handleResetUserSearch() {
        this.search = {
          pageNum: this.search.pageNum,
          pageSize: this.search.pageSize
        }
      },
      handleEdit(row) {
        this.resetField();
        this.fieldSearchLoading = false;
        this.productVisible = true;
        this.productDetailTitle = '修改备案';
        this.productDetail = {};
        this.getInsuranceList(row)
      },
      handleUserEdit(row) {
        this.resetFields();
        this.saveLoading = false;
        this.productUserVisible = true;
        this.productDetailTitle = '修改备案';
        this.productUserDetail = {};
        this.getAllUserList(row)

      },
      getInsuranceList(row) {
        getInsuranceList({id: row.id}).then(res => {
          if (res.code === '200') {
            this.productDetail = res.body
          }
        })
      },
      getAllUserList(row) {
        getAllUserList({id: row.id}).then(res => {
          if (res.code === '200') {
            this.productUserDetail = res.body
          }
        })
      },
      handleExport() {

      },
      handleUserExport() {

      },
      handleAddRecord() {
        this.resetField();
        this.saveLoading = false;
        this.productVisible = true;
        this.productDetailTitle = '添加备案';
        this.productDetail = {
          companyAccount: '',
          companyAccountField: '',
          companyName: '',
          companyNameField: '',
          companyOpenName: '',
          companyOpenNameField: '',
          openBankName: '',
          openBankNameField: ''
        };

      },
      handleAddUserRecord() {
        this.resetFields();
        this.fieldSearchLoading = false;
        this.productUserVisible = true;
        this.productDetailTitle = '添加备案';
        this.productUserDetail={
          companyName: '',
          companyNameField: '',
          socialCreditCode: '',
          socialCreditCodeField: ''
        }
      },
      handleSaveProduct() {
        this.$refs.productDetail.validate(valid => {
          if (valid) {
            this.dataSourceLoading = true;
            const params = this.$deepcopy(this.productDetail);
            if (!this.productDetail.id) {
              addInsuranceRecord(params).then(res => {
                this.handleConfirms(res, "添加成功");
              }).finally(() => {
                this.dataSourceLoading = false;
              });
            } else {
                this.dataSourceLoading = true;
                updateInsuranceRecord(params).then(res => {
                  this.handleConfirms(res, "编辑成功");
                  this.dataSourceLoading = true;
                }).finally(() => {
                  this.dataSourceLoading = false;
                });
            }
          } else {
            return false;
          }
        })
      },
      handleSaveUserProduct() {
        this.$refs.productUserDetail.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            const params = this.$deepcopy(this.productUserDetail);
            if (!this.productUserDetail.id) {
              addUserRecordLibrary(params).then(res => {
                this.handleConfirm(res, "添加成功");
              }).finally(() => {
                this.saveLoading = false;
              });
            } else {
                this.saveLoading = true;
                updateUserRecord(params).then(res => {
                  this.handleConfirm(res, "编辑成功");
                  this.saveLoading = true;
                }).finally(() => {
                  this.saveLoading = false;
                });
            }
          }
            else {
            return false;
          }
        })
      },
      handleUserDelete(row) {
        this.$alert('是否删除备案', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '再想想',
          showCancelButton: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              // 确认删除
              deleteUserRecord(row.id).then(res => {
                if (res.code === '200') {
                  this.$message({
                    showClose: true,
                    type: 'success',
                    message: '删除成功'
                  });
                  this.searchUserList();
                }
              });
            }
          }
        })
      },
      handleDelete(row) {
        this.$alert('是否删除备案', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '再想想',
          showCancelButton: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              // 确认删除
              delectInsuranceRecord(row.id).then(res => {
                if (res.code === '200') {
                  this.$message({
                    showClose: true,
                    type: 'success',
                    message: '删除成功'
                  });
                  this.getInsuranceRecord();
                }
              });
            }
          }
        })
      },
      // 双击添加字段
      handleSaveField(row) {
        // 判断字段是否添加过
        for (let i = 0, len = this.addFieldList.length; i < len; i++) {
          if (this.addFieldList[i].fieldId === row.fieldNumber) {
            this.$alert('该字段已添加，请勿重复添加', '提示', {
              confirmButtonText: '关闭',
              callback: () => {
              }
            });
            return false;
          }
        }
        this.addFieldList.unshift(row);
        if(this.companyNameField === 'userCompanyNameField'){
          this.productUserDetail.companyNameField = this.addFieldList[0].fieldNumber;
        }else if(this.companyNameField === 'socialCreditUserCodeField'){
          this.productUserDetail.socialCreditCodeField = this.addFieldList[0].fieldNumber;
          }
           else if(this.companyNameField === 'companyNameField'){
          this.productDetail.companyNameField = this.addFieldList[0].fieldNumber;
          }
        else if(this.companyNameField === 'openBankNameField'){
          this.productDetail.openBankNameField = this.addFieldList[0].fieldNumber;
        }
        else if(this.companyNameField === 'companyOpenNameField'){
          this.productDetail.companyOpenNameField = this.addFieldList[0].fieldNumber;
        }
        else {
          this.productDetail.companyAccountField = this.addFieldList[0].fieldNumber;
        }
        this.fieldVisible = false;
      },
      handleConfirm(res, message) {
        if (res.code === '200') {
          this.$message({
            showClose: true,
            type: "success",
            message: message
          });
          this.productUserVisible = false;
          this.search.pageNum = 1;
          this.searchUserList();
        }
      },
      handleConfirms(res, message) {
        if (res.code === '200') {
          this.$message({
            showClose: true,
            type: "success",
            message: message
          });
          this.productVisible = false;
          this.searchParams.pageNum = 1;
          this.getInsuranceRecord();
        }
      }
    },
    created() {
      this.keyupSubmit();
      this.searchUserList();
      this.getInsuranceRecord()
    }
  }
</script>
<style>
    .button-operation-zone{
        margin-top: 25px;
    }
</style>