<template>
    <div>
        <div class="loan-search-container">
            <pt-search :items="items" :params="searchParams"></pt-search>
            <p class="car-search-tip">备注：若输入车牌号查询，则其他查询条件失效</p>
        </div>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                <el-table-column prop="orderNo" label="订单号" width="220px">
                    <template slot-scope="scope">
                        <span class="cell-word" @click="handleDetail(scope.row)" @dblclick="preventCheckDetail">
                            {{scope.row.orderNo}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop"
                                 :label="column.label"
                                 :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="还款账单">
                            <el-button type="text" icon="iconfont icon-zhangdan1" class="btn-operation" @click="handleClickBill(scope.row)" v-if="$hasButton('loan-loanOrder-bill')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="退保">
                            <el-button type="text" icon="iconfont icon-tui" class="btn-operation" @click="handleClickQuitBill(scope.row)"  :disabled="scope.row.frontStatus&&(scope.row.frontStatus==='paid'||scope.row.frontStatus==='policy_return'||scope.row.frontStatus==='prepayment')" v-if="$hasButton('loan-loanOrder-quitBill')"></el-button>
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
            <el-dialog title="还款账单"  :visible.sync="reimbursementBillVisible" :fullscreen="fullScreen" append-to-body width="60%"
                       :close-on-click-modal="false" @close="billEmptyDetail" class="diaFull">
                <div slot="title" class="full-screen-title">还款账单
                    <i class="iconfont" :class="{'icon-quanpingzuidahua': !fullScreen, 'icon-tuichuquanping': fullScreen}"
                       @click="fullScreen = !fullScreen"></i></div>
                <billPay
                  :id = 'loanId'
                  :visible = 'reimbursementBillVisible'
                    ></billPay>
            </el-dialog>
            <el-dialog title="退保" center :visible.sync="outBillVisible" append-to-body width="30%" :close-on-click-modal="false">
                <div class="prudentOperation">
                    是否确定退保<span>{{quitBill.orderNo}}</span>?
                </div>
                <div class="tips">
                    (退保后该笔订单将直接终止，请谨慎操作)
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleClickSave">确定退保</el-button>
                    <el-button @click="outBillVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
  import {
    getLoanManageList,
    exportExcel,
    surrenderLoan
  } from '../../service/loanManage/loanOrders'
  import {filter_formatMoney} from '../../lib/filters'

  import billPay from '../components/billPay'
  import {getAllChannel,getSalesManList} from '@/service/income/income'


  export default {
      name: 'loanOrders',
      components: {billPay},
      data() {
        return {
          loginAccountType: this.$getLocalStorage('userInfo').accountType,// 当前登录账号的性质
          reimbursementBillVisible: false,
          outBillVisible:false,
          searchLoading: false,
          total: 0,
          list: [],
          loanId: '',
          quitBill:{
            orderNo:'',
            applyId:''
          },

          fullScreen: false,
          channelList: [],
          salesManList: [],
          loanDetail: [],
          repayDescList: [],
          repayDecsTable: [],
          searchParams: {
            pageNum: 1,
            pageSize: 10
          },
          columns: [
            {label: '产品名称', prop: 'productName'},
            {label: '借款客户', prop: 'fullName'},
            {label: '手机号', prop: 'mobilePhone'},
            {label: '车牌号', prop: 'carNo'},
            {
              label: '借款金额', prop: 'loanAmount',
              formatter: (row, col, val) => {
                return filter_formatMoney(val)
              }
            },
            {label: '借款期限', prop: 'loanTerm'},
            {
              label: '借款费率', prop: 'loanFee',
              formatter: (row, col, val) => {
                if (val) {
                  return `${this.$floatMultiply(val, 100)}%`
                } else {
                  return val
                }
              }
            },
            {label: '放款时间', prop: 'loanDate', width: 95},
            {label: '渠道', prop: 'applyChannel'},
            {label: '业务员', prop: 'salesMan'},
            {
              label: '账单状态',
              prop: 'frontStatus',
              formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.PayStatusType)
            },
          ],
        }
      },
    computed:{
        items() {
          return [
          {type: 'input', label: '贷款订单号', key: 'orderNo', placeholder: ''},
          {type: 'input', label: '客户姓名', key: 'fullName', placeholder: ''},
          {type: 'input', label: '手机号码', key: 'mobilePhone', placeholder: ''},
          {
            type: 'dataTime',
            dataTime: {
              start: {label: '放款时间开始', key: 'loanDateStart', placeholder: ''},
              end: {label: '放款时间结束', key: 'loanDateEnd', placeholder: ''}
            }
          },
          {
            type: 'select',
            label: '账单状态',
            key: 'frontStatus',
            placeholder: '',
            options: this.$store.state.enums.PayStatusType
          },
          {
            type: 'select',
            label: '渠道',
            key: 'applyChannel',
            placeholder: '',
            filterable: true,
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
          {type: 'input', label: '车牌号', key: 'carNo', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {
                label: '查询',
                type: 'primary',
                function: this.handleClickSearch,
                disabled: this.searchLoading
              },
              {label: '重置', function: this.handleResetSearch},
            ]
          },
            {
              type: 'rightButtonGroup',
              buttons: [
                {label: '导出', type: 'primary', function: this.exportExcel, disabled: this.exportLoading, hidden: !this.$hasButton('loan-loanOrder-export')}
              ]
            }
        ]
        },
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
      methods: {
          keyupSubmit() {
              document.onkeydown = () => {
                  // 回车键，获取焦点的控件非分页功能中页码跳转输入框
                  if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
                      this.handleClickSearch()
                  }
              }
          },
        handleClickSave(){
          this.changeLoanStatus();
          this.outBillVisible = false;
        },
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
        handleClickQuitBill(row){
            this.outBillVisible = true;
            this.quitBill ={
              orderNo:row.orderNo,
              applyId:row.id
            }
        },
        changeLoanStatus(){
          const search = this.$deepcopy(this.quitBill);
          surrenderLoan({applyId:search.applyId}).then(res=>{
            if(res.code ==='200'){
              this.$message({
                showClose: true,
                type: 'success',
                message: res.body
              });
              this.getList()
            }
          })
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
              getLoanManageList(search).then(res => {
                  if (res.code === '200') {
                      if (res.body.list && res.body.list.length) {
                          if (this.channelList && this.channelList.length) {
                              res.body.list.forEach(ele => {
                                  // ele['applyChannelName'] = '';
                                  this.channelList.forEach(item => {
                                      if (ele.applyChannel === item.value) {
                                          ele['applyChannel'] = item.text
                                      }
                                  })
                              })
                          }
                      }
                      this.list = res.body.list;
                      this.total = res.body.total;
                  }
              }).finally(() => {
                  this.searchLoading = false;
              });
          },
          handleSizeChange(val) {
              this.searchParams.pageSize = val;
              this.getList()
          },
          handleCurrentChange(val) {
              this.searchParams.pageNum = val;
              this.getList()
          },
          handleClickSearch() {
              this.searchParams.pageNum = 1;
              this.getList()

          },
          billEmptyDetail() {
            this.fullScreen = false
          },
          handleResetSearch() {
              this.searchParams = {
                  pageNum: this.searchParams.pageNum,
                  pageSize: this.searchParams.pageSize
              }
          },
          handleDetail(row) {
              clearTimeout(this.clickTimeId);  //首先清除计时器
              this.clickTimeId = setTimeout(() => {
                  this.$router.push({
                      name: 'loanDetail',
                      params: {orgCode: this.$route.params.orgCode, id: row.id}
                  });
              }, 300);
          },
          preventCheckDetail() {
              clearTimeout(this.clickTimeId);  //清除
              return false
          },
          handleClickBill(row) {
              this.reimbursementBillVisible = true;
              this.loanId = row.id.toString()
          },
        // 导出excel
        exportExcel() {
          this.exportLoading = true;
          let search = this.$deepcopy(this.searchParams);
          delete search.pageSize;
          delete search.pageNum;
          if (search.hasOwnProperty('carNo')) {
            search = {
              carNo: search.carNo
            }
          }
          exportExcel(search).then(res => {
            let data = res.data;
            let downloadFile = () => {
              let filename = res.header['content-disposition']
                ? res.header['content-disposition'].split('filename=')[1]
                : 'customer_list.xlsx';
              filename = decodeURI(filename);
              this.$downloadFile(data, filename, 'application/vnd.ms-excel');
            };
            try {
              let reader = new FileReader();
              reader.onload = e => {
                if (e.target.result.indexOf('code') !== -1) {
                  if (JSON.parse(e.target.result).code !== '200') {
                    this.$message({
                      showClose: true,
                      type: 'error',
                      message: JSON.parse(e.target.result).message || '服务器异常，请稍后重试'
                    });
                  }
                } else {
                  downloadFile()
                }
              };
              reader.readAsText(data)
            } catch (e) {
              downloadFile()
            }
          }).finally(() => {
            this.exportLoading = false;
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
                                  value: ele.channelCode,
                              })
                          })
                      }
                  }
              })
          },
      },
    created() {
      this.keyupSubmit();
      this.getAllChannel();
      this.getList();
      // 渠道管理员 有业务员查询条件
      if (this.loginAccountType === 'channelAdmin') {
        this.getSalesMan();
      }
    },
    beforeDestroy() {
      clearTimeout(this.clickTimeId);
    },
  }
</script>
<style lang="scss" scoped>
    .loan-search-container{
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
    .cell-word {
        color: #0c95ff;
        cursor: pointer;
    }
    .user-table {
        border: 1px solid #ebeef5;
        line-height: 38px;
        margin-top: 20px;
        color: #909399;
        padding: 8px 0;
    .user-table-th {
        padding-left: 15px;
    }
    }
    .screenCss{

        margin-left: 80%;

    }
    .border_top{
        border-top-style:solid
    }
    .prudentOperation{
        text-align: center;
        font-size: 16px;
        padding: 14px 0 0 0;
    }
    .tips{
        text-align: center;
    }

</style>