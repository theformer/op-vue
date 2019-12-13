<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" :cell-class-name="handleCellClass">
                <el-table-column label="" fixed="left" width="50">
                    <template slot-scope="scope">
                        <el-radio :key="scope.row.id" :label="scope.row.id" v-model="applicationCopy.id" class="pt-table-radio" @change="handleCheckToCopy($event, scope.$index)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
                <el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="更新/添加时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.updatedTime}}</div>
                        <div class="create-date">{{scope.row.createdTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
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
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-tooltip content="修改">
                            <el-button type="text" icon="el-icon-edit" class="btn-operation" @click="handleEdit(scope.row)" v-if="$hasButton('product-application-edit')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="预览">
                            <el-button type="text" icon="el-icon-view" class="btn-operation" @click="previewApplication(scope.row)" v-if="$hasButton('product-application-preview')"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="jumper, prev, pager, next, sizes, total"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :total="applicationListTotal || 0"
                    :current-page="searchParams.pageNum"
                    @size-change="handleSizeChange($event, 'searchParams')"
                    @current-change="handleCurrentChange($event, 'searchParams')"
                    :disabled="searchLoading"
            ></el-pagination>
        </div>

        <el-dialog :visible.sync="applicationVisible" append-to-body :width="mode === 'add' ? '40%' : '95%'" :close-on-click-modal="false" :fullscreen="mode === 'edit' && fullScreen" @closed="fullScreen = false">
            <div slot="title" class="full-screen-title">{{applicationDetailTitle}}<i class="iconfont" :class="{'icon-quanpingzuidahua': !fullScreen, 'icon-tuichuquanping': fullScreen}" @click="fullScreen = !fullScreen" v-if="mode === 'edit'"></i></div>
            <el-row>
                <el-col :span="mode === 'edit' ? 15 : 24" :class="{'border': mode === 'edit'}">
                    <el-form :model="applicationDetail" label-width="100px" :rules="applicationRules" ref="applicationDetail">
                        <el-row>
                            <el-col :span="mode === 'add' ? 16 : 12">
                                <el-form-item label="申请表编号" prop="id" v-if="mode !== 'add'">
                                    <el-input v-model.trim="applicationDetail.id" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="申请表名称" prop="applyName">
                                    <el-input v-model.trim="applicationDetail.applyName" placeholder="请输入申请表名称"></el-input>
                                </el-form-item>
                                <el-form-item label="状态" prop="status">
                                    <el-radio-group v-model="applicationDetail.status">
                                        <el-radio :label="1">启用</el-radio>
                                        <el-radio :label="0">停用</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <template v-if="mode === 'edit'">
                            <div class="pt-table margin-top20">
                                <el-collapse v-model="activeCategoryIndex" accordion class="application-category" v-if="hasCategory">
                                    <el-collapse-item v-for="(category, categoryIndex) in applicationFieldList" :key="category.id" :title="category.categoryName" :name="categoryIndex">
                                        <el-table :data="category.modelFieldList ? category.modelFieldList : []" header-cell-class-name="thead" cell-class-name="tbody" max-height="500">
                                            <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>
                                            <el-table-column v-for="(column,index) in applicationColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                                            <el-table-column label="操作" fixed="right" width="110">
                                                <template slot-scope="scope">
                                                    <el-tooltip content="变更归属类">
                                                        <el-button type="text" icon="el-icon-folder" class="btn-operation" @click="handleChangeCategory(scope.row)"></el-button>
                                                    </el-tooltip>
                                                    <el-tooltip content="配置">
                                                        <el-button type="text" icon="el-icon-setting" class="btn-operation" @click="handleConfig(scope.row, scope.$index)"></el-button>
                                                    </el-tooltip>
                                                    <el-tooltip content="删除">
                                                        <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDeleteField(scope.row, scope.$index)"></el-button>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-collapse-item>
                                </el-collapse>
                                <el-table :data="applicationFieldList[0].modelFieldList ? applicationFieldList[0].modelFieldList : []" header-cell-class-name="thead" cell-class-name="tbody" max-height="500" v-else>
                                    <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>
                                    <el-table-column v-for="(column,index) in applicationColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                                    <el-table-column label="操作" fixed="right" width="110">
                                        <template slot-scope="scope">
                                            <el-tooltip content="配置">
                                                <el-button type="text" icon="el-icon-setting" class="btn-operation" @click="handleConfig(scope.row, scope.$index)"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="删除">
                                                <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDeleteField(scope.row, scope.$index)"></el-button>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>
                    </el-form>
                    <div class="footer-button">
                        <el-button @click="applicationVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleSaveApplication" :loading="saveLoading" :disabled="saveLoading">保存</el-button>
                    </div>
                </el-col>
                <el-col :span="9" v-if="mode === 'edit'">
                    <div class="field-container">
                        <p class="title">字段库</p>
                        <pt-search :items="fieldItems" :params="fieldSearchParams"></pt-search>
                        <div class="pt-table margin-top20">
                            <el-table :data="fieldList" header-cell-class-name="thead" cell-class-name="tbody" @row-dblclick="handleSaveField">
                                <el-table-column label="序号" type="index" width="135" fixed="left" :index="fieldBaseNum"></el-table-column>
                                <el-table-column v-for="(column,index) in fieldColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                            </el-table>
                            <el-pagination
                                    background
                                    layout="jumper, prev, pager, next, sizes, total"
                                    :page-sizes="[10, 20, 30, 50, 100]"
                                    :pager-count="5"
                                    :total="fieldListTotal || 0"
                                    :current-page="fieldSearchParams.pageNum"
                                    :page-size="fieldSearchParams.pageSize"
                                    @size-change="handleSizeChange($event, 'fieldSearchParams')"
                                    @current-change="handleCurrentChange($event, 'fieldSearchParams')"
                                    :disabled="fieldSearchLoading"
                            ></el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog title="调整归属类" :visible.sync="categoryVisible" append-to-body width="40%" :close-on-click-modal="false">
            <el-row>
                <el-col :span="18">
                    <el-form :model="categoryDetail" label-width="110px" :rules="categoryRules" ref="categoryDetail">
                        <el-form-item label="字段名" prop="fieldName">
                            <el-input v-model.trim="categoryDetail.fieldName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="选择分类" prop="applyCategoryId">
                            <el-select v-model="categoryDetail.applyCategoryId" placeholder="请选择分类">
                                <el-option v-for="(item, index) in categoryList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveCategory">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="configVisible" append-to-body :width="frontFieldVisible ? '50%' : '40%'" :close-on-click-modal="false" :show-close="!frontFieldVisible" @close="frontFieldVisible = false">
            <div slot="title" class="full-screen-title">
                <el-row>
                    <el-col :span="14">配置字段<i class="el-icon-close" @click="configVisible = false" v-if="frontFieldVisible"></i></el-col>
                    <el-col :span="9" :offset="1" v-if="frontFieldVisible" style="text-align: center">单选字段类型</el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="frontFieldVisible ? 14 : 18">
                    <el-form :model="configDetail" label-width="110px" :rules="configRules" ref="configDetail">
                        <el-form-item label="字段名称" prop="fieldName">
                            <el-input v-model.trim="configDetail.fieldName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="展示名称" prop="frontDisplayName">
                            <el-input v-model.trim="configDetail.frontDisplayName" placeholder="请输入展示名称"></el-input>
                        </el-form-item>
                        <el-form-item label="前端显示状态" prop="frontDisplayStatus">
                            <el-select v-model="configDetail.frontDisplayStatus" placeholder="请选择前端显示状态">
                                <el-option label="显示" value="1"></el-option>
                                <el-option label="隐藏" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否前端必填" prop="frontRequired">
                            <el-select v-model="configDetail.frontRequired" placeholder="请选择是否前端必填">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否自动填充" prop="autoFill">
                            <el-select v-model="configDetail.autoFill" placeholder="请选择是否自动填充" @change="handleChangeAutoFill">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备案库类型" prop="recordLibraryType" v-if="configDetail.autoFill === '1'">
                            <el-select v-model="configDetail.recordLibraryType" placeholder="请选择备案库类型">
                                <el-option
                                        v-for="item in $store.state.enums.RecordTypeEnum"
                                        :key="item.value"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示排序" prop="sort">
                            <el-input type="number" v-model.trim.number="configDetail.sort" placeholder="请输入显示排序"></el-input>
                        </el-form-item>
                        <template v-if="configDetail.autoFill === '0'">
                            <el-form-item label="前置字段">
                                <el-button v-if="!configDetail.frontField" @click="handleAddFrontField" class="add-pre-btn">添加</el-button>
                                <div v-if="configDetail.frontField" class="del-pre-container">
                                    <span>{{configDetail.frontFieldName}}</span>
                                    <el-button @click="handleDeleteFrontField(configDetail)">删除</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="触发枚举" v-if="configDetail.frontField" prop="triggerEnum">
                                <el-select v-model="configDetail.triggerEnum" placeholder="请选择触发枚举" @change="handleChangeTriggerEnum">
                                    <el-option v-for="(item, index) in $store.state.enums[configDetail.frontFieldDictType]" :key="index" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-form>
                </el-col>

                <el-col :span="9" :offset="1" v-if="frontFieldVisible">
                    <div class="pt-table">
                        <el-table :data="assistObj.frontFieldList" header-cell-class-name="thead" cell-class-name="tbody" @row-dblclick="handleSaveFrontField">
                            <el-table-column label="字段编号" prop="fieldId"></el-table-column>
                            <el-table-column label="字段名称" prop="fieldName"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" :class="{'config-foot-btn': frontFieldVisible}">
                <el-button @click="configVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveConfig">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="previewModalVisible" :title="'前端申请表预览'" append-to-body :width="'560px'" :close-on-click-modal="false" @close="previewModalVisible = false">
          <div class="previewBox">
            <div class="item" v-for="item in previewFieldList" :key="item.fieldId">
              <p class="label">
                <span v-if="item.frontRequired === '1'">*</span>
                {{item.frontDisplayName}}:
              </p>
              <p class="cont">
                <template v-if="item.fieldType === 'input'">
                  <input :placeholder="'请输入' + item.frontDisplayName" class="input" disabled />
                </template>
                <template v-if="item.fieldType === 'textarea'">
                  <textarea :placeholder="'请输入' + item.frontDisplayName" disabled></textarea>
                </template>
                <template v-if="item.fieldType === 'select'">
                  <select disabled>
                    <option>请选择{{item.frontDisplayName}}</option>
                  </select>
                </template>
                <template v-if="item.fieldType === 'radio'">
                  <el-radio-group class="radio">
                    <el-radio v-for="radio in JSON.parse(item.dictTypeValue)" :key="radio.value" :label="radio.value">{{radio.label}}</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="item.fieldType === 'checkbox'">
                  <el-checkbox class="checkbox" v-for="check in JSON.parse(item.dictTypeValue)" :key="check.value">{{check.label}}</el-checkbox>
                </template>
                <template v-if="item.fieldType === 'date'">
                  <el-date-picker class="date" type="date" placeholder="请选择日期"></el-date-picker>
                </template>
                <template v-if="item.fieldType === 'fileupload'">
                  <span class="file"></span>
                </template>
              </p>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewModalVisible = false">关闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
  import {getApplicationList, addApplication, updateApplication, getLoanApplyModelField, getFieldList, enableApplication, copyApplication, getApplyPreviewField} from '@/service/product/product'
  import {filter_isEffective, filter_isDispaly} from '../../lib/filters'

  export default {
    name: 'applicationList',
    data() {
      return {
        list: [],
        baseNum: 1,
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        fullScreen: false,
        applicationVisible: false,
        applicationDetailTitle: '添加申请表',
        applicationDetail: {},
        applicationFieldList: [],// 申请表关联的字段列表
        originalApplicationFieldList: {},// 接口返回的申请表关联的字段列表集合
        addLoanApplyModelField: [],
        delLoanApplyModelFieldId: [],
        updateLoanApplyModelField: [],
        applicationRules: {
          applyName: [
            {required: true, message: '请输入申请表名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 14)
              }, trigger: 'blur'
            }
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ]
        },
        applicationCopy: {
          id: '',// 需要复制的申请表id
          index: ''// 需要复制的申请表在列表中的顺序
        },
        mode: '',
        columns: {
          left: [
            {label: '申请表编号', prop: 'id'},
            {label: '申请表名称', prop: 'applyName'},
            {label: '申请表字段数', prop: 'modelFieldNumber'},
            {label: '关联产品数', prop: 'relationProductNumber'}
          ],
          right: [
            {label: '最后操作人', prop: 'updatedByName'}
          ]
        },
        applicationListTotal: 0,
        applicationColumns: [
          {label: '字段编号', prop: 'fieldId'},
          {label: '字段名称', prop: 'fieldName'},
          {label: '展示名称', prop: 'frontDisplayName'},
          {label: '前端展示状态', prop: 'frontDisplayStatus', formatter: (row, col, val) => filter_isDispaly(val)},
          {label: '是否前端必填', prop: 'frontRequired', formatter: (row, col, val) => filter_isEffective(val)},
          {label: '显示排序', prop: 'sort'},
          {
            label: '前置字段', prop: 'frontFieldName',
            formatter: (row, col, val) => {
              return val ? val : '----';
            }
          },
          {
            label: '触发枚举', prop: 'triggerEnumName',
            formatter: (row, col, val) => {
              return val ? val : '----';
            }
          },
        ],
        fieldSearchParams: {
          pageNum: 1,
          pageSize: 10
        },
        fieldList: [],
        fieldListTotal: 0,
        fieldBaseNum: 1,
        fieldColumns: [
          {label: '字段编号', prop: 'fieldNumber'},
          {label: '字段名称', prop: 'fieldName'},
          {label: '字段类型', prop: 'fieldType', formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.FieldTypeEnum)}
        ],
        configMode: '',// 区分添加字段时配置还是修改字段时配置
        configVisible: false,
        configDetail: {},
        configRules: {
          frontDisplayName: [
            {required: true, message: '请输入展示名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 50)
              }, trigger: 'blur'
            }
          ],
          frontDisplayStatus: [
            {required: true, message: '请选择前端显示状态', trigger: 'change'}
          ],
          frontRequired: [
            {required: true, message: '请选择是否前端必填', trigger: 'change'}
          ],
          autoFill: [
            {required: true, message: '请选择是否自动填充', trigger: 'change'}
          ],
          recordLibraryType: [
            {required: true, message: '请选择备案库类型', trigger: 'change'}
          ],
          sort: [
            {required: true, message: '请输入显示排序', trigger: 'blur'},
            {pattern: this.$valid.RegInt, message: '请输入正确的显示排序', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                let sortError = false;
                let modelFieldList;
                for (let i = 0, len = this.applicationFieldList.length; i < len; i++) {
                  modelFieldList = this.applicationFieldList[i].modelFieldList;
                  if (modelFieldList.some(ele => {
                    if (this.configDetail.frontField) {
                      // 当前编辑的字段有前置字段。该字段可以和同前置字段的字段、前置字段有相同的排序顺序一样
                      if (ele.frontField) {
                        return ele.fieldId !== this.configDetail.fieldId && ele.frontField !== this.configDetail.frontField && ele.sort === value
                      } else {
                        return ele.fieldId !== this.configDetail.fieldId && ele.fieldId !== this.configDetail.frontField && ele.sort === value
                      }
                    } else {
                      // 当前编辑的字段可能是前置字段，非前置字段。不能和非前置字段有一样的顺序
                      return ele.fieldId !== this.configDetail.fieldId && ele.frontField !== this.configDetail.fieldId && ele.sort === value
                    }
                  })) {
                    sortError = true;
                    break;
                  }
                }
                if (sortError) {
                  callback('存在相同排序，请重新填写')
                } else {
                  callback()
                }
              }, trigger: 'blur'
            }
          ],
          triggerEnum: [
            {required: true, message: '请选择触发枚举', trigger: 'change'}
          ],
        },
        saveLoading: false,
        searchLoading: false,
        fieldSearchLoading: false,
        hasCategory: true,// 申请表是否有分类
        activeCategoryIndex: 0,
        categoryVisible: false,
        categoryList: [],
        categoryDetail: {
          fieldName: '',
          applyCategoryId: ''
        },
        categoryRules: {
          applyCategoryId: [
            {required: true, message: '请选择分类', trigger: 'change'},
          ]
        },
        frontFieldVisible: false,
        previewModalVisible: false,
        previewFieldList: []
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '申请表编号', key: 'applyNumber', placeholder: ''},
          {type: 'input', label: '申请表名称', key: 'applyName', placeholder: ''},
          {
            type: 'select', label: '状态', key: 'status', placeholder: '',
            options: [{
              value: '1',
              text: '启用'
            }, {
              value: '0',
              text: '停用'
            }]
          },
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
              {label: '+添加申请表', type: 'primary', function: this.handleAddApplication, hidden: !this.$hasButton('product-application-add')},
              {label: '复制申请表', function: this.handleCopyApplication, hidden: !this.$hasButton('product-application-copy')}
            ]
          }
        ]
      },
      fieldItems() {
        return [
          /*{type: 'input', label: '字段编号', key: 'fieldNumber', placeholder: ''},*/
          {type: 'input', label: '字段名称', key: 'fieldName', placeholder: ''},
          {type: 'select', label: '字段类型', key: 'fieldType', placeholder: '', options: this.$store.state.enums.FieldTypeEnum},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearchField, disabled: this.fieldSearchLoading}
            ]
          }
        ]
      },
      assistObj() {
        let maxSort = 0;
        let frontFieldList = [];
        let allApplicationFieldList = {};
        let allPostField = {};
        if (this.applicationFieldList && this.applicationFieldList.length) {
          this.applicationFieldList.forEach((ele, categoryIndex) => {
            if (ele.modelFieldList && ele.modelFieldList.length) {
              ele.modelFieldList.forEach(model => {
                if (model.sort > maxSort) {
                  maxSort = model.sort
                }
                if ((model.fieldType === 'radio' || model.fieldType === 'select') && model.fieldId !== this.configDetail.frontField && model.fieldId !== this.configDetail.fieldId && model.autoFill === '0') {
                  frontFieldList.push(model)
                }
                allApplicationFieldList[model.fieldId] = model;
                if (model.frontField) {
                  if (!allPostField[model.frontField]) {
                    allPostField[model.frontField] = []
                  }
                  allPostField[model.frontField].push({categoryIndex, field: model});
                }
              })
            }
          })
        }
        return {
          maxSort,// 当前申请表最大显示排序
          frontFieldList,// 前置字段可选列表
          allApplicationFieldList,//申请表关联的所有字段集合
          allPostField,//申请表关联的所有后置字段集合（有关联前置字段的）
        }
      },
    },
    created() {
      this.keyupSubmit();
      this.getList()
    },
    methods: {
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getApplicationList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.applicationListTotal = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      keyupSubmit() {
        document.onkeydown = e => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            e.preventDefault();
            if (this.applicationVisible) {
              this.handleClickSearchField()
            } else {
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
      handleSizeChange(pageSize, type) {
        this[type]['pageSize'] = pageSize;
        if (type === 'searchParams') {
          this.getList()
        } else {
          this.handleSearchField()
        }
      },
      handleCurrentChange(pageNum, type) {
        this[type]['pageNum'] = pageNum;
        if (type === 'searchParams') {
          this.getList()
        } else {
          this.handleSearchField()
        }
      },
      // 点击
      handleCheckToCopy(val, index) {
        if (val) {
          this.applicationCopy.index = index
        } else {
          this.applicationCopy.index = ''
        }
      },
      // 复制后需要用颜色区分
      handleCellClass({row}) {
        if (row.isCopy) {
          return 'copy-tbody'
        } else {
          return 'tbody'
        }
      },
      // 复制申请表
      handleCopyApplication() {
        if (this.applicationCopy.id) {
          // 复制
          copyApplication({id: this.applicationCopy.id}).then(res => {
            if (res.code === '200') {
              if (res.body) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '复制成功'
                });
                res.body.isCopy = true;
                this.list.splice(this.applicationCopy.index + 1, 0, res.body);
                this.applicationListTotal = this.applicationListTotal + 1
              }
            }
          })
        } else {
          this.$alert('请选择需要复制的申请表', '提示', {
            confirmButtonText: '关闭',
            callback: () => {
            }
          })
        }
      },
      // 启用停用申请表
      handleEnable(command) {
        const params = {
          status: command.status === '0' ? '1' : '0',
          id: command.row.id
        };
        enableApplication(params).then(res => {
          if (res.code === '200') {
            this.getList()
          }
        })
      },
      resetFields(form = 'applicationDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      //添加申请表
      handleAddApplication() {
        this.resetFields();
        this.saveLoading = false;
        this.applicationVisible = true;
        this.applicationDetailTitle = '添加申请表';
        this.applicationDetail = {};
        this.mode = 'add';
      },
      handleEdit(row) {
        this.resetFields();
        this.saveLoading = false;
        this.applicationDetail = {};
        this.applicationFieldList = [];
        this.originalApplicationFieldList = {};
        this.addLoanApplyModelField = [];
        this.delLoanApplyModelFieldId = [];
        this.updateLoanApplyModelField = [];
        this.activeCategoryIndex = 0;
        this.hasCategory = true;
        this.categoryList = [];
        getLoanApplyModelField({id: row.id}).then(res => {
          if (res.code === '200') {
            this.applicationVisible = true;
            this.applicationDetailTitle = '申请表修改';
            this.mode = 'edit';
            this.applicationDetail = {
              id: row.id,
              applyName: row.applyName,
              status: parseInt(row.status)
            };
            let data = res.body;
            if (!Array.isArray(data) && data) {
              this.hasCategory = false;//没有分类的申请表
              data = [data]
            }
            let postField = {};// 后置字段集合（有配前置字段的）
            if (data && data.length) {
              data.forEach((ele, categoryIndex) => {
                if (this.hasCategory && ele.id) {
                  this.categoryList.push({//调整归属类不提供 其他 这个分类
                    id: ele.id.toString(),
                    name: ele.categoryName
                  });
                }
                if (ele.modelFieldList && ele.modelFieldList.length) {
                  ele.modelFieldList.forEach((model, modelIndex) => {
                    this.originalApplicationFieldList[model.fieldId] = {
                      id: model.id,
                      fieldName: model.fieldName,
                      dictType: model.dictType,
                      dictTypeValue: JSON.parse(model.dictTypeValue)
                    };
                    if (model.frontField) {
                      postField[model.fieldId] = {categoryIndex, fieldIndex: modelIndex}
                    }
                  });
                }
              });
              // 回显前置字段字段名、触发枚举值、数据字典值
              for (let key in postField) {
                let field = postField[key];
                let dataField = data[field.categoryIndex].modelFieldList[field.fieldIndex];
                dataField.frontFieldName = this.originalApplicationFieldList[dataField.frontField].fieldName;
                const dataDoc = this.originalApplicationFieldList[dataField.frontField].dictTypeValue;
                const triggerEnum = dataDoc.filter(doc => doc.value === dataField.triggerEnum);
                dataField.triggerEnumName = triggerEnum[0] ? triggerEnum[0].label : '';
                dataField.frontFieldDictType = this.originalApplicationFieldList[dataField.frontField].dictType;
              }
            }
            this.applicationFieldList = data || [];
            this.handleGetField();
          }
        });
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: message
          });
          this.applicationVisible = false;
          this.searchParams.pageNum = 1;
          this.getList();
        }
      },
      handleSaveApplication() {
        this.$refs.applicationDetail.validate(valid => {
          if (valid) {
            if (!this.applicationDetail.id) {
              this.saveLoading = true;
              const params = this.$deepcopy(this.applicationDetail);
              addApplication(params).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            } else {
              for (let i = 0, len = this.applicationFieldList.length; i < len; i++) {
                let modelFieldList = this.applicationFieldList[i].modelFieldList;
                let categoryName = this.applicationFieldList[i].categoryName;
                for (let j = 0, len1 = modelFieldList.length; j < len1; j++) {
                  let childFields = modelFieldList[j];
                  if (childFields.frontDisplayStatus === '0' && childFields.frontRequired === '1') {
                    this.$alert(this.hasCategory ? `${categoryName}下的序号为${j + 1}的字段前端隐藏但必填，请确认！` : `序号为${j + 1}的字段前端隐藏但必填，请确认！`, '提示', {
                      confirmButtonText: '关闭',
                      callback: () => {
                      }
                    });
                    return false;
                  }
                }
              }
              this.saveLoading = true;
              const params = {};
              params.loanApplyModel = this.$deepcopy(this.applicationDetail);
              // 修改时需要整理新增、删除、配置的 三个字段集合
              params.addLoanApplyModelField = this.addLoanApplyModelField;
              params.delLoanApplyModelFieldId = this.delLoanApplyModelFieldId;
              params.updateLoanApplyModelField = this.updateLoanApplyModelField;
              updateApplication(params).then(response => {
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
      handleGetField() {
        this.fieldSearchParams = {
          pageNum: 1,
          pageSize: 10
        };
        this.fieldList = [];
        this.fieldSearchLoading = false;
        this.handleSearchField()
      },
      handleClickSearchField() {
        this.fieldSearchParams.pageNum = 1;
        this.handleSearchField()
      },
      // 查询字段库列表
      handleSearchField() {
        this.fieldSearchLoading = true;
        const search = this.$deepcopy(this.fieldSearchParams);
        getFieldList(search).then(res => {
          if (res.code === '200') {
            this.fieldList = res.body.list;
            this.fieldListTotal = res.body.total;
            this.fieldBaseNum = 1 + (this.fieldSearchParams.pageNum - 1) * this.fieldSearchParams.pageSize;
          } else if (res.code === 'FIELD_LIBRARY_UNRELATED_FIELD') {
            this.$message({
              showClose: true,
              type: 'error',
              message: res.message
            });
            this.fieldList = [];
            this.fieldListTotal = 0;
            this.fieldBaseNum = 1;
          }
        }).finally(() => {
          this.fieldSearchLoading = false;
        })
      },
      // 双击添加字段
      handleSaveField(row) {
        if (!this.activeCategoryIndex && this.activeCategoryIndex !== 0) {
          this.$alert('请先选择一个类目', '提示', {
            confirmButtonText: '关闭',
            callback: () => {
            }
          });
          return false;
        }
        if (this.assistObj.allApplicationFieldList[row.fieldNumber]) {
          this.$alert('该字段已添加，请勿重复添加', '提示', {
            confirmButtonText: '关闭',
            callback: () => {
            }
          });
          return false;
        }
        this.handleConfig({
          applyCategoryId: this.applicationFieldList[this.activeCategoryIndex].id ? this.applicationFieldList[this.activeCategoryIndex].id.toString() : null,
          applyModelId: this.applicationDetail.id,
          fieldId: row.fieldNumber,
          fieldName: row.fieldName,
          fieldType: row.fieldType,
          frontDisplayName: row.fieldName,
          frontDisplayStatus: '0',
          frontRequired: '0',
          autoFill: '0',
          sort: this.assistObj.maxSort + 1,
          dictType: row.dictType,
          frontField: '',
          frontFieldName: '',
          frontFieldDictType: '',
          triggerEnum: '',
          triggerEnumName: ''
        }, 'addField')
      },
      handleChangeCategory(row) {
        this.resetFields('categoryDetail');
        this.categoryVisible = true;
        this.categoryDetail = Object.assign({}, row);
        this.categoryDetail.applyCategoryId = row.applyCategoryId !== '0' ? row.applyCategoryId.toString() : null;
      },
      handleSaveCategory() {
        this.$refs.categoryDetail.validate(valid => {
          if (valid) {
            this.categoryVisible = false;
            let copyCategoryDetail = Object.assign({}, this.categoryDetail);
            if (this.originalApplicationFieldList[this.categoryDetail.fieldId]) {
              copyCategoryDetail.id = copyCategoryDetail.id || this.originalApplicationFieldList[this.categoryDetail.fieldId].id;
              this.addField(copyCategoryDetail, this.updateLoanApplyModelField);
              this.delField(this.originalApplicationFieldList[this.categoryDetail.fieldId].id, this.delLoanApplyModelFieldId);
            } else {
              this.addField(copyCategoryDetail, this.addLoanApplyModelField);
            }
            const modelFieldList = this.applicationFieldList[this.activeCategoryIndex].modelFieldList;
            this.delField(this.categoryDetail.fieldId, modelFieldList, 'fieldId');
            for (let i = 0, len = this.applicationFieldList.length; i < len; i++) {
              let id = this.applicationFieldList[i].id ? this.applicationFieldList[i].id.toString() : null;
              let applyCategoryId = copyCategoryDetail.applyCategoryId ? copyCategoryDetail.applyCategoryId.toString() : null;
              if (id === applyCategoryId) {
                this.applicationFieldList[i].modelFieldList.unshift(copyCategoryDetail);
                break
              }
            }
          } else {
            return false
          }
        })
      },
      handleConfig(row, type) {
        this.resetFields('configDetail');
        this.configMode = type;
        this.configVisible = true;
        this.configDetail = Object.assign({}, row);
      },
      addField(detail, list) {
        let flag = true;
        for (let i = 0, len = list.length; i < len; i++) {
          if (detail.fieldId === list[i].fieldId) {
            list[i] = detail;
            flag = false;
            break
          }
        }
        if (flag) {
          list.push(detail)
        }
      },
      delField(id, list, key) {
        for (let i = 0, len = list.length; i < len; i++) {
          if (key) {
            if (id === list[i][key]) {
              list.splice(i, 1);
              break
            }
          } else {
            if (id === list[i]) {
              list.splice(i, 1);
              break
            }
          }
        }
      },
      // 自动填充的字段不能有前置字段
      handleChangeAutoFill() {
        if (this.configDetail.autoFill === '1') {
          this.frontFieldVisible = false;
          this.handleDeleteFrontField(this.configDetail)
        } else {
          this.configDetail.recordLibraryType = ''
        }
      },
      // 添加前置字段按钮
      handleAddFrontField() {
        this.frontFieldVisible = true
      },
      // 前置字段双击保存
      handleSaveFrontField(row) {
        this.configDetail.frontField = row.fieldId;
        this.configDetail.frontFieldName = row.fieldName;
        this.configDetail.frontFieldDictType = row.dictType;
        this.frontFieldVisible = false;
      },
      handleDeleteFrontField(scope) {
        scope.frontField = '';
        scope.frontFieldName = '';
        scope.frontFieldDictType = '';
        scope.triggerEnum = '';
        scope.triggerEnumName = '';
      },
      handleChangeTriggerEnum() {
        const triggerEnum = this.$store.state.enums[this.configDetail.frontFieldDictType].filter(doc => doc.value === this.configDetail.triggerEnum);
        this.configDetail.triggerEnumName = triggerEnum[0].text
      },
      handleSaveConfig() {
        this.$refs.configDetail.validate(valid => {
          if (valid) {
            this.configVisible = false;
            let copyConfigDetail = Object.assign({}, this.configDetail, {applyCategoryId: this.applicationFieldList[this.activeCategoryIndex].id});
            if (this.originalApplicationFieldList[this.configDetail.fieldId]) {
              // 编辑前回显就有该字段
              copyConfigDetail.id = copyConfigDetail.id || this.originalApplicationFieldList[this.configDetail.fieldId].id;
              copyConfigDetail.applyCategoryId = copyConfigDetail.applyCategoryId || '0';// 先删除再展开 其他 添加该字段，达到调整归属类为 其他 的目的
              this.addField(copyConfigDetail, this.updateLoanApplyModelField);
              this.delField(this.originalApplicationFieldList[this.configDetail.fieldId].id, this.delLoanApplyModelFieldId);
            } else {
              this.addField(copyConfigDetail, this.addLoanApplyModelField);
            }
            if (this.configMode === 'addField') {
              this.applicationFieldList[this.activeCategoryIndex].modelFieldList.unshift(copyConfigDetail);
            } else {
              this.applicationFieldList[this.activeCategoryIndex].modelFieldList.splice(this.configMode, 1, copyConfigDetail);
            }
            // 申请表已经配置字段A是B的前置字段，若再修改A为填充字段，则需清掉B字段的前置字段属性
            if (this.assistObj.allPostField[copyConfigDetail.fieldId] && copyConfigDetail.autoFill === '1') {
              if (this.assistObj.allPostField[copyConfigDetail.fieldId].length) {
                this.assistObj.allPostField[copyConfigDetail.fieldId].forEach(ele => {
                  let field = ele.field;
                  this.handleDeleteFrontField(field);
                  if (this.originalApplicationFieldList[field.fieldId]) {
                    // 编辑前回显就有该字段
                    field.id = field.id || this.originalApplicationFieldList[field.fieldId].id;
                    this.addField(field, this.updateLoanApplyModelField);
                    this.delField(this.originalApplicationFieldList[this.configDetail.fieldId].id, this.delLoanApplyModelFieldId);
                  } else {
                    this.addField(field, this.addLoanApplyModelField);
                  }
                })
              }
            }
          } else {
            return false;
          }
        })
      },
      handleDeleteField(row, index) {
        this.$alert('是否删除该字段?', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '再想想',
          showCancelButton: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              for (let i = 0, len = this.applicationFieldList.length; i < len; i++) {
                let modelFieldList = this.applicationFieldList[i].modelFieldList;
                if (modelFieldList && modelFieldList.some(model => model.frontField === row.fieldId)) {
                  this.$alert('该字段有挂载字段, 如需删除, 请先删除挂载字段', '提示', {
                    confirmButtonText: '关闭',
                    callback: () => {
                    }
                  });
                  return false;
                }
              }
              // 确认删除
              if (this.originalApplicationFieldList[row.fieldId]) {
                // 删除 回显时该字段存在
                this.delField(row.fieldId, this.updateLoanApplyModelField, 'fieldId');
                if (!this.delLoanApplyModelFieldId.includes(row.id)) {
                  this.delLoanApplyModelFieldId.push(row.id)
                }
              } else {
                // 删除 原来不存在
                this.delField(row.fieldId, this.addLoanApplyModelField, 'fieldId')
              }
              this.applicationFieldList[this.activeCategoryIndex].modelFieldList.splice(index, 1)
            }
          }
        });
      },
      //申请表预览
      previewApplication(row) {
        getApplyPreviewField({applyModelId: row.id}).then(res => {
          if (res.code === "200") {
            let fields = res.body || [], require = [], unRequire = [];
            let len = fields.length;
            for (let i = 0; i < len; i++) {
              for (let j = i+1; j < len; j++) {
                if (fields[j]['frontField'] === fields[i]['fieldId']) {
                  //是fieldId下的后置字段
                  //将后置字段的显/隐、必填/非必填设置为跟前置字段一致
                  fields[j] = {
                    ...fields[j],
                    frontDisplayStatus: fields[i]['frontDisplayStatus'],
                    frontRequired: fields[i]['frontRequired'],
                  }
                }
              }
            }

            let filterData = fields.filter(ele => ele.frontDisplayStatus === '1');
            filterData.forEach(ele => {
              ele.frontRequired === '1' ? require.push(ele) : unRequire.push(ele);
            });

            this.previewFieldList = require.concat(unRequire);
            this.previewModalVisible = true;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scope>
    .footer-button{
        padding: 40px 20px 0;
        text-align: right;
        box-sizing: border-box;
    }
    .border{
        padding-right: 10px;
        border-right: 1px solid #e9e9e9;
    }
    .field-container{
        margin-left: 10px;
    }
    .application-category{
        border: none;
        .el-collapse-item__header{
            margin-bottom: 10px;
            padding-left: 10px;
            border: 1px solid #EBEEF5;
            font-size: 14px;
            .el-collapse-item__arrow{
                &.el-icon-arrow-right:before{
                    content: "\E6DF";
                }
                &.is-active:before{
                    content: "\E6DE";
                }
            }
        }
        .el-collapse-item__wrap{
            border: none;
        }
    }
    .add-pre-btn{
        width: 100%;
    }
    .del-pre-container{
        span{
            display: inline-block;
            max-width: 60%;
        }
        .el-button{
            float: right;
        }
    }
    .config-foot-btn{
        width: 58.3%;
    }
    .previewBox{
      padding-right: 50px;
      max-height: 400px;
      overflow-y: scroll;
      .item{
        display: flex;
        margin-bottom: 10px;
        .label{
          flex: 0 0 120px;
          text-align: right;
          margin: 0 10px 0 0;
          line-height: 20px;
          padding: 9px 0;
          span{
            color: #e94f4f;
          }
        }
        .cont{
          flex: 1;
          margin: 0;
          .input{
            background: transparent;
            outline: none;
            line-height: 36px;
            height: 36px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            padding: 0 10px;
            width: 100%;
          }
          ::-webkit-input-placeholder {
            color: #a4a4a4;
            font-size: 13px;
          }
          textarea{
            border: 1px solid #dcdfe6;
            padding: 5px 10px;
            width: 100%;
            border-radius: 4px;
            height: 50px;
          }
          select{
            border: 1px solid #dcdfe6;
            padding: 5px 10px;
            width: 100%;
            border-radius: 4px;
            height: 36px;
            background: #fff;
            color: #a4a4a4;
          }
          .radio{
            padding: 11px 0 0 10px;
            .el-radio{
              margin-bottom: 6px;
            }
          }
          .checkbox{
            padding: 8px 0 0 10px;
            margin-right: 5px;
          }
          .date{
            padding-top: 2px;
            .el-input__inner{
              height: 36px;
              line-height: 36px;
            }
            .el-input__icon{
              padding-top: 2px;
              line-height: 36px;
            }
          }
          .file{
            display: block;
            position: relative;
            border-radius: 4px;
            width: 220px;
            height: 86px;
            border: 1px dotted #dcdfe6;
            &::before, &::after{
              content: '';
              position: absolute;
              width: 20px;
              height: 1px;
              background: #b5b8bf;
              top: 40px;
              left: 100px;
            }
            &::after{
              transform: rotate(-90deg);
              transition: all ease-in-out 0.1s;
            }
          }
        }
      }
    }
</style>
