<template>
    <div>
        <div class="pt-search">
            <el-form :model="searchParams" ref="searchParams" :inline="true" label-width="100px">
                <el-form-item label="申请表" prop="application">
                    <el-select v-model.trim="searchParams.applyModelId" @change="handleSearch" filterable :disabled="searchLoading">
                        <el-option v-for="(item, index) in applicationList" :key="index" :label="item.applyName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="right-button-operation" v-if="searchParams.applyModelId">
                    <el-button type="primary" @click="handleAdd" v-if="$hasButton('product-category-add')">增加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="pt-table margin-top20 inside-margin" v-if="searchParams.applyModelId">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody" id="category-list">
                <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
                <el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="更新/添加时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.updatedTime}}</div>
                        <div class="create-date">{{scope.row.createdTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-dropdown @command="handleEnable" :class="{'column-text-red': scope.row.status === '0', 'column-text-green': scope.row.status === '1'}">
                            <span><i class="iconfont icon-dian"></i>{{scope.row.status === '0' ? '停用': '启用'}}<i class="el-icon-caret-bottom icon-blue"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{status: scope.row.status, row: scope.row}">{{scope.row.status === '1' ? '停用': '启用'}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="调序操作" width="90">
                    <template slot-scope="scope" v-if="$hasButton('product-category-order')">
                        <i class="el-icon-caret-top order-icon" @click="handleOrdering(scope.row, 'up')" v-if="scope.$index !== 0" :class="{'only-up-icon': scope.$index === list.length - 1}"></i>
                        <i class="el-icon-caret-bottom order-icon" @click="handleOrdering(scope.row, 'down')" v-if="scope.$index !== list.length - 1" :class="{'only-down-icon': scope.$index === 0}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="内容操作" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑">
                            <el-button type="text" icon="el-icon-edit" class="btn-operation" @click="handleEdit(scope.row)" v-if="$hasButton('product-category-edit')"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="categoryDetailTitle" :visible.sync="categoryVisible" append-to-body width="40%" :close-on-click-modal="false">
            <el-form :model="categoryDetail" label-width="100px" :rules="categoryRules" ref="categoryDetail">
                <el-form-item label="类目名" prop="categoryName">
                    <el-input v-model.trim="categoryDetail.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="分类说明" prop="description">
                    <el-input type="textarea" v-model.trim="categoryDetail.description"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="categoryDetail.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveCategory" :disabled="saveLoading" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {Loading} from "element-ui";
  import {getApplicationList, getLoanApplyCategory, addCategory, updateCategory, updateCategorySort, enableCategory} from '@/service/product/product'

  export default {
    name: 'applicationCategory',
    data() {
      return {
        applicationList: [],
        applyModelId: '',//类目关联的申请表id值
        list: [],
        baseNum: 1,
        searchParams: {
          applyModelId: ''
        },
        columns: {
          left: [
            {label: '类目名', prop: 'categoryName'},
            {label: '说明', prop: 'description'},
          ],
          right: [
            {label: '变更人', prop: 'updatedByName'}
          ]
        },
        categoryVisible: false,
        categoryDetailTitle: '',
        categoryDetail: {},
        categoryRules: {
          categoryName: [
            {required: true, message: '请输入类目名', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeStrRule(rule, value, callback, 20, '类目名称必须在1~10个字以内')
              }, trigger: 'blur'
            }
          ],
          description: [
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeStrRule(rule, value, callback, 40, '类目说明不能超过20个字')
              }, trigger: 'blur'
            }
          ]
        },
        searchLoading: false,
        saveLoading: false
      }
    },
    created() {
      this.getAllApplication();
    },
    methods: {
      getAllApplication() {
        getApplicationList().then(res => {
          if (res.code === '200') {
            this.applicationList = res.body.list
          }
        })
      },
      handleSearch() {
        this.list = [];
        this.applyModelId = this.searchParams.applyModelId;
        this.searchLoading = true;
        getLoanApplyCategory({applyModelId: this.applyModelId}).then(res => {
          if (res.code === '200') {
            this.list = res.body
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      resetFields(form = 'categoryDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      handleAdd() {
        this.resetFields();
        this.saveLoading = false;
        this.categoryVisible = true;
        this.categoryDetailTitle = '增加类目';
        this.categoryDetail = {
          applyModelId: this.applyModelId,
          status: '1'
        };
      },
      handleEdit(row) {
        this.resetFields();
        this.saveLoading = false;
        this.categoryVisible = true;
        this.categoryDetailTitle = '编辑类目';
        this.categoryDetail = this.$deepcopy(row);
      },
      handleConfirm(response, message, type) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: "success",
            message: message
          });
          !type ? this.categoryVisible = false : '';
          this.handleSearch();
        }
      },
      handleSaveCategory() {
        this.$refs.categoryDetail.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            let params = Object.assign({}, this.categoryDetail);
            if (!this.categoryDetail.id) {
              addCategory(params).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            } else {
              updateCategory(params).then(response => {
                this.handleConfirm(response, '编辑成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            }
          } else {
            return false;
          }
        })
      },
      // 调序
      handleOrdering({id}, orderDirection) {
        const loading = Loading.service({
          target: document.querySelector('#category-list'),
          lock: true,
          text: '调序中',
        });
        const params = {
          id: id.toString(),
          orderDirection
        };
        updateCategorySort(params).then(res => {
          if (res.code === '200') {
            this.handleConfirm(res, '调序成功', 'order');
          }
        }).finally(() => {
          loading.close();
        })
      },
      // 启用停用分类
      handleEnable(command) {
        const params = {
          status: command.status === '0' ? '1' : '0',
          id: command.row.id
        };
        enableCategory(params).then(res => {
          if (res.code === '200') {
            this.handleSearch()
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
    .order-icon{
        font-size: 30px;
        color: #409EFF;
        cursor: pointer;
        margin-left: 10px;
        &:first-child{
            margin-left: 0;
        }
        &.only-up-icon{
            position: relative;
            left: -18px;
        }
        &.only-down-icon{
            position: relative;
            left: 18px;
        }
    }
</style>