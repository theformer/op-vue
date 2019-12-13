<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
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
    </div>

</template>

<script>
  import {getBillPageInfo,exportShoudlExcel} from '../../service/loanManage/loanOrders'
  import {getAllChannel,getSalesManList} from '@/service/income/income'
  import {filter_formatMoney} from '../../lib/filters'


  export default {
    name: "shouldBill.vue",
    data() {
      return {
        list: [],
        channelList: [],
        salesManList: [],
        loginAccountType: this.$getLocalStorage('userInfo').accountType,// 当前登录账号的性质
        searchLoading: false,
        exportLoading: false,
        total: 0,
        columns: [
          {label: '产品名称', prop: 'productName'},
          {label: '客户姓名', prop: 'fullName'},
          {label: '手机号码', prop: 'mobilePhone'},
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
          {label: '渠道', prop: 'applyChannel'},
          {label: '业务员', prop: 'salesMan'},
          {label: '当前期数', prop: 'repayNum'},
          {
            label: '账单状态', prop: 'repaid',
            formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.RepaidType)
          },
          {label: '应还日期', prop: 'repayDate'},
          {label: '逾期天数', prop: 'delayDay'},
          {label: '待还本金', prop: 'principal'},
          {label: '待还利息', prop: 'interest'},
          {label: '待还管理费', prop: 'manageFee'},
          {label: '待还逾期罚息', prop: 'delayInterest'},
          {label: '待还逾期管理费', prop: 'delayManage',},
          {label: '待还总金额', prop: 'repayAmount'},
        ],
        searchParams: {
          pageNum: 1,
          pageSize: 10,
          type: 1
        }
      }
    },
      computed:{
        items(){
          return [
          {type: 'input', label: '贷款订单号', key: 'orderNo', placeholder: ''},
          {type: 'input', label: '客户姓名', key: 'fullName', placeholder: ''},
          {type: 'input', label: '手机号码', key: 'mobilePhone', placeholder: ''},
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
            {
              type: 'dataTime',
              dataTime: {
                start: {label: '应还日期开始', key: 'repayDateStart', placeholder: '',},
                end: {label: '应还日期结束', key: 'repayDateEnd', placeholder: ''}
              }
            },
          {
            type: 'select',
            label: '账单状态',
            key: 'repaid',
            placeholder: '',
            options: this.$store.state.enums.RepaidType2
          },
          {
            type: 'buttonGroup',
            buttons: [
              {
                label: '查询',
                type: 'primary',
                function: this.handleClickSearch,
                disabled: this.searchLoading
              },
              {label: '重置',type:'primary', function: this.handleResetSearch},
            ]
          },
            {
              type: 'rightButtonGroup',
              buttons: [
                {label: '导出',  function: this.exportShoudlExcel, disabled: this.exportLoading, hidden: !this.$hasButton('loan-shouldBill-export')}
              ]
            }
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
    methods: {
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            this.handleClickSearch()
          }
        }
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
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getBillPageInfo(search).then(res => {
          if (res.code === '200') {
            if (res.body.list && res.body.list.length) {
              if (this.channelList && this.channelList.length) {
                res.body.list.forEach(ele => {
                  this.channelList.forEach(item => {
                    if (ele.applyChannel === item.value) {
                      ele['applyChannel'] = item.text
                    }
                  })
                })
              }
            }
            this.list = res.body.list;
            for(let i = 0;i <this.list.length;i++){
              this.list[i].repayDate = this.list[i].repayDate.slice(0,10);
              if(!this.list[i].delayDay){
                this.list[i].delayDay = 0
              }
            }
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
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize,
          type:this.searchParams.type
        }
      },
      handleDetail(row) {
        clearTimeout(this.clickTimeId);  //首先清除计时器
        this.clickTimeId = setTimeout(() => {
          this.$router.push({
            name: 'loanDetail',
            params: {orgCode: this.$route.params.orgCode, id: row.id},
          });
        }, 300);
      },
      preventCheckDetail() {
        clearTimeout(this.clickTimeId);  //清除
        return false
      },
      exportShoudlExcel() {
        this.exportLoading = true;
        const search = this.$deepcopy(this.searchParams);
        delete search.pageSize;
        delete search.pageNum;
        exportShoudlExcel(search).then(res => {
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
                  value: ele.channelCode
                })
              })
            }
          }
        })
      },
    },
    created() {
        this.getList();
      this.keyupSubmit();
      this.getAllChannel();
      // 渠道管理员 有业务员查询条件
      if (this.loginAccountType === 'channelAdmin') {
        this.getSalesMan();
      }
    }
  }
</script>

<style scoped>
    .cell-word {
        color: #409EFF;
        line-height: 1;
        padding: 13px 0;
        text-align: center;
        cursor: pointer;
    }
</style>