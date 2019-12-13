<template>
  <div class="customer">
    <div class="custom-table">
      <el-row class="base-model-title"><h3><span>基本信息</span></h3></el-row>
      <el-row class="custom-row">
        <el-col :span="6" class="custom-col">
          <span>登录账户：</span> <span>{{basicDetail.phone}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>用户姓名：</span> <span>{{basicDetail.username}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>证件号码：</span> <span>{{basicDetail.idCard}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>银行卡所属银行：</span> <span>{{basicDetail.bankName}}</span>
        </el-col>
      </el-row>
      <el-row class="custom-row">
        <el-col :span="6" class="custom-col">
          <span>银行卡号：</span> <span>{{basicDetail.accNo}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>用户性别：</span> <span>{{basicDetail.sex | filter_sex}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>对公银行卡号：</span> <span>{{basicDetail.publicBankCardNo}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>对公银行卡所属银行：</span> <span>{{basicDetail.publicBankCardName}}</span>
        </el-col>
      </el-row>
      <el-row class="custom-row">
        <el-col :span="6" class="custom-col">
          <span>企业名称：</span> <span>{{basicDetail.businessName}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>企业证件号：</span> <span>{{basicDetail.certNumber}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>常用手机号码：</span> <span>{{basicDetail.commonlyPhone || '暂无'}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="custom-table">
      <el-row class="base-model-title"><h3><span>西安银行存管信息</span></h3></el-row>
      <el-row class="custom-row">
        <el-col :span="6" class="custom-col">
          <span>西安银行电子账户：</span> <span>{{xacgDetail.custNo}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>账户性质：</span> <span>{{xacgDetail.cusType}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>存管账户可提现余额：</span> <span>{{xacgDetail.availableBalance}}</span>
        </el-col>
      </el-row>
      <el-row class="custom-row">
        <el-col :span="6" class="custom-col">
          <span>开户银行卡号：</span> <span>{{xacgDetail.cardNo}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>开户卡所属银行：</span> <span>{{xacgDetail.bankName}}</span>
        </el-col>
        <el-col :span="6" class="custom-col">
          <span>开户预留手机号：</span> <span>{{xacgDetail.preMobile}}</span>
        </el-col>
      </el-row>
    </div>

    <el-tabs class="mgt20" type="border-card" v-model="activeName">
      <el-tab-pane label="借款记录" name="loanList">
        <div class="pt-table margin-top20 inside-margin">
          <el-table :data="loanList" header-cell-class-name="thead" cell-class-name="tbody">
            <el-table-column v-for="(column,index) in loanListColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
          </el-table>
          <el-pagination
                  background
                  layout="jumper, prev, pager, next, sizes, total"
                  :page-sizes="[10, 20, 30, 50, 100]"
                  :total="total || 0"
                  :current-page="searchParams.pageNum"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :disabled="loanListSearchLoading"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {basicInfo, loanList} from '@/service/customer/customer'
  export default {
    name: "customerDetail",
    data() {
      return {
        userId: null,
        basicDetail: {},
        xacgDetail: {},
        bankList: [],
        loanListColumns: [
          {label: '贷款订单号', prop: 'orderNo'},
          {label: '产品名称', prop: 'productName'},
          {
            label: '类型', prop: 'applyType',
            formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.ApplyTypeEnum)
          },
          {label: '借款金额（元）', prop: 'loanAmount'},
          {label: '借款期限', prop: 'loanTerm'},
          {label: '借款申请时间', prop: 'createdTime'},
        ],
        activeName: 'loanList',
        loanList: [],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        loanListSearchLoading: false
      }
    },
    created() {
      this.userId = this.$route.params.id || null;
      if(this.userId !== null) {
        this.getBasicInfo();
        this.getLoanList();
      }
    },
    methods: {
      //获取用户基本信息
      getBasicInfo() {
        basicInfo(this.userId).then((res)=> {
          if(res.code === '200') {
            this.basicDetail = res.body
          }
        })
      },
      //查询西安存管开户信息
      queryXacg() {
        /*queryXacg(this.id).then((res)=> {
          if(res.code === '200') {
            this.xacgDetail.availableBalance = res.body.availableBalance;
            this.xacgDetail.cusType = res.body.cusType === '1' ? '对私' : '';
            this.xacgDetail.cardNo = res.body.cardNo ? res.body.cardNo.substr(res.body.cardNo.length-4) : '';
            this.xacgDetail.bankName = res.body.bankName;
            this.xacgDetail.custNo = res.body.custNo;
          }
        })*/
      },
      //查询资金账户信息
      queryAccont() {
        /*queryAccont(this.id).then((res)=> {
          if(res.code === '200') {
            this.basicDetail.availableBalance = res.body ? res.body.availableBalance : '';
          }
        })*/
      },
      getLoanList() {
        this.loanListSearchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        search.userId = this.userId;
        loanList(search).then(res => {
          if (res.code === '200') {
            this.loanList = res.body.list;
            this.total = res.body.total;
          }
        }).finally(() => {
          this.loanListSearchLoading = false;
        });
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getLoanList();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getLoanList();
      }
    }
  }
</script>

<style lang="scss">
  .customer{
    padding: 10px 20px;
    .base-model-title {
      h3 {
        font-weight: normal;
        line-height: 2em;
        height: 2em;
        font-size: 14px;
        span {
          color: #409eff;
          padding-left: 10px;
          border-left: 3px solid #409eff;
        }
      }
    }
    .custom-table {
      color: #909399;
      .custom-row{
        border: 1px solid #ebeef5;
        border-bottom: none;
        line-height: 35px;
        padding: 5px 0;
        &:last-child{
          border-bottom: 1px solid #ebeef5;
        }
        .custom-col {
          padding-left: 15px;
          font-size: 15px;
        }
      }
    }
    .mgt20 {
      margin-top: 20px;
    }
  }
</style>