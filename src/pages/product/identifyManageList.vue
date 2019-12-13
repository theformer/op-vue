<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
                <el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="更新/添加时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.updatedTime}}</div>
                        <div class="create-date">{{scope.row.createdTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-tooltip content="修改">
                            <el-button type="text" icon="el-icon-edit" class="btn-operation" @click="handleEdit(scope.row)" v-if="$hasButton('product-identify-edit')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看">
                            <el-button type="text" icon="el-icon-view" class="btn-operation" @click="handleCheckDetail(scope.row)" v-if="$hasButton('product-identify-check')"></el-button>
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

        <el-dialog :title="identifyDetailTitle" :visible.sync="identifyVisible" append-to-body :close-on-click-modal="false">
            <el-form :model="identifyDetail" label-width="110px" :rules="identifyRules" ref="identifyDetail" :disabled="mode === 'check'" :hide-required-asterisk="mode === 'check'">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="认证模型编号" prop="code" v-if="mode !== 'add'">
                            <el-input v-model.trim="identifyDetail.code" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="认证模型名称" prop="name">
                            <el-input v-model.trim="identifyDetail.name" placeholder="请输入认证模型名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="选择认证类型" :class="{'required': mode !== 'check'}">
                    <span class="red" v-if="mode !== 'check'">注意事项：如须配置【存管开户认证】,则必须配置【绑卡认证】,且序号必须在【存管开户认证】之前</span>
                    <div class="pt-table">
                        <el-table :data="identifyAuthItem" header-cell-class-name="thead" cell-class-name="tbody">
                            <el-table-column label="序号" width="120" fixed="left">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model.trim.number="scope.row.sequenceNumber" :class="{'invalid-input': !isValidSequenceNumber(scope.row)}"></el-input>
                                    <div class="number-error-tip" v-show="!isValidSequenceNumber(scope.row)">请输入正确的序号</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="认证名称">
                                <template slot-scope="scope">
                                    <span v-if="mode === 'check'">{{scope.row.name}}</span>
                                    <el-checkbox v-else v-model="scope.row.isNeed" @change="handleChangeAuthItem">{{scope.row.name}}</el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否必填">
                                <template slot-scope="scope">
                                    <span v-if="mode === 'check'">{{scope.row.flag ? '必填': '非必填'}}</span>
                                    <el-checkbox v-else v-model="scope.row.flag">必填</el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <span class="red" v-if="showErrorTip && mode !== 'check'">请选择认证类型</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="identifyVisible = false">{{mode ==='check'? '关闭':'取消'}}</el-button>
                <el-button type="primary" @click="handleSaveIdentify" :loading="saveLoading" :disabled="saveLoading" v-if="mode !== 'check'">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {getIdentifyManageList, getIdentifyModelDetail, addIdentifyModel, updateIdentifyModel, getAllAuthItem} from '@/service/product/product'
  export default {
    name: "identifyManageList",
    data() {
      return {
        list: [],
        baseNum: 1,
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        allAuthItem: [],
        identifyAuthItem: [],
        mode: '',
        identifyVisible: false,
        identifyDetailTitle: '',
        identifyDetail: {},
        identifyRules: {
          name: [
            {required: true, message: '请输入认证模型名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 14)
              }, trigger: 'blur'
            }
          ],
        },
        sequenceNumberValid: true,// 序号是否输入有误
        columns: {
          left: [
            {label: '认证流程编号', prop: 'code'},
            {label: '认证流程名称', prop: 'name'},
            {label: '关联认证个数', prop: 'relationAuthItemNum'},
            {label: '关联产品数', prop: 'relationProductNum'}
          ],
          right: [
            {label: '最后操作人', prop: 'updatedByName'}
          ]
        },
        total: 0,
        saveLoading: false,
        showErrorTip: false,
        searchLoading: false
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '认证流程编号', key: 'code', placeholder: ''},
          {type: 'input', label: '认证流程名称', key: 'name', placeholder: ''},
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
              {label: '+添加', type: 'primary', function: this.handleAddModel, hidden: !this.$hasButton('product-identify-add')}
            ]
          }
        ]
      }
    },
    created() {
      this.keyupSubmit();
      this.getList();
      this.getAuthItem();
    },
    methods: {
      // 所有认证项
      getAuthItem() {
        getAllAuthItem().then(res => {
          if (res.code === '200') {
            if (res.body && res.body.length) {
              res.body.forEach((ele, index) => {
                this.allAuthItem.push({
                  sequenceNumber: index + 1,
                  code: ele.code,
                  name: ele.name,
                  flag: false,
                  isNeed: false
                })
              })
            } else {
              this.allAuthItem = []
            }
          }
        })
      },
      getList() {
        const search = this.$deepcopy(this.searchParams);
        this.searchLoading = true;
        getIdentifyManageList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.total = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            this.handleClickSearch()
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
      resetFields(form = 'identifyDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      //添加认证模型
      handleAddModel() {
        this.resetFields();
        this.saveLoading = false;
        this.identifyVisible = true;
        this.identifyDetailTitle = '添加认证模型';
        this.identifyDetail = {};
        this.mode = 'add';
        this.identifyAuthItem = this.$deepcopy(this.allAuthItem);
        this.showErrorTip = false;
      },
      handleEdit(row) {
        this.resetFields();
        this.saveLoading = false;
        this.showErrorTip = false;
        getIdentifyModelDetail(row.id).then(res => {
          if (res.code === '200') {
            this.identifyVisible = true;
            this.identifyDetailTitle = '修改认证模型';
            this.mode = 'edit';
            this.identifyDetail = {
              id: res.body.id,
              name: res.body.name,
              code: res.body.code,
            };
            this.identifyAuthItem = [];
            if (this.allAuthItem && this.allAuthItem.length) {
              this.allAuthItem.forEach((ele, index) => {
                let flag = false;
                if (res.body.authItemList && res.body.authItemList.length) {
                  res.body.authItemList.forEach(item => {
                    if (item.code === ele.code) {
                      flag = true;
                      this.identifyAuthItem.push({
                        isNeed: true,
                        sequenceNumber: item.sequenceNumber,
                        code: item.code,
                        name: ele.name,
                        flag: item.flag
                      })
                    }
                  })
                }
                if (!flag) {
                  this.identifyAuthItem.push({
                    isNeed: false,
                    sequenceNumber: index + 1,
                    code: ele.code,
                    name: ele.name,
                    flag: false
                  })
                }
              })
            }
          }
        })
      },
      isValidSequenceNumber(row) {
        if (row.sequenceNumber) {
          if (this.$valid.RegInt.test(row.sequenceNumber)) {
            this.sequenceNumberValid = this.identifyAuthItem.every(ele => {
              return this.$valid.RegInt.test(ele.sequenceNumber)
            })
          } else {
            this.sequenceNumberValid = false;
          }
          return this.$valid.RegInt.test(row.sequenceNumber)
        } else {
          this.sequenceNumberValid = false;
          return false
        }
      },
      handleChangeAuthItem(val) {
        if (val) {
          this.showErrorTip = false
        } else {
          let sum = 0;
          for (let i = 0, len = this.identifyAuthItem.length; i < len; i++) {
            if (this.identifyAuthItem[i].isNeed) {
              this.showErrorTip = false;
              sum += 1;
              break
            }
          }
          if (!sum) {
            this.showErrorTip = true;
          }
        }
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: message
          });
          this.identifyVisible = false;
          this.searchParams.pageNum = 1;
          this.getList();
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: response.message
          });
        }
      },
      handleSaveIdentify() {
        this.$refs.identifyDetail.validate(valid => {
          let haveXacg = false, xacgRequired = false;
          const params = this.$deepcopy(this.identifyDetail);
          params.authItemList = [];
          if (this.identifyAuthItem.length) {
            this.identifyAuthItem.forEach(ele => {
              if (ele.isNeed) {
                // 存管开户认证校验
                if (ele.code === 'cgrz') {
                  haveXacg = true;
                  this.identifyAuthItem.forEach(item => {
                    if (item.isNeed && item.code === 'bkrz' && item.sequenceNumber < ele.sequenceNumber) {
                      xacgRequired = true
                    }
                  })
                }
                if (params.id) {
                  // 修改需多传认证模型id
                  params.authItemList.push({
                    modelId: params.id,
                    code: ele.code,
                    name: ele.name,
                    flag: ele.flag,
                    sequenceNumber: ele.sequenceNumber
                  })
                } else {
                  params.authItemList.push({
                    code: ele.code,
                    name: ele.name,
                    flag: ele.flag,
                    sequenceNumber: ele.sequenceNumber
                  })
                }
              }
            })
          }
          // 至少选择一项认证项
          if (!params.authItemList.length) {
            this.showErrorTip = true;
            return false
          }
          if (valid && this.sequenceNumberValid) {
            if (haveXacg && !xacgRequired) {
              this.$alert('如须配置【存管开户认证】,则必须配置【绑卡认证】,且序号必须在【存管开户认证】之前', '提示', {
                confirmButtonText: '关闭',
                callback: () => {}
              });
              return false
            }
            this.saveLoading = true;
            if (!params.id) {
              addIdentifyModel(params).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            } else {
              updateIdentifyModel(params).then(response => {
                this.handleConfirm(response, '修改成功');
              }).finally(() => {
                this.saveLoading = false;
              });
            }
          } else {
            return false;
          }
        })
      },
      handleCheckDetail(row) {
        this.resetFields();
        getIdentifyModelDetail(row.id).then(res => {
          if (res.code === '200') {
            this.identifyVisible = true;
            this.identifyDetailTitle = '查看认证模型';
            this.mode = 'check';
            this.identifyDetail = {
              id: res.body.id,
              name: res.body.name,
              code: res.body.code,
            };
            this.identifyAuthItem = [];
            if (res.body.authItemList && res.body.authItemList.length) {
              res.body.authItemList.forEach(ele => {
                this.identifyAuthItem.push({
                  sequenceNumber: ele.sequenceNumber,
                  code: ele.code,
                  name: ele.name,
                  flag: ele.flag
                })
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .red{
        color: red;
    }
    .number-error-tip{
        color: #F56C6C;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        text-align: left;
    }
</style>