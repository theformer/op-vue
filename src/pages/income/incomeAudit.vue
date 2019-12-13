<template>
	<div class="income-detail income-audit">
		<el-tabs type="border-card" v-model="activeName">
			<el-tab-pane v-for="(tab, index) in tabsArr" :key="index" :label="tabMap[tab]" :name="tab">
				<div class="income-detail-form">
					<div class="income-detail-form-content" v-if="tab !== 'policyInfo'">
						<el-form :ref="tab + 'Form'" label-width="130px">
							<template v-for="(titleObj, index) in categoryArr">
								<el-row class="title-row" :key="`title+${index}`" v-if="showCategory(titleObj)">
									{{titleObj.label}}
								</el-row>
								<el-row class="row-bg" :key="index" :class="fileds[tab][titleObj.value] && fileds[tab][titleObj.value].length < 4 ? 'little-form' : ''">
									<el-col :span="6" v-for="item in fileds[tab][titleObj.value]" :key="item.fieldId" v-show="!item.triggerHidden">
										<!--文本框-->
										<el-form-item v-if="item.fieldType == 'input' && item.autoFill !== '1'"
																	:label="item.frontDisplayName"
																	:required="item.frontRequired == '1'">
											<el-input v-model="item.value" :readonly="item.readonly"></el-input>
										</el-form-item>
										<!--联动框-->
										<el-form-item
												v-if="item.autoFill === '1' && (item.fieldType === 'input' || item.fieldType === 'select')"
												:label="item.frontDisplayName"
												:required="item.frontRequired == '1'">
											<el-autocomplete
													popper-class="my-autocomplete"
													v-model="item.value"
													:fetch-suggestions="((queryString, cb)=>{querySearch(queryString, cb, item.fieldId)})"
													placeholder="请输入内容"
													@select="handleSelect">
												<i
														class="el-icon-edit el-input__icon"
														slot="suffix"
														@click="handleIconClick(item.recordLibraryType)">
												</i>
												<template slot-scope="{ item }">
													<div class="name" :title="item.value">{{ item.value }}</div>
													<span class="record" :title="getRecordTitle(item)">
															<span v-if="item.record0" class="record">{{ item.record0 }}</span>
															<span v-if="item.record1" class="record">{{ '--' + item.record1 }}</span>
															<span v-if="item.record2" class="record">{{ '--' + item.record2 }}</span>
															<span v-if="item.record3" class="record">{{ '--' + item.record3 }}</span>
															<span v-if="item.record4" class="record">{{ '--' + item.record4 }}</span>
															<span v-if="item.record5" class="record">{{ '--' + item.record5 }}</span>
														</span>
												</template>
											</el-autocomplete>
										</el-form-item>
										<!--下拉框（单选框，多选框）-->
										<el-form-item
												v-else-if="(item.fieldType == 'select' || item.fieldType == 'radio' || item.fieldType == 'checkbox') && item.autoFill !== '1'"
												:label="item.frontDisplayName" :required="item.frontRequired == '1'">
											<el-select v-model="item.value" :multiple="item.fieldType == 'checkbox'" :collapse-tags="item.fieldType == 'checkbox'" placeholder="请选择" @change="handleChangeFrontField(item)">
												<el-option v-for="dict in JSON.parse(item.dictTypeValue)" :key="dict.value" :label="dict.label" :value="dict.value">
												</el-option>
											</el-select>
										</el-form-item>
										<!--文本域-->
										<el-form-item v-if="item.fieldType == 'textarea'" :label="item.frontDisplayName"
																	:required="item.frontRequired == '1'">
											<el-input type="textarea" :rows="2" v-model="item.value" placeholder="请输入其他信息"></el-input>
										</el-form-item>
										<!--日期类型-->
										<el-form-item v-if="item.fieldType == 'date'" :label="item.frontDisplayName"
																	:required="item.frontRequired == '1'">
											<el-date-picker size="small" v-model="item.value" type="date" value-format="yyyy-MM-dd"
																			placeholder="选择日期"></el-date-picker>
										</el-form-item>
										<!--图片上传-->
										<el-form-item v-if="item.fieldType == 'fileupload'" :label="item.frontDisplayName"
																	:required="item.frontRequired == '1'">
											<template v-if="item.readonly">
												<PtUpload
														v-if="item.value"
														:imgUrl="item.value"
														:fieldId="item.fieldId"
														:applyId="orderId"
														:usePreview="false"
														:disabled="true"
														@preview="previewImg($event, item.frontDisplayName)"
														@success="uploadSuccess($event, item)"
												></PtUpload>
												<el-input value="暂无记录" readonly v-else></el-input>
											</template>
											<template v-else>
												<el-button type="text" @click="showMultipleImg(item, titleObj.value)" v-if="item.fileNumber > 1" class="ml-15">点击查看</el-button>
												<PtUpload
														v-else
														:imgUrl="item.value"
														:fieldId="item.fieldId"
														:applyId="orderId"
														:usePreview="false"
														@preview="previewImg($event, item.frontDisplayName)"
														@success="uploadSuccess($event, item)"
												>
												</PtUpload>
											</template>
										</el-form-item>
									</el-col>
									<el-col :span="6" v-if="titleObj.value === 'loanInfo'">
										<!-- 借款费率 -->
										<el-form-item label="借款费率" :required="feeFrontStatus === 'submitted'">
											<el-input v-model="fee" class="fee-input">
												<template slot="append">%</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row class="empty-row" :key="`empty+${index}`">
								</el-row>
							</template>
						</el-form>
					</div>
					<div class="income-detail-form-content" v-else>
						<el-form :ref="tab + 'Form'" label-width="130px" style="width: 100%;">
							<el-row class="row-bg">
								<el-col :span="6" v-for="item in fileds[tab]" :key="item.fieldId">
									<!--图片上传-->
									<el-form-item v-if="item.fieldType == 'fileupload'" :label="item.frontDisplayName">
										<PtUpload	:imgUrl="item.value"></PtUpload>
									</el-form-item>
								</el-col>
								<el-col :span="18"></el-col>
							</el-row>
						</el-form>
					</div>
				</div>
			</el-tab-pane>
			<el-button type="primary" @click="handleSumbit()">提交</el-button>
			<el-button type="primary" @click="handleReturn()">退回</el-button>
			<el-button type="primary" @click="handleReject()">拒绝</el-button>
		</el-tabs>

		<el-dialog :visible.sync="multipleVisible" @closed="closeMultipleImg" :close-on-click-modal="false">
			<span slot="title">{{multipleUpload.title}}</span>
			<PtUpload
					class="multiple-upload"
					:imgUrl="multipleUpload.urls"
					:limit="multipleUpload.limit"
					:fieldId="multipleUpload.fieldId"
					:applyId="orderId"
					:usePreview="false"
					@preview="previewImg($event, multipleUpload.title)"
					@success="uploadMultipleSuccess"
					@remove="removeMultipleImg"
			>
			</PtUpload>
		</el-dialog>

		<el-dialog title="退回原因" :visible.sync="dialogFormVisible"  @closed="handleCloseDialog" :close-on-click-modal="false">
			<el-form :model="ruleForm" :rules="rules" ref="editReasonDialog">
				<el-form-item label="退回原因" prop="returnBackMsg" class="roleForm" label-width="100px">
					<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="ruleForm.returnBackMsg"></el-input>
				</el-form-item>
				<el-form-item class="footer-content">
					<el-button type="primary" @click="handleEditReason">确定</el-button>
					<el-button @click="handleCloseDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog title="拒绝原因" :visible.sync="dialog" @closed="handleClose" :close-on-click-modal="false">
			<el-form :model="rejectForm" :rules="rejectRules" ref="editRejectDialog">
				<el-form-item label="拒绝原因" prop="rejectMsg" class="roleForm" label-width="100px">
					<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="rejectForm.rejectMsg"></el-input>
				</el-form-item>
				<el-form-item class="footer-content">
					<el-button type="primary" @click="handleRejectReason">确定</el-button>
					<el-button @click="handleClose">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<ul id="viewer" style="width:0;height:0;overflow: hidden;">
			<li><img class="viewer-img" :src="dialogImageUrl" :alt="dialogImageAlt"/></li>
		</ul>
	</div>
</template>
<script>
  import {getDetail, getRecordLibraryAutoFillData, returnBack, reject, submit, getPersonalInfo} from '@/service/income/income';
  import PtUpload from '../components/upload'
  import Viewer from 'viewerjs';
  import 'viewerjs/dist/viewer.css';
  import {filter_hideIdCardNo} from '../../lib/filters'

  export default {
    name: 'incomeAudit',
    components: {PtUpload},
    data() {
      return {
        orderId: this.$route.params.id || null,
        activeName: 'baseInfo',
        tabsArr: ['baseInfo', /*'policyInfo'*/],
        tabMap: {'baseInfo': '基本信息'/*, 'policyInfo': '保单信息'*/},
        table: {},
        fileds: {'baseInfo': {}/*, 'policyInfo': []*/},
        viewer: null,
        formData: {'baseInfo': {}/*, 'policyInfo': {}*/},
        dialogImageUrl: '',
        dialogImageAlt: '',
        dialogVisible: false,
        categoryArr: [
          {value: 'personalInfo', label: '个人基本信息'},
          {value: 'loanInfo', label: '借款信息'}
        ],
        restaurants: [],
        dialogFormVisible: false,
        dialog: false,
        ruleForm: {
          returnBackMsg: ""
        },
        rejectForm: {
          rejectMsg: ""
        },
        rules: {
          returnBackMsg: [
            {
              required: true,
              min: 1,
              max: 100,
              message: "请填写退回原因，1-100个字符",
              trigger: "blur"
            }
          ]
        },
        rejectRules: {
          rejectMsg: [
            {
              required: true,
              min: 1,
              max: 100,
              message: "请填写拒绝原因，1-100个字符",
              trigger: "blur"
            }
          ]
        },
        orderNo: '',
        fee: '',
        feeFrontStatus: '',
        recordLibraryFields: [],
        recordLibrary: {},
        hasCategory: true,// 申请表是否有分类
        multipleVisible: false,
        multipleUpload: {
          title: '',
          urls: [],
          limit: 99,
          fieldId: '',
          category: ''
        },
		frontFields: {}//前置字段集合
      }
    },
    computed: {},
    created() {
      this.orderId = this.$route.params.id || null;
      this.initTable();
      if (this.orderId !== null) {
        this.getDetail();
      }
    },
    methods: {
      showCategory(category) {
        return this.hasCategory || ['personalInfo', 'loanInfo'].includes(category.value)
      },
      uploadSuccess(value, item) {
        item.value = value
      },
      querySearch(queryString, cb, fieldId) {
        let libs = this.recordLibrary[fieldId];
        let results = queryString ? libs.filter(this.createFilter(queryString)) : libs;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (lib) => {
          return (lib.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleIconClick() {},
      handleSelect(selectItem) {
        for (let item in selectItem) {
          if (item.startsWith("record")) {
            let fieldId = selectItem['field' + item.substring(6)];
            for (let key in this.fileds['baseInfo']) {
              if (key !== 'loanInfo' && key !== 'personalInfo') {
                let index = this.fileds.baseInfo[key].findIndex(ele => ele.fieldId === fieldId);
                if (index >= 0) {
                  this.fileds.baseInfo[key][index]['value'] = selectItem[item]
				}
              }
            }
          }
        }
      },
      getRecordTitle(item) {
        let title = "";
        if (item.record0) {
          title += item.record0
        }
        if (item.record1) {
          title += "--" + item.record1
        }
        if (item.record2) {
          title += "--" + item.record2
        }
        if (item.record3) {
          title += "--" + item.record3
        }
        if (item.record4) {
          title += "--" + item.record4
        }
        if (item.record5) {
          title += "--" + item.record5
        }
        return title
      },
      //关闭弹窗
      handleCloseDialog() {
        this.$refs.editReasonDialog.resetFields();
        this.dialogFormVisible = false
      },
      //关闭弹窗
      handleClose() {
        this.$refs.editRejectDialog.resetFields();
        this.dialog = false
      },
      //编辑退回原因
      handleEditReason() {
        this.$refs.editReasonDialog.validate(valid => {
          if (valid) {
            const params = {
              returnBackMsg: this.ruleForm.returnBackMsg,
              orderNo: this.orderNo
            };
            returnBack(params).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                this.dialogFormVisible = false;
                setTimeout(() => {
                  this.$router.push({
                    name: 'incomeList',
                  });
                }, 500)
              }
            })
          } else {
            return false
          }
        })
      },
      handleRejectReason() {
        this.$refs.editRejectDialog.validate(valid => {
          if (valid) {
            const params = {
              rejectMsg: this.rejectForm.rejectMsg,
              orderNo: this.orderNo
            };
            reject(params).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                this.dialog = false;
                setTimeout(() => {
                  this.$router.push({
                    name: 'incomeList',
                  });
                }, 500)
              }
            })
          } else {
            return false
          }
        })
      },
      //提交表单
      handleSumbit() {
        let orderNo = this.orderNo, fee = this.$floatDivide(this.fee, 100);
        let submitObj = [];
        for (let key in this.fileds['baseInfo']) {
          if (key !== 'loanInfo' && key !== 'personalInfo') {
            submitObj = submitObj.concat(this.$deepcopy(this.fileds['baseInfo'][key]))
          }
        }
        let requiredStr = '';
        submitObj.forEach(ele => {
          if (ele.frontRequired === '1' && !ele.value && !ele.triggerHidden) {
            requiredStr += ele.frontDisplayName + '、'
          }
          // 后置字段如果隐藏，值传空
          if (ele.triggerHidden) {
            ele.value = ''
          }
        });
        if (this.feeFrontStatus && !this.fee) {
          requiredStr += '借款费率、'
        }
        if (requiredStr) {
          requiredStr = requiredStr.substring(0, requiredStr.length - 1);
          alert(requiredStr + '不能为空！');
          return false
        }
        // let params = JSON.stringify(submitObj)
        submit(orderNo, fee, submitObj).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$router.push({
              name: 'incomeList',
            });
          }
        })
      },
      initTable() {
        if (this.tabsArr && this.tabsArr.length) {
          this.tabsArr.forEach(tab => {
            this.$set(this.table, tab, [])
          })
        }
      },
      getDetail() {
        getDetail(this.orderId).then((res) => {
          if (res.code === '200') {
            this.recordLibraryFields = [];
            this.frontFields = {};
            this.orderNo = res.body.loanApply.orderNo;
            this.feeFrontStatus = res.body.loanApply.frontStatus;
            this.fee = res.body.loanApply.loanFee ? this.$floatMultiply(res.body.loanApply.loanFee, 100) : '';
            // 个人信息
            getPersonalInfo(res.body.loanApply.userId).then(response => {
              if (response.code === '200') {
                const data = response.body;
                const personalInfoTable = [
                  {fieldId: 'username', frontDisplayName: '姓名', fieldType: 'input', value: data.username, readonly: true},
                  {fieldId: 'idCard', frontDisplayName: '身份证号码', fieldType: 'input', value: filter_hideIdCardNo(data.idCard), readonly: true},
                  {fieldId: 'loginName', frontDisplayName: '登录账号', fieldType: 'input', value: data.phone, readonly: true},
                  {fieldId: 'front', frontDisplayName: '身份证正面照片', fieldType: 'fileupload', value: data.front, readonly: true},
                  {fieldId: 'back', frontDisplayName: '身份证反面照片', fieldType: 'fileupload', value: data.back, readonly: true},
                  {fieldId: 'hold', frontDisplayName: '手持身份证照片', fieldType: 'fileupload', value: data.hold, readonly: true},
                ];
                this.$set(this.fileds.baseInfo, 'personalInfo', personalInfoTable);
              }
            });
            // 借款信息
            const loanInfoTable = [
              {fieldId: 'loanAmount', frontDisplayName: '借款金额', fieldType: 'input', value: res.body.loanApply.loanAmount, readonly: true},
              {fieldId: 'loanTerm', frontDisplayName: '借款期限', fieldType: 'input', value: res.body.loanApply.loanTerm, readonly: true}
            ];
            this.$set(this.fileds.baseInfo, 'loanInfo', loanInfoTable);
            // 其他申请表字段
            this.hasCategory = res.body.category;
            const applicationFieldList = res.body.adminCategoryDtoList;
            let recordLibraryType = [];
            applicationFieldList.forEach(ele => {
              this.categoryArr.push({value: ele.categoryId, label: ele.categoryName});
              let table = [];
              if (ele.filedsMongoList && ele.filedsMongoList.length) {
                ele.filedsMongoList.forEach((field, index) => {
                  if (field.fieldType === 'checkbox') {
                    field.value = field.value ? JSON.parse(field.value) : ''
                  }
                  if (field.recordLibraryType) {
                    recordLibraryType.push(field.recordLibraryType);
                    this.recordLibraryFields.push(field)
                  }
                  if (field.frontField) {
                    if (!this.frontFields[field.frontField]) {
                      this.frontFields[field.frontField] = []
					}
                    this.frontFields[field.frontField].push({index, fieldId: field.fieldId, category: ele.categoryId, triggerEnum: field.triggerEnum})
                  }
                  table.push(field);
                })
              }
              this.$set(this.fileds.baseInfo, ele.categoryId, table);
            });
            this.initFrontField();
            recordLibraryType = [...new Set(recordLibraryType)];
            this.getRecordLibraryData(recordLibraryType);
            // this.fileds.policyInfo = [{
            //   fieldId: 'policyUrls',
            //   frontDisplayName: '保单图片',
            //   fieldType: 'fileupload',
            //   value: res.body.loanApplyMongo.policyUrls
            // }]
          }
        })
      },
      //获取联动的数据
      getRecordLibraryData(types) {
        types.forEach(typeItem => {
          let params = {
            recordLibraryType: typeItem
          };
          getRecordLibraryAutoFillData(params).then((res) => {
            let tempFields = this.recordLibraryFields.filter(item => item.recordLibraryType === typeItem);
            tempFields.forEach((recordField, index) => {
              this.packRecordLibrary(recordField, index, res.body)
            })
          })
        })
      },
      packRecordLibrary(recordField, index, results) {
        let arr = [];
        results.forEach(res => {
          if (res[recordField.fieldId]) {
            let obj = {}, mapIndex = 0;
            for (let item in res) {
              obj[item === recordField.fieldId ? 'field' : 'field' + mapIndex] = item;
              obj[item === recordField.fieldId ? 'value' : 'record' + (mapIndex++)] = res[item]
            }
            arr.push(obj)
          }
        });
        this.recordLibrary[recordField.fieldId] = arr
      },
      // 多张图片上传
      showMultipleImg(item, category) {
        const {fieldId, value} = item;
        this.multipleVisible = true;
        this.multipleUpload = {
          title: item.frontDisplayName,
          urls: value ? value.split(',') : [],
          limit: item.fileNumber,
          fieldId,
          category
        };
      },
      uploadMultipleSuccess(value) {
        this.multipleUpload.urls.push(value)
      },
      removeMultipleImg(value) {
        let index = this.multipleUpload.urls.findIndex(ele => ele === value);
        this.multipleUpload.urls.splice(index, 1)
      },
      closeMultipleImg() {
        const fields = this.fileds.baseInfo[this.multipleUpload.category];
        for (let field of fields) {
          if (field.fieldId === this.multipleUpload.fieldId) {
            field.value = this.multipleUpload.urls.join(',');
            break
          }
        }
        this.multipleUpload = {
          title: '',
          urls: [],
          limit: 99,
          fieldId: '',
          category: ''
        }
      },
      initFrontField() {
        const fieldIds = Object.keys(this.frontFields);
        if (fieldIds.length) {
          fieldIds.forEach(id => {
            for (let key in this.fileds['baseInfo']) {
              if (key !== 'loanInfo' && key !== 'personalInfo') {
                for (let ele of this.fileds['baseInfo'][key]) {
                  if (ele.fieldId === id) {
                    this.handleChangeFrontField(ele, ele.value);
                    break
                  }
                }
              }
            }
          })
        }
      },
      handleChangeFrontField(item, frontFieldValue) {
        const frontField = this.frontFields[item.fieldId];
        if (frontField && frontField.length) {
          frontField.forEach(ele => {
            let triggerHidden;
            if (item.hasOwnProperty('value')) {
              triggerHidden = ele.triggerEnum !== item.value;
            } else {
              triggerHidden = ele.triggerEnum !== frontFieldValue;
            }
            this.fileds['baseInfo'][ele.category][ele.index].triggerHidden = triggerHidden;
            if (this.frontFields[ele.fieldId]) {
              let fieldValue = triggerHidden ? '' : this.fileds['baseInfo'][ele.category][ele.index].value;
              this.handleChangeFrontField(ele, fieldValue)
			}
          })
        }
      },
      //退回弹窗
      handleReturn() {
        this.dialogFormVisible = true
      },
      //拒绝弹窗
      handleReject() {
        this.dialog = true
      },
      previewImg(value, alt) {
        let index = 0;
        this.dialogImageUrl = value;
        this.dialogImageAlt = alt;
        this.$nextTick(() => {
          if (!this.viewer) {
            this.viewer = new Viewer(document.getElementById('viewer'), {
              transition: false,
              zIndex: 9999,
            });
          }
          this.viewer.update();
          this.viewer.view(index);
          this.viewer.show();
        })
      }
    },
  }
</script>

<style lang="scss" scope>
	.my-autocomplete {
		li {
			line-height: normal;
			padding: 7px;
			.name {
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.record {
				font-size: 12px;
				color: #b4b4b4;
			}
			.highlighted .record {
				color: #ddd;
			}
		}
	}
	.income-audit {
		.income-detail-form-content {
			.row-bg{
				border-top: 1px solid #e8e8e8;
				&.little-form{
					border-top: none;
					.el-form-item{
						border-top: 1px solid #e8e8e8;
					}
				}
			}
			.el-form-item {
				margin-bottom: 0;
				border-bottom: 1px solid #e8e8e8;
				border-right: 1px solid #e8e8e8;
				.el-select {
					width: 100%;
				}
				.el-date-editor.el-input, .el-date-editor.el-input__inner {
					width: 100%;
				}
			}
			.el-form-item__label {
				word-break: break-all;
				background: #e9f7fe;
				height: 52px;
				line-height: 52px;
				text-align: center;
			}
			.el-form-item__content {
				height: 52px;
				line-height: 52px;
				.el-input__inner {
					border: none;
				}
			}
			.el-textarea__inner{
				border: none;
			}
			.fee-input{
				height: 100%;
				.el-input__inner{
					height: 100%;
				}
			}
			.ml-15{
				margin-left: 15px;
			}
		}
	}
	.el-input-group__append, .el-input-group__prepend{
		border: none;
		background-color: #fff;
	}

	.footer-content {
		margin-left: 20px;
	}

	.income-detail {
		padding: 20px;
	}
	.multiple-upload{
		.el-upload-list{
			margin-left: 0;
		}
	}

	.income-detail-form {
		margin: 10px 0;
		.income-detail-form-content {
			display: flex;
			flex-flow: row wrap;
			justify-content: flex-start;
			border-top: 1px solid #e8e8e8;
		}
	}

	.empty-row {
		height: 40px;
	}

	.title-row {
		height: 40px;
		background-color: rgb(242, 242, 242);
		line-height: 40px;
		padding-left: 10px;
		font-weight: bold;
		font-size: 15px;
	}
</style>