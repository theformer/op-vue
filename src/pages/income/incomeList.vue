<template>
	<div>
		<div class="income-search-container">
			<pt-search :items="items" :params="searchParams"></pt-search>
			<p class="car-search-tip">备注：若输入车牌号查询，则其他查询条件失效</p>
		</div>
		<div class="pt-table margin-top20 inside-margin">
			<el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
				<el-table-column width="30" fixed="left" v-if="loginAccountType !== 'channelSalesman'">
					<template slot="header" slot-scope="scope">
						<el-checkbox @change="handleSelectAll(scope)" v-model="isSelectAll" :disabled="isSelectAllDisabled"></el-checkbox>
					</template>
					<template slot-scope="scope" v-if="!scope.row.groupNo || scope.row.masterOrder">
						<el-checkbox :key="scope.row.id + scope.row.isChecked" v-model="scope.row.isChecked" @change="handleSelectOrder(scope.row)" :disabled="isDisabledSelect(scope.row)"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="贷款订单号" min-width="130px">
					<template slot-scope="scope">
						<div class="link-button">
							<el-tooltip content="查看团单" v-if="scope.row.groupNo">
								<i class="iconfont icon-tuangou group-icon link" :class="{'text-red': scope.row.masterOrder}" @click="handleClickRelation(scope.row)"></i>
							</el-tooltip>
							<span @click="handleCheckDetail(scope.row)" @dblclick="preventCheckDetail">{{scope.row.orderNo}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
				<el-table-column label="前端状态">
					<template slot-scope="scope">
						<span>{{formatterMethod(scope.row.frontStatus)}}</span>
						<el-tooltip content="保单已上传" v-if="scope.row.policyStatus === 'uploaded' && (scope.row.auditStatus === 'loan_success' || scope.row.auditStatus === 'repaymenting' || scope.row.auditStatus === 'overdue' || scope.row.auditStatus === 'repaymented' || scope.row.auditStatus === 'paid')">
							<i class="el-icon-circle-check policy-status-icon"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>

				<el-table-column label="操作" fixed="right" width="175">
					<template slot-scope="scope">
						<el-tooltip content="资料补充">
							<el-button type="text" icon="iconfont icon-wode-buchongziliaoICON" class="btn-operation" @click="handleAudit(scope.row)" :disabled="scope.row.auditStatus !== 'first_instance_running'" v-if="$hasButton('income-income-audit')"></el-button>
						</el-tooltip>
						<el-tooltip content="退回/拒绝理由">
							<el-button type="text" icon="el-icon-warning-outline" class="btn-operation btn-operation-delete" @click="handleCheckResult(scope.row)" :disabled="!(scope.row.frontStatus == 'reject' || scope.row.frontStatus == 'initial_return' || scope.row.frontStatus == 'running')" v-if="$hasButton('income-income-reason')"></el-button>
						</el-tooltip>
						<el-tooltip content="团单进件" v-if="$hasButton('income-income-groupOrder') && scope.row.masterOrder && (scope.row.auditStatus === 'sign_success' || scope.row.auditStatus === 'loan_success' || scope.row.auditStatus === 'repaymenting' || scope.row.auditStatus === 'overdue' || scope.row.auditStatus === 'repaymented' || scope.row.auditStatus === 'paid')">
							<el-upload
									class="btn-upload-group"
									:action="actionURL"
									:data="{orderNo: scope.row.orderNo}"
									:show-file-list="false"
									:on-success="handleImportSuccess"
							>
								<el-button type="text" icon="el-icon-circle-plus-outline" class="btn-operation"></el-button>
							</el-upload>
						</el-tooltip>
						<el-tooltip content="上传保单" v-if="$hasButton('income-income-uploadPolicy') && scope.row.auditStatus === 'loan_success' || scope.row.auditStatus === 'repaymenting' || scope.row.auditStatus === 'overdue' || scope.row.auditStatus === 'repaymented' || scope.row.auditStatus === 'paid'">
							<el-button type="text" icon="el-icon-upload2" class="btn-operation" @click="handleUploadPolicy(scope.row)" :disabled="scope.row.policyStatus !== 'not_uploaded'" ></el-button>
						</el-tooltip>
                        <el-tooltip content="订单转移" v-if="$hasButton('income-income-transfer')">
                            <el-button type="text" icon="iconfont icon-zhuanyi" class="btn-operation" @click="handleTransfer(scope.row)" :disabled="scope.row.subOrder"></el-button>
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
		</div>
		<el-dialog title="拒绝/退回原因" :visible.sync="dialog" @closed="handleClose">
			<el-form :model="rejectForm" ref="editRejectDialog">
				<el-form-item label="拒绝/退回原因" prop="auditResultMsg" class="roleForm" label-width="100px">
					<el-input type="textarea" :rows="3" v-model="rejectForm.auditResultMsg" disabled></el-input>
				</el-form-item>
				<el-form-item class="footer-content">
					<el-button type="primary" @click="handleClose">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog :title="transferMode === 'single' ? '订单转移' : '批量转移'" :visible.sync="transferVisible" append-to-body :close-on-click-modal="false" width="600px">
			<el-form :model="transferDetail" label-width="120px" :rules="transferRules" ref="transferDetail">
				<el-row>
					<el-col :span="18">
						<p class="batch-transfer-tip" v-if="transferMode === 'batch'">已选{{selectOrders.length}}条记录</p>
						<el-form-item label="所属渠道" prop="applyChannel">
							<el-input v-model.trim="transferDetail.applyChannelName"  disabled></el-input>
						</el-form-item>
						<el-form-item label="请选择业务员" prop="salesman">
							<el-select v-model.trim="transferDetail.salesman" placeholder="请选择业务员" style="width: 100%">
								<el-option v-for="item in salesManQyList" :key="item.value" :label="item.text" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="transferVisible = false">取消</el-button>
				<el-button type="primary" @click="transferConfirm" :disabled="transferLoading" :loading="transferLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="groupOrderVisible" append-to-body :close-on-click-modal="false" width="95%" :fullscreen="fullScreen" @closed="fullScreen = false">
			<div slot="title" class="full-screen-title"><i class="iconfont" :class="{'icon-quanpingzuidahua': !fullScreen, 'icon-tuichuquanping': fullScreen}" @click="fullScreen = !fullScreen"></i></div>
			<pt-search :items="groupItems" :params="groupSearchParams"></pt-search>
			<div class="pt-table margin-top20 inside-margin">
				<el-table :data="groupList" header-cell-class-name="thead" cell-class-name="tbody">
					<el-table-column label="贷款订单号" min-width="125px">
						<template slot-scope="scope">
							<div class="link-button">
								<i class="iconfont icon-tuangou group-icon" :class="{'text-red': scope.row.masterOrder}" v-if="scope.row.groupNo"></i>
								<span @click="handleCheckDetail(scope.row)" @dblclick="preventCheckDetail">{{scope.row.orderNo}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-for="(column,index) in columns.left" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
					<el-table-column label="前端状态">
						<template slot-scope="scope">
							<span>{{formatterMethod(scope.row.frontStatus)}}</span>
							<el-tooltip content="保单已上传" v-if="scope.row.policyStatus === 'uploaded' && (scope.row.auditStatus === 'loan_success' || scope.row.auditStatus === 'repaymenting' || scope.row.auditStatus === 'overdue' || scope.row.auditStatus === 'repaymented' || scope.row.auditStatus === 'paid')">
								<i class="el-icon-circle-check policy-status-icon"></i>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column v-for="(column,index) in columns.right" :key="columns.left.length + index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>

					<el-table-column label="操作" fixed="right" width="120">
						<template slot-scope="scope">
							<el-tooltip content="资料补充">
								<el-button type="text" icon="iconfont icon-wode-buchongziliaoICON" class="btn-operation" @click="handleAudit(scope.row)" :disabled="scope.row.auditStatus !== 'first_instance_running'" v-if="$hasButton('income-income-audit')"></el-button>
							</el-tooltip>
							<el-tooltip content="退回/拒绝理由">
								<el-button type="text" icon="el-icon-warning-outline" class="btn-operation btn-operation-delete" @click="handleCheckResult(scope.row)" :disabled="!(scope.row.frontStatus == 'reject' || scope.row.frontStatus == 'initial_return' || scope.row.frontStatus == 'running')" ></el-button>
							</el-tooltip>
							<el-tooltip content="团单进件" v-if="$hasButton('income-income-groupOrder') && scope.row.masterOrder && (scope.row.auditStatus === 'sign_success' || scope.row.auditStatus === 'loan_success' || scope.row.auditStatus === 'repaymenting' || scope.row.auditStatus === 'overdue' || scope.row.auditStatus === 'repaymented' || scope.row.auditStatus === 'paid')">
								<el-upload
										class="btn-upload-group"
										:action="actionURL"
										:data="{orderNo: scope.row.orderNo}"
										:show-file-list="false"
										:on-success="handleImportSuccess"
								>
									<el-button type="text" icon="el-icon-circle-plus-outline" class="btn-operation"></el-button>
								</el-upload>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
						background
						layout="jumper, prev, pager, next, sizes, total"
						:page-sizes="[10, 20, 30, 50, 100]"
						:total="groupTotal || 0"
						:current-page="groupSearchParams.pageNum"
						:page-size="groupSearchParams.pageSize"
						@size-change="handleSizeChange($event, 'groupSearchParams')"
						@current-change="handleCurrentChange($event, 'groupSearchParams')"
						:disabled="groupSearchLoading"
				></el-pagination>
			</div>
		</el-dialog>
	</div>

</template>

<script>
  import {getIncomeList, getAllChannel, getSalesManList, getGroupOrderList, singleOrderTransfer, batchOrderTransfer} from '@/service/income/income'
  import {filter_hidePhone, filter_formatMoney} from '../../lib/filters';
  import API from '@/constant/API';

  export default {
    name: "incomeList",
    data() {
      return {
        clickTimeId: null,
        loginAccountType: this.$getLocalStorage('userInfo').accountType,// 当前登录账号的性质
        list: [],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
		columns: {
          left: [
            {label: '产品名称', prop: 'productName'},
            {
              label: '申请金额', prop: 'loanAmount',
              formatter: (row, col, val) => {
                return filter_formatMoney(val)
              }
            },
            {label: '申请期限', prop: 'loanTerm', width: 80},
            {
              label: '借款费率', prop: 'loanFee', width: 80,
              formatter: (row, col, val) => {
                if (val) {
                  return `${this.$floatMultiply(val, 100)}%`
                } else {
                  return val
                }
              }
            },
            {label: '客户姓名', prop: 'fullName', width: 80},
            {
              label: '手机号码', prop: 'loginName',
              formatter: (row, col, val) => {
                if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
                  return filter_hidePhone(val)
                } else {
                  return val
                }
              }
            },
            {label: '车牌号', prop: 'carNo'},
            {label: '申请时间', prop: 'createdTime', width: 95},
            {label: '渠道', prop: 'applyChannelName'},
            {label: '业务员', prop: 'salesMan'},
          ],
          right: [
            {
              label: '风控结果',
              prop: 'falconRiskResultStatus',
              formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.FalconRiskStatusEnum)
            },
            {
              label: '审核状态',
              prop: 'auditStatus',
              formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.AuditStatusEnum)
            }
          ]
		},
        total: 0,
        channelList: [],
        salesManList: [],
        searchLoading: false,
        dialog: false,
        rejectForm: {
          auditResultMsg: ''
        },
        groupOrderVisible: false,
        groupSearchParams: {
          pageNum: 1,
          pageSize: 10
        },
        groupList: [],
        groupTotal: 0,
        groupSearchLoading: false,
        actionURL: window.location.protocol + "//" + window.location.host + API.INCOME.IMPORTGROUP,
        fullScreen: false,
        isSelectAll: false,
        isSelectAllDisabled: false,
        selectOrders: [],
        selectOrderApplyChannel: null,
        transferMode: '',
        transferVisible: false,
        transferDetail: {
          orderId: '',
          applyChannel: '',
          applyChannelName: '',
          salesman: ''
        },
        transferRules: {
          salesman: [
            {required: true, message: '请选择业务员', trigger: 'change'}
          ]
		},
        transferLoading: false,
        salesManQyList: []//启用的业务员账号
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '贷款订单号', key: 'orderNo', placeholder: ''},
          {type: 'input', label: '客户姓名', key: 'fullName', placeholder: ''},
          {type: 'input', label: '手机号码', key: 'mobilePhone', placeholder: ''},
          {
            type: 'dateRange',
            dateRange: {
              start: {label: '申请日期开始', key: 'applyDateStart', placeholder: ''},
              end: {label: '申请日期结束', key: 'applyDateEnd', placeholder: ''}
            }
          },
          {
            type: 'select',
            label: '渠道',
            key: 'applyChannel',
            placeholder: '',
			filterable:true,
			options: this.channelList,
            hidden: this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman'
          },
          {
            type: 'select',
            label: '业务员',
            key: 'salesman',
            placeholder: '',
            options: this.salesManList,
            hidden: this.loginAccountType === 'channelSalesman'
          },
          {
            type: 'select',
            label: '前端状态',
            key: 'frontStatus',
            placeholder: '',
            options: this.$store.state.enums.FrontStatusEnum
          },
          {
            type: 'select',
            label: '风控状态',
            key: 'falconRiskResultStatus',
            placeholder: '',
            options: this.$store.state.enums.FalconRiskStatusEnum
          },
          {
            type: 'select',
            label: '是否团单',
            key: 'isGroupNo',
            placeholder: '',
            options: [
              {text: '是', value: true},
              {text: '否', value: false}
            ]
          },
          {
            type: 'select',
            label: '保单状态',
            key: 'policyStatus',
            placeholder: '',
            options: this.$store.state.enums.PolicyStatusEnum
          },
          {type: 'input', label: '车牌号', key: 'carNo', placeholder: ''},
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
              {label: '批量转移', type: 'primary', function: this.handleBatchTransfer, hidden: !this.$hasButton('income-income-batchTransfer')},
            ]
          }
        ]
      },
      groupItems() {
        return [
          {type: 'input', label: '贷款订单号', key: 'orderNo', placeholder: ''},
          {
            type: 'select',
            label: '前端状态',
            key: 'frontStatus',
            placeholder: '',
            options: this.$store.state.enums.FrontStatusEnum
          },
          {
            type: 'select',
            label: '风控状态',
            key: 'falconRiskResultStatus',
            placeholder: '',
            options: this.$store.state.enums.FalconRiskStatusEnum
          },
          {
            type: 'buttonGroup',
            buttons: [
              {
                label: '查询',
                type: 'primary',
                function: this.handleClickSearchGroup,
                disabled: this.groupSearchLoading
              },
              {label: '重置', function: this.handleResetSearch}
            ]
          },
        ]
      }
    },
    watch: {
      'searchParams.applyChannel'(val) {
        if (!val) {
          this.salesManList = [];
          this.$set(this.searchParams, 'salesman', '');
        } else {
          this.getSalesMan(val)
        }
      }
    },
    created() {
      this.keyupSubmit();
      this.getAllChannel();
      // 渠道管理员 有业务员查询条件
      if (this.loginAccountType === 'channelAdmin') {
        this.getSalesMan();
      }
      this.getList()
    },
    methods: {
      formatterMethod(val) {
        return this.$filterSysEnumByDicCode(val, this.$enum.FrontStatusEnum)
      },
      //审核理由弹窗显示
      handleCheckResult(row) {
        this.dialog = true;
        if (row.falconRiskResultStatus === 'REJECT') {
          const {applySurface} = JSON.parse(row.falconRiskAsynchMsg);
          const decisionReason = applySurface ? applySurface.decisionReason : '';
          this.rejectForm.auditResultMsg = decisionReason && row.auditResultMsg ? `风控拒绝理由：${decisionReason}\n${row.auditResultMsg}` : decisionReason ? `风控拒绝理由：${decisionReason}` : row.auditResultMsg ? row.auditResultMsg : ''
        } else {
          this.rejectForm.auditResultMsg = row.auditResultMsg
		}
      },
      handleClose() {
        this.dialog = false
      },
      getList() {
        this.searchLoading = true;
        let search = this.$deepcopy(this.searchParams);
        if (search.hasOwnProperty('carNo')) {
          search = {
            carNo: search.carNo,
            pageSize: search.pageSize,
            pageNum: search.pageNum
          }
        }
        getIncomeList(search).then(res => {
          if (res.code === '200') {
            let list = res.body.list;
            if (list && list.length) {
              list.forEach(ele => {
                ele['isChecked'] = this.selectOrders.some(select => {
                  return select.id === ele.id
                });
                if (this.channelList && this.channelList.length) {
                  ele['applyChannelName'] = '';
                  this.channelList.forEach(item => {
                    if (ele.applyChannel === item.value) {
                      ele['applyChannelName'] = item.text
                    }
                  })
                }
              });
              if (list.every(ele => {
                return ele.subOrder
              })) {
                // 全为子单
                this.isSelectAllDisabled = true;
                this.isSelectAll = false;
              } else {
                this.isSelectAllDisabled = false;
                if (this.selectOrderApplyChannel) {
                  this.isSelectAll = !list.some(ele => {
                    return !ele.subOrder && !ele.isChecked && ele.applyChannel === this.selectOrderApplyChannel
                  })
                } else {
                  this.isSelectAll = false
                }
              }
            }
            this.list = list;
            this.total = res.body.total;
          }
        }).finally(() => {
          this.searchLoading = false;
        });
      },
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            if (this.groupOrderVisible) {
              this.handleClickSearchGroup()
            } else {
              this.handleClickSearch()
            }
          }
        }
      },
      handleResetSearch() {
        if (this.groupOrderVisible) {
          this.groupSearchParams = {
            pageNum: this.groupSearchParams.pageNum,
            pageSize: this.groupSearchParams.pageSize,
            masterOrderNo: this.groupSearchParams.masterOrderNo
          }
        } else {
          this.searchParams = {
            pageNum: this.searchParams.pageNum,
            pageSize: this.searchParams.pageSize
          }
        }
      },
      // 点击全选
      handleSelectAll() {
        if (this.isSelectAll) {
          if (this.selectOrders.length) {
            this.list.forEach(ele => {
              if (!ele.subOrder && ele.applyChannel === this.selectOrderApplyChannel) {
                if (!this.selectOrders.some(order => {
                  return ele.id === order.id
                })) {
                  this.selectOrders.push(ele)
                }
                ele.isChecked = true
              }
            })
          } else {
            for (let i = 0, len = this.list.length; i < len; i++) {
              if (!this.list[i].subOrder) {
                this.selectOrderApplyChannel = this.list[i].applyChannel;
                break;
              }
            }
            this.list.forEach(ele => {
              if (!ele.subOrder && ele.applyChannel === this.selectOrderApplyChannel) {
                this.selectOrders.push(ele);
                ele.isChecked = true
              }
            })
          }
        } else {
          this.list.forEach(ele => {
            ele.isChecked = false;
            for (let i = 0, len = this.selectOrders.length; i < len; i++) {
              if (this.selectOrders[i].id === ele.id) {
                this.selectOrders.splice(i, 1);
                break
              }
            }
          });
          if (!this.selectOrders.length) {
            this.selectOrderApplyChannel = null;
          }
        }
      },
      // 选择订单
      handleSelectOrder(row) {
        if (row.isChecked) {
          if (!this.selectOrders.some(ele => {
            return ele.id === row.id
          })) {
            this.selectOrders.push(row)
          }
        } else {
          for (let i = 0, len = this.selectOrders.length; i < len; i++) {
            if (row.id === this.selectOrders[i].id) {
              this.selectOrders.splice(i, 1);
              break
            }
          }
        }
        if (this.selectOrders.length) {
          this.selectOrderApplyChannel = this.selectOrders[0].applyChannel;
          this.isSelectAll = !this.list.some(ele => {
            return !ele.subOrder && !ele.isChecked && ele.applyChannel === this.selectOrderApplyChannel
          })
        } else {
          this.selectOrderApplyChannel = null;
          this.isSelectAll = false
        }
      },
      // 判断是否选中
      isChecked(row) {
        return this.selectOrders.some(ele => {
          return ele.id === row.id
        })
      },
      isDisabledSelect(row) {
        return this.selectOrderApplyChannel && row.applyChannel !== this.selectOrderApplyChannel
      },
      // 批量转移
      handleBatchTransfer() {
        if (this.selectOrders.length) {
          this.transferVisible = true;
          this.resetFields('transferDetail');
          this.transferMode = 'batch';
          this.transferDetail = {
            applyChannel: this.selectOrders[0].applyChannel,
            applyChannelName: this.selectOrders[0].applyChannelName,
            salesman: ''
          };
          this.getSalesMan(this.transferDetail.applyChannel, 'transfer');
        } else {
          this.$alert('请选择需要操作的记录', '提示', {
            confirmButtonText: '关闭',
            callback: () => {
            }
          })
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
          this.getGroupList()
        }
      },
      handleCurrentChange(pageNum, type) {
        this[type]['pageNum'] = pageNum;
        if (type === 'searchParams') {
          this.getList()
        } else {
          this.getGroupList()
        }
      },
      // 获取渠道
      getAllChannel() {
        getAllChannel().then(res => {
          if (res.code === '200') {
            this.channelList = [];
            if (res.body && res.body.length) {
              res.body.forEach(ele => {
                this.channelList.push({
                  text: ele.channelName,
                  value: ele.channelCode
                })
              })
            }
          }
        })
      },
      // 获取业务员
      getSalesMan(channel, type) {
        const salesManList = type ? 'salesManQyList' : 'salesManList';
        this[salesManList] = [];
        let params = {};
        if (!type) {
          this.$set(this.searchParams, 'salesman', '');
		} else {
          params.accountStatus = 'false'
		}
		if (channel) {
          params.channelCode = channel
		}
        getSalesManList(params).then(res => {
          if (res.code === '200') {
            if (res.body && res.body.length) {
              res.body.forEach(ele => {
                this[salesManList].push({text: `${ele.username}${ele.phone}`, value: ele.phone})
              })
            }
          }
        })
      },
      //查看页面
      handleCheckDetail(row) {
        clearTimeout(this.clickTimeId);  //首先清除计时器
        this.clickTimeId = setTimeout(() => {
          this.$router.push({
            name: 'incomeDetail',
            params: {orgCode: this.$route.params.orgCode, id: row.id}
          });
        }, 300);
      },
      //审核页面
      handleAudit(row) {
        this.$router.push({
          name: 'incomeAudit',
          params: {orgCode: this.$route.params.orgCode, id: row.id}
        });
      },
      handleUploadPolicy(row) {
        this.$router.push({
          name: 'incomeDetail',
          params: {orgCode: this.$route.params.orgCode, id: row.id, from: 'uploadPolicy'}
        });
      },
      preventCheckDetail() {
        clearTimeout(this.clickTimeId);  //清除
        return false
      },
      handleClickRelation(row) {
        this.groupOrderVisible = true;
        this.groupSearchParams = {
          pageNum: 1,
          pageSize: 10,
          masterOrderNo: row.groupNo
        };
        this.groupList = [];
        this.groupTotal = 0;
        this.getGroupList()
      },
      getGroupList() {
        this.groupSearchLoading = true;
        const search = this.$deepcopy(this.groupSearchParams);
        getGroupOrderList(search).then(res => {
          if (res.code === '200') {
            if (res.body.list && res.body.list.length) {
              if (this.channelList && this.channelList.length) {
                res.body.list.forEach(ele => {
                  ele['applyChannelName'] = '';
                  this.channelList.forEach(item => {
                    if (ele.applyChannel === item.value) {
                      ele['applyChannelName'] = item.text
                    }
                  })
                })
              }
            }
            this.groupList = res.body.list;
            this.groupTotal = res.body.total;
          }
        }).finally(() => {
          this.groupSearchLoading = false;
        });
      },
      handleClickSearchGroup() {
        this.groupSearchParams.pageNum = 1;
        this.getGroupList()
      },
      handleImportSuccess(res) {
        if (res.code === '200') {
          this.$alert(res.body, '提示', {
            confirmButtonText: '确定',
            callback: () => {
            }
          });
		} else {
          this.$message({
            showClose: true,
            type: 'error',
            message: res.message
          });
		}
      },
      resetFields(form) {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      // 订单转移
      handleTransfer(row) {
        this.transferVisible = true;
        this.resetFields('transferDetail');
        this.transferMode = 'single';
        this.transferDetail = {
          orderId: row.id,
          applyChannel: row.applyChannel,
          applyChannelName: row.applyChannelName,
          salesman: ''
        };
        this.getSalesMan(this.transferDetail.applyChannel, 'transfer');
      },
      transferConfirm() {
        this.$refs.transferDetail.validate(valid => {
          if (valid) {
            this.transferLoading = true;
            const transferData = {
              channelCode: this.transferDetail.applyChannel,
              phone: this.transferDetail.salesman
            };
            const success = (type) => {
              this.$message({
                showClose: true,
                type: 'success',
                message: type === 'batch' ? '批量转移成功' : '订单转移成功'
              });
              this.transferVisible = false;
              this.transferLoading = false;
              this.selectOrders = [];
              this.selectOrderApplyChannel = null;
              this.getList();
            };
            if (this.transferMode === 'single') {
              transferData.orderId = this.transferDetail.orderId;
              singleOrderTransfer(transferData).then(res => {
                if (res.code === '200') {
                  success('single');
                }
              }).finally(() => {
                this.transferLoading = false;
              })
            } else {
              transferData.orderIds = this.selectOrders.map(ele => {
                return ele.id
              });
              transferData.orderIds = JSON.stringify(transferData.orderIds);
              batchOrderTransfer(transferData).then(res => {
                if (res.code === '200') {
                  success('batch');
                }
              }).finally(() => {
                this.transferLoading = false;
              })
            }
          } else {
            return false;
          }
        })
      }
    },
    beforeDestroy() {
      clearTimeout(this.clickTimeId);
    },
  }
</script>

<style lang="scss">
	.income-search-container{
		position: relative;
		padding-bottom: 25px;
		background: #F6F7FB;
		.car-search-tip{
			position: absolute;
			left: 20px;
			bottom: 0;
			font-size: 14px;
		}
	}
    .link-button {
        color: #409EFF;
        line-height: 1;
        padding: 13px 0;
        text-align: center;
        span {
            cursor: pointer;
        }
    }

    .group-icon {
        color: #409EFF;
        margin: 0 7px 0 -10px;
		font-size: 20px;
        &.link {
            cursor: pointer;
        }
        &.text-red {
            color: red;
        }
    }

    .btn-upload-group {
        display: inline-block;
        margin: 0 10px;
    }

    .btn-upload-tuandan {
        display: inline-block;
        margin-left: 10px;
    }

	.policy-status-icon{
		position: relative;
		top: 1px;
		margin-left: 3px;
		font-size: 16px;
		color: red;
	}

    .link-button.frontStatus {
        text-decoration: underline;
    }

    .footer-content {
        margin-left: 20px;
    }

	.batch-transfer-tip{
		margin: 0 0 22px;
		padding-left: 50px;
	}
</style>