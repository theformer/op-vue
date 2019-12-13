<template>
    <div class="billPay">
        <el-form v-model="loanDetail" class="user-table">
            <el-row>
                <el-col :span="12" class="user-table-th">
                    <span class="user-table-size">借款金额:</span> <span class="user-table-left">{{loanDetail.loanAmount}}元</span>
                </el-col>
                <el-col :span="12" class="user-table-th">
                    <span class="user-table-size">借款费率:</span> <span class="user-table-left">{{loanDetail.loanFee}}%</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">车牌号:</span> <span class="user-table-left">{{loanDetail.carNo}}</span>
                </el-col>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">借款期限:</span> <span class="user-table-left">{{loanDetail.loanTerm}}期</span>
                </el-col>
                <el-col :span="12" class="user-table-th">
                    <span class="user-table-size">本息偿还方式:</span> <span class="user-table-left">{{loanDetail.repayMethod}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="user-table-th"  v-if="loanDetail.repayMethod === '先息后本(一次付息，每期还本)'">
                    <span class="user-table-size">先息利息:</span> <span class="user-table-left">{{loanDetail.sumInterest}}元</span>
                </el-col>
                <el-col :span="6" class="user-table-th" v-if="loanPattern ==='margin'">
                    <span class="user-table-size">保证金金额:</span> <span class="user-table-left">{{loanDetail.depositAmt}}元</span>
                </el-col>
                <el-col :span="6" class="user-table-th" v-if="loanPattern ==='margin'">
                    <span class="user-table-size">保证金用途:</span> <span class="user-table-left">{{loanDetail.depositUse}}</span>
                </el-col>
                <el-col :span="6" class="user-table-th" v-if="loanPattern ==='payment'">
                    <span class="user-table-size">首付款金额:</span> <span class="user-table-left">{{loanDetail.paymentAmt}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">应还本金:</span> <span class="user-table-left">{{loanDetail.sumPrincipal}}</span>
                </el-col>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">应还总额:</span> <span class="user-table-left">{{loanDetail.sumRepayAmount}}元</span>
                </el-col>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">已还本金:</span> <span class="user-table-left">{{loanDetail.sumActualPrincipal}}</span>
                </el-col>
                <el-col :span="6" class="user-table-th">
                    <span class="user-table-size">已还总额:</span> <span class="user-table-left">{{loanDetail.sumActualAmount}}元</span>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="repayDescList" border>
            <el-table-column v-for="(col, index) in repayDecsTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter"
                             :key="index" align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
  import {
    getLoanApplyDetail
  } from '../../service/loanManage/loanOrders'
  export default {
      props:{
          id: String,
          visible:Boolean
      },
    name: 'billPay',
    data() {
      return {
          loanDetail: {
              loanAmount: '',
              loanFee: '',
              carNo: '',
              loanTerm: '',
              repayMethod: '',
              sumInterest: '',
              depositAmt: '',
              sumPrincipal: '',
              sumRepayAmount: '',
              sumActualPrincipal: '',
              sumActualAmount: '',
              paymentAmt:'',
              depositUse:''
          },
          loanPattern:'',
          repayDescList: [],
          repayDecsTable: [
              {
                  label: "期数",
                  prop: "repayNum"
              },
              {
                  label: "应还款日",
                  prop: "repayDate"
              },
              {
                  label: "应还本金",
                  prop: "principal"
              },
              {
                  label: "应还利息",
                  prop: "interest",
              },
              {
                  label: "应还管理费",
                  prop: "manageFee"
              },
              {
                  label: "应还金额",
                  prop: "repayAmount"
              },
              {
                  label: "实际还款日",
                  prop: "actualRepayDate"
              },
              {
                  label: "实还本金",
                  prop: "actualPrincipal"
              },
              {
                  label: "实还利息",
                  prop: "actualInterest"
              },
              {
                  label: "实还管理费",
                  prop: "actualManageFee"
              },
              {
                  label: "实还金额",
                  prop: "actualAmount"
              },
              {
                  label: "还款状态",
                  prop: "repaid",
                  formatter: (row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.RepaidType)
              },
          ]
      }
    },
    methods: {
        getLoanApplyDetail(){
            getLoanApplyDetail({applyId:this.id}).then(res =>{
                if(res.code === '200'){
                    this.loanPattern = res.body.loanProduct.loanPattern;
                    this.loanDetail = res.body.loanApply;
                    this.loanDetail.paymentAmt = res.body.paymentAmt
                    this.loanDetail.carNo = res.body.carNo;
                    this.loanDetail.depositAmt = res.body.depositAmt;
                    this.loanDetail.depositUse = res.body.loanProduct.depositUse;
                    this.loanDetail.sumActualAmount = res.body.sumActualAmount;
                    this.loanDetail.sumActualPrincipal = res.body.sumActualPrincipal;
                    this.loanDetail.sumInterest = res.body.sumInterest;
                    this.loanDetail.sumPrincipal = res.body.sumPrincipal;
                    this.loanDetail.sumRepayAmount = res.body.sumRepayAmount;
                    this.loanDetail.loanFee = this.$floatMultiply(this.loanDetail.loanFee, 100);
                    this.repayDescList = res.body.loanBillDetails;
                    this.loanDetail.repayMethod= this.$filterSysEnumByDicCode(res.body.loanProduct.repayMethod, this.$enum.RepayType);
                    for (let i=0 ;i <this.repayDescList.length;i++){
                        if(this.repayDescList[i].interest ===null || this.repayDescList[i].interest === 0){
                            this.repayDescList[i].interest = '/'
                        }
                        if(this.repayDescList[i].manageFee ===null || this.repayDescList[i].manageFee === 0){
                            this.repayDescList[i].manageFee = '/'
                        }
                        if(this.repayDescList[i].actualInterest ===null || this.repayDescList[i].actualInterest === 0){
                            this.repayDescList[i].actualInterest = '/'
                        }
                        if(this.repayDescList[i].actualManageFee ===null || this.repayDescList[i].actualManageFee === 0){
                            this.repayDescList[i].actualManageFee = '/'
                        }
                      this.repayDescList[i].repayDate  = this.repayDescList[i].repayDate.substr(0,10);
                        if( this.repayDescList[i].actualRepayDate){
                            this.repayDescList[i].actualRepayDate = this.repayDescList[i].actualRepayDate.substr(0,10);
                        }
                    }
                    if(this.loanDetail.sumPrincipal ==null || this.loanDetail.sumPrincipal === 0){
                        this.loanDetail.sumPrincipal = '/'
                        for (let i = 0;i<this.repayDescList.length;i++){
                            this.repayDescList[i].principal = this.loanDetail.sumPrincipal
                        }
                    }
                    if(this.loanDetail.sumActualPrincipal ==null || this.loanDetail.sumActualPrincipal === 0){
                        this.loanDetail.sumActualPrincipal = '/';
                        for (let i = 0;i<this.repayDescList.length;i++){
                            this.repayDescList[i].actualPrincipal = this.loanDetail.sumActualPrincipal
                        }
                    }
                }
            })
        },

    },
    created() {
      this.getLoanApplyDetail()
    },
    watch:{
          'visible'(val){
              if(val){
                  this.getLoanApplyDetail()
              }
          }
    },
    computed:{
    }
  }
</script>
<style lang="scss" scoped>
    .cell-word {
        cursor: pointer;
    }
    .user-table {
        border: 1px solid #ebeef5;
        border-bottom: none;
        line-height: 38px;
        margin-top: 20px;
        padding: 16px 0;
        font-size: 14px;
        .user-table-th {
            padding-left: 15px;
            .user-table-left{
                padding-left: 12px;
            }
            .user-table-size{
            /*background: rgba(232,246,253,0.66);*/
        }
        }
    }
</style>

