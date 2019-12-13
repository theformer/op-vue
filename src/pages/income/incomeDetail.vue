<template>
    <div class="income-detail">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane v-for="(tab, index) in tabsArr" :key="index" :label="tabMap[tab]" :name="tab">
                <div class="income-detail-form">
                    <template v-if="tab === 'baseInfo'">
                        <template v-for="(category, categoryIndex) in categoryArr">
                            <div class="income-detail-form-content" :class="table[tab][category.value] && table[tab][category.value].length < 4 ? 'little-form' : ''" :key="categoryIndex">
                                <div class="title-row" v-if="showCategory(category)">{{category.label}}</div>
                                <div v-for="(item, index) in table[tab][category.value]" :key="category.value + index" class="item-container" v-show="!item.triggerHidden">
                                    <div class="not-associate">
                                        <template v-if="item">
                                            <label class="form-item-label">{{item.labelName}}</label>
                                            <div class="form-item-detail">
                                                <span v-if="item.fieldType !== 'fileupload'">{{item.value}}</span>
                                                <span v-if="item.fieldType === 'fileupload'">
                                                <el-button type="text" v-if="item.value" @click="imgCheck(item.value, '', item.fileNumber)">点击查看</el-button>
                                                <span v-if="!item.value">暂无记录</span>
                                            </span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="empty-row" v-if="categoryIndex !== categoryArr.length - 1"></div>
                            </div>
                        </template>
                        <!--<billPay :id = 'orderId.toString()' v-if="loanApplyInfo.frontStatus=='repaymenting'||loanApplyInfo.frontStatus=='overdue'||loanApplyInfo.frontStatus=='paid'||loanApplyInfo.frontStatus=='policy_return'"
                                    ></billPay>-->
                    </template>
                    <template v-if="tab === 'policyInfo'">
                        <div class="income-detail-form-content little-form">
                            <div class="item-container">
                                <div class="not-associate">
                                    <template v-if="table['policyInfo'][0]">
                                        <label class="form-item-label">车牌号</label>
                                        <div class="form-item-detail">
                                            <span>{{table['policyInfo'][0].value}}</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="item-container" :class="{'upload-policy': showUploadPolicy}">
                                <div class="not-associate">
                                    <template v-if="table['policyInfo'][1]">
                                        <label class="form-item-label">保单图片</label>
                                        <div class="form-item-detail" v-if="showUploadPolicy">
                                            <PtUpload
                                                    :imgUrl="policyImgs"
                                                    :limit="5"
                                                    :businessTypeProp="$enum.PolicyImageType"
                                                    :fileCategory="$store.state.enums.PolicyImageType[0].value"
                                                    :usePreview="false"
                                                    @preview="imgCheck($event, 'uploadPolicyImg')"
                                                    @success="uploadPolicySuccess"
                                                    @remove="removePolicyImg"
                                            ></PtUpload>
                                        </div>
                                        <div class="form-item-detail" v-else>
                                            <span>
                                                <el-button type="text" v-if="table['policyInfo'][1].value" @click="imgCheck(table['policyInfo'][1].value)">点击查看</el-button>
                                                <span v-if="!table['policyInfo'][1].value">暂无记录</span>
                                            </span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="button-container" v-if="showUploadPolicy">
                            <el-button type="primary" @click="uploadPolicy" :loading="saveLoading" :disabled="saveLoading || !policyImgs.length">保存</el-button>
                        </div>
                    </template>
                    <!--<template v-else>
                        <div class="income-detail-form-content" :class="table[tab] && table[tab].length < 4 ? 'little-form' : ''">
                            <div v-for="(item, index) in table[tab]" :key="index" class="item-container">
                                <div class="not-associate">
                                    <template v-if="item">
                                        <label class="form-item-label">{{item.labelName}}</label>
                                        <div class="form-item-detail">
                                            <span v-if="item.fieldType !== 'fileupload'">{{item.value}}</span>
                                            <span v-if="item.fieldType === 'fileupload'">
                                        <el-button type="text" v-if="item.value" @click="imgCheck(item.value)">点击查看</el-button>
                                        <span v-if="!item.value">暂无记录</span>
                                    </span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>-->
                </div>
            </el-tab-pane>
        </el-tabs>
        <ul id="viewer" style="width:0;height:0;overflow: hidden;">
            <li v-for="(item, index) in imgSrc" :key="index"><img class="viewer-img" :src="item.url" :alt="item.alt"/></li>
        </ul>
    </div>
</template>
<script>
    import Viewer from 'viewerjs';
    import 'viewerjs/dist/viewer.css';
    import {getDetail, uploadPolicy, getPersonalInfo} from '@/service/income/income';
    /*import billPay from '../components/billPay';*/
    import PtUpload from '../components/upload';
    import {filter_hideIdCardNo} from '../../lib/filters'

    export default {
      name: 'incomeDetail',
        components: {PtUpload},
        data() {
        return {
          loanApplyInfo: {},
          orderId: null,
          activeName: 'baseInfo',
          tabsArr: ['baseInfo', 'policyInfo'],
          tabMap: {
            baseInfo: '基本信息',
            policyInfo: '保单信息'
          },
          categoryArr: [
            {value: 'personalInfo', label: '个人基本信息'},
            {value: 'loanInfo', label: '借款信息'}
          ],
          hasCategory: true,// 申请表是否有分类
          table: {},
          viewer: null,
          policyImgs: [],
          from: '',
          saveLoading: false,
          frontFields: {}//前置字段集合
        }
      },
      computed: {
        showUploadPolicy() {
          const {auditStatus, policyStatus} = this.loanApplyInfo;
          return this.from === 'uploadPolicy' && policyStatus === 'not_uploaded'
            && (auditStatus === 'loan_success' || auditStatus === 'repaymenting' || auditStatus === 'overdue' || auditStatus === 'repaymented' || auditStatus === 'paid')
        },
        imgSrc() {
          let imgArr = [];
          let data = [];
          if (this.activeName === 'baseInfo') {
            this.categoryArr.forEach(ele => {
              data = data.concat(this.table[this.activeName][ele.value])
            })
          } else {
            data = this.table[this.activeName];
          }
          if (data && data.length) {
            data.forEach(ele => {
              if (ele.fieldType === 'fileupload' && ele.value) {
                if (this.activeName === 'policyInfo') {
                  let value = ele.value.split(',');
                  if (value && value.length) {
                    value.forEach(ele => {
                      imgArr.push({alt: '保单图片', url: ele})
                    })
                  }
                } else {
                  if (ele.fileNumber > 1) {
                    const urls = ele.value.split(',');
                    urls.forEach(url => {
                      imgArr.push({alt: ele.labelName, url})
                    })
                  } else {
                    imgArr.push({alt: ele.labelName, url: ele.value})
                  }
                }
              }
            })
          }
          return imgArr
        }
      },
      created() {
        this.from = this.$route.params.from || null;
        if (this.from === 'uploadPolicy') {
          this.activeName = 'policyInfo'
        }
        this.orderId = this.$route.params.id || null;
        this.initTable();
        if(this.orderId !== null) {
          this.getDetail();
        }
      },
      methods: {
        initTable() {
          if (this.tabsArr && this.tabsArr.length) {
            this.tabsArr.forEach(tab => {
              let data = [];
              if (tab === 'baseInfo') {
                data = {};
                this.categoryArr.forEach(ele => {
                  data[ele.value] = []
                });
              }
              this.$set(this.table, tab, data)
            })
          }
        },
        showCategory(category) {
          return this.hasCategory || ['personalInfo', 'loanInfo'].includes(category.value)
        },
        getDetail() {
          getDetail(this.orderId).then((res) => {
            if (res.code === '200') {
              this.frontFields = {};
              this.loanApplyInfo = res.body.loanApply;
              // 获取用户信息
              getPersonalInfo(this.loanApplyInfo.userId).then(response => {
                if (response.code === '200') {
                  const data = response.body;
                  const personalInfoTable = [
                    {fieldId: 'username', labelName: '姓名', fieldType: 'input', value: data.username},
                    {fieldId: 'idCard', labelName: '身份证号码', fieldType: 'input', value: filter_hideIdCardNo(data.idCard)},
                    {fieldId: 'loginName', labelName: '登录账号', fieldType: 'input', value: data.phone},
                    {fieldId: 'front', labelName: '身份证正面照片', fieldType: 'fileupload', value: data.front},
                    {fieldId: 'back', labelName: '身份证反面照片', fieldType: 'fileupload', value: data.back},
                    {fieldId: 'hold', labelName: '手持身份证照片', fieldType: 'fileupload', value: data.hold},
                  ];
                  this.$set(this.table.baseInfo, 'personalInfo', personalInfoTable);
                }
              });
              // 借款信息
              const loanInfoTable = [
                {fieldId: 'loanAmount', labelName: '借款金额', fieldType: 'input', value: this.loanApplyInfo.loanAmount},
                {fieldId: 'loanTerm', labelName: '借款期限', fieldType: 'input', value: this.loanApplyInfo.loanTerm},
                {fieldId: 'loanFee', labelName: '借款费率', fieldType: 'input', value: this.loanApplyInfo.loanFee ? `${this.$floatMultiply(this.loanApplyInfo.loanFee, 100)}%` : ''}
              ];
              this.$set(this.table.baseInfo, 'loanInfo', loanInfoTable);
              // 其他申请表字段
              this.hasCategory = res.body.category;
              let applicationFieldList = res.body.adminCategoryDtoList;
              applicationFieldList.forEach(ele => {
                this.categoryArr.push({value: ele.categoryId, label: ele.categoryName});
                let table = [];
                if (ele.filedsMongoList && ele.filedsMongoList.length) {
                  ele.filedsMongoList.forEach((field, index) => {
                    let dataDoc, value, filedValue;
                    switch (field.fieldType) {
                      case 'input':
                      case 'textarea':
                      case 'fileupload':
                      case 'date':
                        table.push({fieldId: field.fieldId, labelName: field.frontDisplayName, fieldType: field.fieldType, value: field.value, fileNumber: field.fileNumber});
                        break;
                      case 'radio':
                      case 'select':
                        if (field.autoFill === '1') {
                          value = field.value
                        } else {
                          dataDoc = JSON.parse(field.dictTypeValue);
                          value = '';
                          if (dataDoc && dataDoc.length) {
                            dataDoc.forEach(doc => {
                              if (doc.value === field.value) {
                                value = doc.label
                              }
                            })
                          }
                        }
                        table.push({fieldId: field.fieldId, labelName: field.frontDisplayName, fieldType: field.fieldType, value: value, dicEnum: field.value});
                        break;
                      case 'checkbox':
                        dataDoc = JSON.parse(field.dictTypeValue);
                        filedValue = field.value ? JSON.parse(field.value) : "";
                        value = [];
                        if (dataDoc && dataDoc.length) {
                          dataDoc.forEach(doc => {
                            if (filedValue && filedValue.length) {
                              filedValue.forEach(item => {
                                if (doc.value === item) {
                                  value.push(doc.label)
                                }
                              })
                            }
                          })
                        }
                        value = value.join('；');
                        table.push({fieldId: field.fieldId, labelName: field.frontDisplayName, fieldType: field.fieldType, value: value});
                        break;
                      default:
                        break;
                    }
                    if (field.frontField) {
                      if (!this.frontFields[field.frontField]) {
                        this.frontFields[field.frontField] = []
                      }
                      this.frontFields[field.frontField].push({index, fieldId: field.fieldId, category: ele.categoryId, triggerEnum: field.triggerEnum});
                    }
                  })
                }
                this.$set(this.table.baseInfo, ele.categoryId, table);
              });
              this.initFrontField();
              // 保单信息
              const policyInfoTable = [
                {fieldId: 'carNo', labelName: '车牌号', fieldType: 'input', value: this.loanApplyInfo.carNo},
                {fieldId: 'policyUrls', labelName: '保单图片', fieldType: 'fileupload', value: res.body.policyUrls}
              ];
              this.$set(this.table, 'policyInfo', policyInfoTable);
              this.policyImgs = res.body.policyUrls ? res.body.policyUrls.split(',') : [];
            }
          })
        },
        initFrontField() {
          const fieldIds = Object.keys(this.frontFields);
          if (fieldIds.length) {
            fieldIds.forEach(id => {
              for (let key in this.table['baseInfo']) {
                if (key !== 'loanInfo' && key !== 'personalInfo') {
                  for (let ele of this.table['baseInfo'][key]) {
                    if (ele.fieldId === id) {
                      let frontField = this.frontFields[id];
                      if (frontField && frontField.length) {
                        frontField.forEach(field => {
                          this.table['baseInfo'][field.category][field.index].triggerHidden = field.triggerEnum !== ele.dicEnum
                        })
                      }
                      break
                    }
                  }
                }
              }
            })
          }
        },
        imgCheck(file, type, fileNumber) {
          if (type === 'uploadPolicyImg') {
            this.table.policyInfo[1].value = this.policyImgs.join(',')
          }
          fileNumber > 1 ? file = file.split(',')[0] : '';
          let index = 0;
          for (let i = 0, len = this.imgSrc.length; i < len; i++) {
            if (this.imgSrc[i].url === file) {
              index = i;
              break;
            }
          }
          this.$nextTick(() => {
            if (!this.viewer) {
              this.viewer = new Viewer(document.getElementById('viewer'), {
                transition: false,
                zIndex:9999,
              });
            }
            this.viewer.update();
            this.viewer.view(index);
            this.viewer.show();
          })
        },
        uploadPolicySuccess(value) {
          this.policyImgs.push(value)
        },
        removePolicyImg(value) {
          let index;
          for (let i = 0, len = this.policyImgs.length; i < len; i++) {
            if (this.policyImgs[i] === value) {
              index = i;
              break;
            }
          }
          this.policyImgs.splice(index, 1)
        },
        // 保存保单
        uploadPolicy() {
          this.saveLoading = true;
          const params = {
            orderNo: this.loanApplyInfo.orderNo,
            urls: this.policyImgs.join(',')
          };
          uploadPolicy(params).then(res => {
            if (res.code === '200') {
              this.initTable();
              this.getDetail(() => {
                this.saveLoading = false;
              })
            } else {
              this.saveLoading = false;
            }
          }, () => {
            this.saveLoading = false;
          })
        }
      }
    }
</script>

<style lang="scss">
   .income-detail{
       padding: 20px;
       .termRate-error-tip{
           color: #F56C6C;
           font-size: 12px;
           line-height: 1;
           text-align: left;
       }
       .button-container{
           margin: 20px 0;
           text-align: center;
       }
   }
   .income-detail-form{
       margin: 10px 0;
       .income-detail-form-header{
           padding: 5px 10px;
           font-size: 18px;
           color: #636363;
           font-weight: 800;
           border-top: 1px solid #e8e8e8;
           border-right: 1px solid #e8e8e8;
           border-left: 1px solid #e8e8e8;
       }
       .income-detail-form-content{
           display: flex;
           flex-flow: row wrap;
           justify-content: flex-start;
           border-top: 1px solid #e8e8e8;
           &.little-form{
               border-top: none;
               .item-container{
                   border-top: 1px solid #e8e8e8;
               }
           }
           .title-row {
               width: 100%;
               height: 40px;
               background-color: rgb(242, 242, 242);
               line-height: 40px;
               padding-left: 10px;
               font-weight: bold;
               font-size: 15px;
           }
           .empty-row{
               width: 100%;
               height: 40px;
           }
           .item-container{
               width: 25%;
               border-bottom: 1px solid #e8e8e8;
               &.upload-policy{
                   width: 75%;
                   .not-associate{
                       .form-item-label{
                           width: 10%;
                       }
                       .form-item-detail{
                           width: 90%;
                           padding: 0 15px;
                           .el-upload-list__item{
                               margin: 0 8px 0 0;
                           }
                       }
                   }
               }
               .not-associate{
                   display: flex;
                   width: 100%;
                   height: 100%;
                   border-right: 1px solid #e8e8e8;
                   font-size: 14px;
                   .form-item-label{
                       height: 100%;
                       word-break: break-all;
                       background: #e9f7fe;
                       color: #666;
                       padding: 15px 0;
                       text-align: center;
                       width: 30%;
                       margin: 0;
                       line-height: 1.5;
                       &.required:before{
                           content: '*';
                           color: #F56C6C;
                           margin-right: 4px;
                       }
                   }
                   .form-item-detail{
                       width: 70%;
                       justify-content: flex-start;
                       padding: 5px 15px;
                       display: flex;
                       flex-flow: row wrap;
                       align-items: center;
                   }
               }
           }
       }
   }
</style>
