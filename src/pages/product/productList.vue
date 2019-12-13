<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNumber"></el-table-column>
                <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop"
                                 :label="column.label"
                                 :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-dropdown @command="handleEnable"
                                     :class="{'column-text-red': scope.row.status === '0', 'column-text-green': scope.row.status === '1'}">
              <span><i class="iconfont icon-dian"></i>{{scope.row.status === '0'?'下架':'上架'}}<i
                      class="el-icon-caret-bottom icon-blue"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{status: scope.row.status, row: scope.row}">
                                    {{scope.row.status ==='1' ?
                                    '下架':
                                    '上架'}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑">
                            <el-button type="text" icon="el-icon-edit" class="btn-operation"
                                       @click="handleEdit(scope.row)" v-if="$hasButton('product-product-edit')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看">
                            <el-button type="text" icon="el-icon-view" class="btn-operation"
                                       @click="handleCheckDetail(scope.row)" v-if="$hasButton('product-product-check')"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="jumper, prev, pager, next, sizes, total"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :total="pagination.total || 0"
                    :current-page="searchParams.pageNum"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :disabled="searchLoading"
            ></el-pagination>
        </div>

        <el-dialog :title="productDetailTitle" :visible.sync="productVisible" append-to-body width="60%"
                   :close-on-click-modal="false">
            <el-form :model="productDetail" label-width="120px" :rules="productRules" ref="productDetail"
                     :disabled="mode === 'check'" :hide-required-asterisk="mode === 'check'">
                <template v-if="mode !=='add'">
                <el-form-item label="产品编号" prop="productNo">
                    <el-input v-model.trim="productDetail.productNo" disabled></el-input>
                </el-form-item>
            </template>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="产品类型" prop="productType">
                            <el-select v-model="productDetail.productType" placeholder="请选择产品类型">
                                <el-option v-for="item in $store.state.enums.ProductType" :key="item.value" :label="item.text"
                                   :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="本息偿还方式" prop="repayMethod">
                            <el-select v-model="productDetail.repayMethod" placeholder="请选择本息偿还方式">
                                <el-option v-for="item in $store.state.enums.RepayType" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保证金用途" prop="depositUse" v-if="productDetail.loanPattern ==='margin'">
                            <el-input v-model.trim="productDetail.depositUse"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品模式">
                            <el-select v-model="productDetail.loanPattern" placeholder="请选择产品模式" clearable
                                       @change="handleChangeLoanPattem">
                                <el-option v-for="item in $store.state.enums.LoanPatternEnum" :key="item.value"
                                           :label="item.text"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="productDetail.loanPattern ==='margin'">
                        <el-form-item label="保证金百分比" prop="loanMarginRatio">
                            <el-input v-model.trim="productDetail.loanMarginRatio">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="productDetail.loanPattern ==='payment'">
                        <el-form-item label="首付款百分比" prop="loanRatioDownPayment">
                            <el-input v-model.trim="productDetail.loanRatioDownPayment">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model.trim="productDetail.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="借款额度" prop="amountMin" class="required">
                            <el-input v-model.trim="productDetail.amountMin">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="padding_top_left">
                        ----
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label=" " prop="amountMax" id="product-amount-max">
                            <el-input v-model.trim="productDetail.amountMax">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="借款期限/费率" class="required">
                    <el-row v-for="(item,index) in displayProductDetailList" :key="index" class="loanProductTermsTop">
                        <el-col :span="8">
                            <el-form-item label="" :prop="'loanProductTermNo' + index"
                                          :rules="productRules.loanProductTermNo">
                                <el-input v-model="item.termNo">
                                    <template slot="append">期</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="费率" :prop="'loanProductTermRate' + index"
                                          :rules="productRules.loanProductTermRate">
                                <el-input v-model="item.termRate">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" class="deleteButton">
                            <el-button type="danger" icon="el-icon-delete"
                                       v-if="mode !=='check' && displayProductDetailList.length > 1"
                                       @click="handleClickTerms(item)"
                                       v-model="item.button"></el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2" class="loanTermCenter">
                            <el-button type="primary" @click="handleInput" v-if="mode !=='check'">+</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="关联认证模型" prop="authModelId">
                    <el-select v-model="productDetail.authModelId" placeholder="请选择关联认证模型">
                        <el-option v-for="item in authenticationModels" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联申请表模型" prop="loanApplyModelId">
                    <el-select v-model="productDetail.loanApplyModelId" placeholder="请选择关联申请表模型">
                        <el-option v-for="item in auThenModels" :key="item.id" :label="item.applyName"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联风控模型" prop="loanControlModelId">
                    <el-input v-model.trim="productDetail.loanControlModelId" placeholder="请输入关联风控模型"></el-input>
                </el-form-item>
                <el-form-item label="关联资金方" prop="fundId">
                    <el-select v-model="productDetail.fundId" placeholder="请选择关联资金方">
                        <el-option v-for="item in fundListModels" :key="item.id" :label="item.fundName"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="productDetail.status">
                        <el-radio v-for="option in currentOptions"
                                  :label="option.value"
                                  :key="option.value"
                        >{{ option.text }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="productDetail.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="productVisible = false">{{mode ==='check'? '关闭':'取消'}}</el-button>
                <el-button type="primary" @click="handleSaveProduct" :loading="saveLoading" :disabled="saveLoading"
                           v-if="mode !== 'check'">保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {
    getProductList,
    productAdd,
    getIdentifyManageList,
    productEdit,
    getStatusSwitch,
    fundList,
    getModel,
    productDetatl,
  } from '../../service/product/product'

  export default {
    name: "productList",
    data() {
      let validLoanProductTermNo = (rule, value, callback) => {
        let index = parseInt(rule.field.replace('loanProductTermNo', ''));
        const termNoReg = /^[1-9]\d*$/;
        let termNo = this.displayProductDetailList[index].termNo;
        if (!termNo) {
          return callback('请输入借款期限')
        } else {
          if (!termNoReg.test(termNo)) {
            return callback(new Error('借款期限请输入正整数'));
          } else {
            callback()
          }
        }
      };
      let validLoanProductTermRate = (rule, value, callback) => {
        let index = parseInt(rule.field.replace('loanProductTermRate', ''));
        const termRateReg = /^\d+(\.\d{1,2})?$/;
        let termRate = this.displayProductDetailList[index].termRate;
        if (termRate !== 0 && !termRate) {
          return callback('请输入费率')
        } else {
          if (!termRateReg.test(termRate)) {
            return callback(new Error('费率为正数且最多保留小数点后2位'));
          } else {
            callback()
          }
        }
      };
      let amountMinFir = (rule, value, callback) => {
        this.value = [];
        this.value = this.productDetail.amountMin;
        this.value = Number(this.value);
        if (!this.value) {
          return callback('请输入数字');
        } else if (this.productDetail.amountMax < this.value) {
          return callback('借款金额最小值不能大于最高值')
        } else {
          const reg = /^\d+(\.\d{1,2})?$/;
          if (reg.test(this.value)) {
            callback()
          } else {
            return callback(new Error('借款金额为正数且最多精确至分'))
          }
        }
      };
      let amountMinSec = (rule, value, callback) => {
        this.value = [];
        this.value = this.productDetail.amountMax;
        this.value = Number(this.value);
        if (!this.value) {
          return callback('请输入数字');
        } else if (this.productDetail.amountMin > this.value) {
          return callback('借款金额最小值不能大于最高值')
        } else {
          const reg = /^\d+(\.\d{1,2})?$/;
          if (reg.test(this.value)) {
            callback()
          } else {
            return callback(new Error('借款金额为正数且最多精确至分'))
          }
        }
      };
      return {
        list: [],
        productDetailList: [],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        baseNumber: 1,
        searchLoading: false,
        productVisible: false,
        productDetailTitle: '新增产品',
        productDetail: {
          productName: '',
          productNo: '',
          productType: '',
          remark: '',
          status: '',
          amountMin: [],
          amountMax: [],
          authModelId: '',
          loanApplyModelId: '',
          fundId: '',
          id: '',
          loanControlModelId: '',
          loanPattern: '',
          loanMarginRatio: 10,
          loanProductTerms: [{termNo: '', termRate: ''}],
          loanRatioDownPayment: 10
        },
        currentOptions: [
          {value: '1', text: '上架'},
          {value: '0', text: '下架'}
        ],
        productRules: {
          productType: [
            {required: true, message: '请选择产品类型', trigger: 'change'}
          ],
          repayMethod:[
            {required:true,message:'请选择还款方式', trigger: 'change'}
          ],
          depositUse:[
            {required:true,message:'请输入保证金用途',trigger:'blur'}
          ],
          productName: [
            {required: true, message: '请输入产品名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 50)
              }, trigger: 'blur'
            }
          ],
          amountMin: [
            {validator: amountMinFir, trigger: 'blur'}
          ],
          amountMax: [
            {validator: amountMinSec, trigger: 'blur'}],
          loanProductTermNo: [
            {validator: validLoanProductTermNo, trigger: 'blur'},
          ],
          loanProductTermRate: [
            {validator: validLoanProductTermRate, trigger: 'blur'},
          ],
          authModelId: [
            {required: true, message: '请选择关联认证模型', trigger: 'change'}
          ],
          loanMarginRatio: [
            {required: true, message: '请输入保证金百分比', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.rateRule(rule, value, callback, '保证金百分比')
              }, trigger: "blur"
            }
          ],
          loanRatioDownPayment: [
            {required: true, message: '请输入首付款百分比', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.rateRule(rule, value, callback, '首付款百分比')
              }, trigger: "blur"
            }
          ],
          loanApplyModelId: [
            {required: true, message: '请选择关联申请表模型', trigger: 'change'}
          ],
          loanControlModelId: [
            {required: true, message: '请输入风控模型', trigger: 'blur'}
          ],
          fundId: [
            {required: true, message: '请选择关联资金方', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
          remark: [
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeStrRule(rule, value, callback, 29)
              }, trigger: 'blur'
            }
          ]
        },
        mode: '',
        items: [
          {
            type: 'select',
            label: '产品类型',
            key: 'productType',
            placeholder: '',
            options: this.$store.state.enums.ProductType
          },
          {
            type: 'select',
            label: '产品模式',
            key: 'loanPattern',
            placeholder: '',
            options: this.$store.state.enums.LoanPatternEnum
          },
          {type: 'input', label: '产品编号', key: 'productNo', placeholder: ''},
          {type: 'input', label: '产品名称', key: 'productName', placeholder: ''},
          {type: 'select', label: '状态', key: 'status', placeholder: '', options: this.$store.state.enums.ProductStatus},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearch},
              {label: '重置', function: this.handleResetSearch},
            ]
          },
          {
            type: 'rightButtonGroup',
            buttons: [
              {label: '新增产品', type: 'primary', function: this.handleAddProduct, hidden: !this.$hasButton('product-product-add')}
            ]
          }
        ],
        columns: [
          {label: '产品编号', prop: 'productNo'},
          {label: '产品名称', prop: 'productName'},
          {
            label: '产品类型', prop: 'productType',
            formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.ProductType)

          },
          {
            label: '产品模式', prop: 'loanPattern',
            formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.LoanPatternEnum)

          },
          {label: '发布时间', prop: 'updatedTime'},
          {label: '最后操作人', prop: 'updatedByName'}
        ],
        pagination: {
          total: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        authenticationModels: [],
        auThenModels: [],
        fundListModels: [],
        saveLoading: false
      }
    },
    computed: {
      displayProductDetailList() {
        return this.productDetailList.filter(ele => {
          return !ele.delFlag
        })
      }
    },
    methods: {
      getProductList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getProductList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.pagination.total = res.body.total;
            this.baseNumber = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false
        })
      },
      handleChangeLoanPattem() {
        this.productDetail.loanMarginRatio = 10;
        this.productDetail.loanRatioDownPayment = 10
      },
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            this.handleClickSearch()
          }
        }
      },
      handleInput() {
        let length = this.displayProductDetailList.length;
        if (this.displayProductDetailList[length - 1].termNo) {
          this.productDetailList.push({termNo: ''});
        }
      },
      handleClickTerms(item) {
        this.$set(item, 'delFlag', true)
      },
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize
        }
      },
      handleClickSearch() {
        this.searchParams.pageNum = 1;
        this.getProductList()
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getProductList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getProductList()
      },
      resetFields(form = 'productDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      getModelGather() {
        this.getIdentifyManageList();
        this.getModel();
        this.fundList()
      },
      getIdentifyManageList() {
        getIdentifyManageList().then(res => {
          if (res.code === '200') {
            this.authenticationModels = res.body.list;
          }
        })
      },
      fundList() {
        fundList().then(res => {
          if (res.code === '200') {
            this.fundListModels = res.body;
          }
        })
      },
      getModel() {
        if (this.mode !== 'check')
          getModel({status: 1}).then(res => {
            if (res.code === '200') {
              this.auThenModels = res.body.list;
            }
            let auThenModelsLoanApply = [];
            this.auThenModels.forEach((ele) => {
              auThenModelsLoanApply.push(ele.id)
            });
            if (this.productDetail.loanApplyModelId && !auThenModelsLoanApply.includes(this.productDetail.loanApplyModelId)) {
              this.productDetail.loanApplyModelId = ""
            }
          });
        else {
          getModel().then(res => {
            if (res.code === '200') {
              this.auThenModels = res.body.list;
            }
          })
        }
      },
      //新增产品
      handleAddProduct() {
        this.resetFields();
        this.productVisible = true;
        this.productDetailTitle = '新增产品';
        this.productDetail = {auThenModels: '', loanMarginRatio: 10, loanRatioDownPayment: 10};
        this.mode = 'add';
        this.productDetailList = [{termNo: '', termRate: ''}];
        this.getModelGather();

      },
      handleEdit(row) {
        this.resetFields();
        this.productVisible = true;
        this.productDetailTitle = '编辑产品';
        this.productDetail = row;
        this.mode = 'edit';
        this.productDetailList = [{termNo: '', termRate: ''}];
        this.getProductDetail(row);
      },
      getProductDetail(row) {
        productDetatl({productId: row.id}).then(res => {
          if (res.code === '200') {
            this.productDetail = res.body;
            if (!this.productDetail.loanPattern) {
              this.productDetail.loanMarginRatio = '';
              this.productDetail.loanRatioDownPayment = ''
            } else {
              this.productDetail.loanMarginRatio = this.$floatMultiply(this.productDetail.loanMarginRatio, 100);
              this.productDetail.loanRatioDownPayment = this.$floatMultiply(this.productDetail.loanRatioDownPayment, 100);
            }
            let termArr = this.productDetail.loanProductTerms;
            if (termArr && termArr.length) {
              this.productDetailList = [];
              termArr.forEach((ele) => {
                this.productDetailList.push(Object.assign({}, ele, {termRate: this.$floatMultiply(ele.termRate, 100)}))
              })
            }
          }
          this.getModelGather()
        })
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: "success",
            message: message
          });
          this.productVisible = false;
          this.searchParams.pageNum = 1;
          this.getProductList();
        }
      },
      // 保存按钮
      handleSaveProduct() {
        this.$refs.productDetail.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            const params = this.$deepcopy(this.productDetail);
            params.loanRatioDownPayment = this.$floatDivide(params.loanRatioDownPayment, 100);
            params.loanMarginRatio = this.$floatDivide(params.loanMarginRatio, 100);
            params.loanProductTerms = [];
            if (!params.loanPattern) {
              params.loanPattern = '';
            }
            this.productDetailList.forEach(ele => {
              if (ele.id) {
                params.loanProductTerms.push(Object.assign({}, ele, {termRate: this.$floatDivide(ele.termRate, 100)}))
              } else {
                if (ele.termNo && !ele.delFlag) {
                  if (!params.loanProductTerms.some(item => {
                    return item.termNo === parseInt(ele.termNo)
                  })) {
                    params.loanProductTerms.push(Object.assign({}, ele, {termRate: this.$floatDivide(ele.termRate, 100)}))
                  }
                }
              }
            });
            if (!this.productDetail.id) {
              productAdd(params).then(response => {
                this.handleConfirm(response, "添加成功");
              }).finally(() => {
                this.saveLoading = false
              });
            } else {
              if (valid) {
                this.saveLoading = true;
                productEdit(params).then(response => {
                  this.handleConfirm(response, "编辑成功");
                  this.saveLoading = true;
                }).finally(() => {
                  this.saveLoading = false
                });
              }
            }
          } else {
            return false;
          }
        })
      },
      // 启用停用申请表
      handleEnable(command) {
        const params = {
          productId: command.row.id
        };
        getStatusSwitch(params).then(res => {
          if (res.code === '200') {
            this.getProductList()
          }
        })
      },
      handleCheckDetail(row) {
        this.resetFields();
        this.productVisible = true;
        this.productDetailTitle = '查看产品';
        this.productDetailList = [{termNo: row.termNo}];
        this.productDetail = row;
        this.mode = 'check';
        this.getProductDetail(row);

      }
    }
    ,
    created() {
      this.keyupSubmit();
      this.getProductList();
    }
  }
</script>

<style scoped lang="scss">
    .center {
        /*margin-left: 80px;*/
        margin-top: 15px;
        text-align: center;

    }

    .deleteButton {
        margin-left: 5px;
    }

    .loanTermCenter {
        text-align: center;
        margin-left: 20px;
        margin-top: 5px;
    }

    .loanProductTermsTop {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .padding_top_left {
        padding-left: 4%;
        padding-top: 1%;
    }
</style>