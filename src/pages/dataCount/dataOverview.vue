<template>
    <div class="data-overview">
        <el-row>
            <el-col :span="22" :offset="1">
                <el-card class="top-container" shadow="never">
                    <ul class="top-line">
                        <li>
                            <p>¥{{loanStatistics.sumLoanAmt}}</p>
                            <span>放款金额</span>
                            <el-tooltip content="从开始放款至今累计放款总本金">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>¥{{loanStatistics.sumPayAmt}}</p>
                            <span>待还总金额</span>
                            <el-tooltip content="所有已放款订单的待还总金额，包含本金，利息，逾期费用等">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>¥{{loanStatistics.sumDelayAmt}}</p>
                            <span>逾期金额</span>
                            <el-tooltip content="当前订单状态为“已逾期”的订单的总逾期金额，包含本金，利息及其他费用">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>¥{{loanStatistics.sumPaidAmt}}</p>
                            <span>已还总金额</span>
                            <el-tooltip content="所有已放款订单的实还总金额，包含本金，利息及其他费用">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                    </ul>
                    <ul class="top-line">
                        <li>
                            <p>{{loanStatistics.sumLoanCount}}</p>
                            <span>放款笔数</span>
                            <el-tooltip content="从开始放款至今累计放款总笔数">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>{{loanStatistics.sumPayCount}}</p>
                            <span>还款中笔数</span>
                            <el-tooltip content="当前订单状态为“还款中”的订单的总笔数">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>{{loanStatistics.sumDelayCount}}</p>
                            <span>逾期笔数</span>
                            <el-tooltip content="当前订单状态为“已逾期”的订单的总笔数">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                        <li>
                            <p>{{loanStatistics.sumPaidCount}}</p>
                            <span>已结清笔数</span>
                            <el-tooltip content="当前订单状态为“已结清”的订单的总笔数">
                                <el-button type="text" icon="el-icon-warning-outline"></el-button>
                            </el-tooltip>
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="margin-top15">
            <el-col :span="22" :offset="1">
                <el-card class="loan-container" shadow="never">
                    <div class="title-container">
                        <div class="title">放款情况</div>
                        <el-form label-width="100px" :inline="true">
                            <el-row>
                                <el-col :span="23" :offset="1">
                                    <el-form-item label="时间统计范围">
                                        <el-date-picker
                                                v-model="loanSuccessSearchParams.date"
                                                type="daterange"
                                                value-format="yyyy-MM-dd"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                :clearable="false"
                                                :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-select v-model="loanSuccessSearchParams.unit">
                                            <el-option v-for="(item, index) in timeOptions" :key="index" :label="item.text" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="drawLoanSuccess" :disabled="loanSuccessDataLoading">搜索</el-button>
                                        <el-button @click="handleExport('Success')" :disabled="exportSuccessLoading" v-if="$hasButton('dataCount-dataOverview-export')">导出数据</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="echarts" id="loan-success"></div>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="margin-top15">
            <el-col :span="22" :offset="1">
                <el-card class="loan-container" shadow="never">
                    <div class="title-container">
                        <div class="title">待还款数据统计</div>
                        <el-form label-width="100px" :inline="true">
                            <el-row>
                                <el-col :span="23" :offset="1">
                                    <el-form-item label="时间统计范围">
                                        <el-date-picker
                                                v-model="loanPaySearchParams.date"
                                                type="daterange"
                                                value-format="yyyy-MM-dd"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                :clearable="false"
                                                :picker-options="loanPayPickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-select v-model="loanPaySearchParams.unit">
                                            <el-option v-for="(item, index) in timeOptions" :key="index" :label="item.text" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="drawLoanPay" :disabled="loanPayDataLoading">搜索</el-button>
                                        <el-button @click="handleExport('Pay')" :disabled="exportPayLoading" v-if="$hasButton('dataCount-dataOverview-export')">导出数据</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="echarts" id="loan-pay"></div>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="margin-top15">
            <el-col :span="22" :offset="1">
                <el-card class="loan-container" shadow="never">
                    <div class="title-container">
                        <div class="title">还款情况</div>
                        <el-form label-width="100px" :inline="true">
                            <el-row>
                                <el-col :span="23" :offset="1">
                                    <el-form-item label="时间统计范围">
                                        <el-date-picker
                                                v-model="loanPaidSearchParams.date"
                                                type="daterange"
                                                value-format="yyyy-MM-dd"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                :clearable="false"
                                                :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-select v-model="loanPaidSearchParams.unit">
                                            <el-option v-for="(item, index) in timeOptions" :key="index" :label="item.text" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="drawLoanPaid" :disabled="loanPaidDataLoading">搜索</el-button>
                                        <el-button @click="handleExport('Paid')" :disabled="exportPaidLoading" v-if="$hasButton('dataCount-dataOverview-export')">导出数据</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="echarts" id="loan-paid"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/pie';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/dataZoom';

  import {getLoanStatistics, exportLoanSuccess, exportLoanPay, exportLoanPaid, getLoanSuccessByTime, getLoanPayByTime, getLoanPaidByTime} from '@/service/dataCount/dataCount';
  import {filter_formatMoney} from '../../lib/filters';

  export default {
    name: 'dataOverview',
    data() {
      return {
        loanStatistics: {
          sumLoanAmt: '',
          sumPayAmt: '',
          sumDelayAmt: '',
          sumPaidAmt: '',
          sumLoanCount: '',
          sumPayCount: '',
          sumDelayCount: '',
          sumPaidCount: '',
        },
        pickerOptions: {
          shortcuts: [{
            text: '近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(time) {
            const nearlyYear = new Date();
            nearlyYear.setTime(nearlyYear.getTime() - 3600 * 1000 * 24 * 365);
            return time.getTime() > Date.now() || time.getTime() < nearlyYear.getTime();
          },
        },
        loanPayPickerOptions: {
          shortcuts: [{
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24);
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 31);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(time) {
            const nextYear = new Date();
            nextYear.setTime(nextYear.getTime() + 3600 * 1000 * 24 * 365);
            return time.getTime() < Date.now() || time.getTime() > nextYear.getTime();
          },
        },
        timeOptions: [
          {text: '按日', value: '0'},
          {text: '按月', value: '1'}
        ],
        // 放款情况
        loanSuccessSearchParams: {
          date: [],
          unit: '0'
        },
        loanSuccess: null,
        loanSuccessContainer: '',
        loanSuccessData: {
          sumLoanAmt: '',// 合计放款金额
          sumLoanCount: '',// 合计放款笔数
          xAxis: [],//横坐标
          loanCount: [],//放款笔数
          loanAmt: [],//放款金额
          countMax: 0,
          amountMax: 0,
          originalLoanAmt: [],//接口返回的放款金额数据
        },
        loanSuccessDataLoading: false,
        exportSuccessLoading: false,
        // 待还款情况
        loanPaySearchParams:{
          date: [],
          unit: '0'
        },
        loanPay: null,
        loanPayContainer: '',
        loanPayData: {
          sumPayAmt: '',// 合计待还金额
          xAxis: [],//横坐标
          loanPayAmt: [],//待还金额
          originalLoanPayAmt: [],//接口返回的待还金额
        },
        loanPayDataLoading: false,
        exportPayLoading: false,
        // 还款情况
        loanPaidSearchParams:{
          date: [],
          unit: '0'
        },
        loanPaid: null,
        loanPaidContainer: '',
        loanPaidData: {
          xAxis: [],//横坐标
          loanPayAmt: [],//应还金额
          loanPaidAmt: [],//已还金额
          originalLoanPayAmt: [],//接口返回的应还金额
          originalLoanPaidAmt: [],//接口返回的已还金额
        },
        loanPaidDataLoading: false,
        exportPaidLoading: false
      }
    },
    computed: {
      // 放款情况配置项
      loanSuccessOption() {
        return {
          color: ['#f2637b', '#3ba0ff'],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let relVal, date, Y, M, D, dataIndex, value;
              if (this.loanSuccessSearchParams.unit === '0') {
                date = new Date(params[0].name);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                D = date.getDate();
                relVal = `${Y}年${M}月${D}日`;
              } else {
                date = new Date(`${params[0].name}/01`);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                relVal = `${Y}年${M}月`;
              }
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesType === 'bar') {
                  dataIndex = params[i].dataIndex;
                  value = this.loanSuccessData.originalLoanAmt[dataIndex] < 10000 ? this.loanSuccessData.originalLoanAmt[dataIndex] : `${params[i].value}万`;
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + value+"</div>";
                } else {
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+"</div>";
                }
              }
              return relVal;
            },
            backgroundColor: '#393939',
          },
          title: {
            left: 'center',
            text: `合计放款金额：${this.loanSuccessData.sumLoanAmt}   合计放款笔数：${this.loanSuccessData.sumLoanCount}`,
            textStyle: {
              fontSize: 16,
              fontWeight: '100'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: this.loanSuccessData.xAxis,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                interval: this.loanSuccessSearchParams.unit === '0' ? 'auto' : () => {return true},
                formatter: (value) => {
                  let date, Y, M, D;
                  if (this.loanSuccessSearchParams.unit === '0') {
                    date = new Date(value);
                    M = date.getMonth() + 1;
                    D = date.getDate();
                    return `${M}月${D}日`;
                  } else {
                    date = new Date(`${value}/01`);
                    Y = date.getFullYear();
                    M = date.getMonth() + 1;
                    return `${Y}年${M}月`;
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（万元）',
              min: 0,
              max: this.loanSuccessData.amountMax,
              interval: this.loanSuccessData.amountMax / 5,
              axisLine: {
                show: false
              }
            },
            {
              type: 'value',
              name: '笔数',
              min: 0,
              max: this.loanSuccessData.countMax,
              interval: this.loanSuccessData.countMax / 5,
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: this.loanSuccessSearchParams.unit === '0',
            },
          ],
          series: [
            {
              name: '放款金额',
              type: 'bar',
              barMaxWidth: '50',
              data: this.loanSuccessData.loanAmt
            },
            {
              name: '放款笔数',
              type: 'line',
              yAxisIndex: 1,
              data: this.loanSuccessData.loanCount
            }
          ]
        }
      },
      // 待还款情况配置项
      loanPayOption() {
        return {
          color: ['#f2637b', '#3ba0ff'],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let relVal, date, Y, M, D, dataIndex, value;
              if (this.loanPaySearchParams.unit === '0') {
                date = new Date(params[0].name);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                D = date.getDate();
                relVal = `${Y}年${M}月${D}日`;
              } else {
                date = new Date(`${params[0].name}/01`);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                relVal = `${Y}年${M}月`;
              }
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesType === 'bar') {
                  dataIndex = params[i].dataIndex;
                  value = this.loanPayData.originalLoanPayAmt[dataIndex] < 10000 ? this.loanPayData.originalLoanPayAmt[dataIndex] : `${params[i].value}万`;
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + value+"</div>";
                } else {
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+"</div>";
                }
              }
              return relVal;
            },
            backgroundColor: '#393939',
          },
          title: {
            left: 'center',
            text: `合计待还金额：${this.loanPayData.sumPayAmt}`,
            textStyle: {
              fontSize: 16,
              fontWeight: '100'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: this.loanPayData.xAxis,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                interval: this.loanPaySearchParams.unit === '0' ? 'auto' : () => {return true},
                formatter: (value) => {
                  let date, Y, M, D;
                  if (this.loanPaySearchParams.unit === '0') {
                    date = new Date(value);
                    M = date.getMonth() + 1;
                    D = date.getDate();
                    return `${M}月${D}日`;
                  } else {
                    date = new Date(`${value}/01`);
                    Y = date.getFullYear();
                    M = date.getMonth() + 1;
                    return `${Y}年${M}月`;
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（万元）',
              min: 0,
              axisLine: {
                show: false
              }
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: this.loanPaySearchParams.unit === '0',
            },
          ],
          series: [
            {
              name: '待还金额',
              type: 'bar',
              barMaxWidth: '50',
              data: this.loanPayData.loanPayAmt
            }
          ]
        }
      },
      // 还款情况配置项
      loanPaidOption() {
        return {
          color: ['#f2637b', '#3ba0ff'],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let relVal, date, Y, M, D, dataIndex, dataList, value;
              if (this.loanPaidSearchParams.unit === '0') {
                date = new Date(params[0].name);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                D = date.getDate();
                relVal = `${Y}年${M}月${D}日`;
              } else {
                date = new Date(`${params[0].name}/01`);
                Y = date.getFullYear();
                M = date.getMonth() + 1;
                relVal = `${Y}年${M}月`;
              }
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesType === 'bar') {
                  dataIndex = params[i].dataIndex;
                  dataList = params[i].seriesName=== '应还金额' ? this.loanPaidData.originalLoanPayAmt : this.loanPaidData.originalLoanPaidAmt;
                  value = dataList[dataIndex] < 10000 ? dataList[dataIndex] : `${params[i].value}万`;
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + value+"</div>";
                } else {
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+"</div>";
                }
              }
              return relVal;
            },
            backgroundColor: '#393939',
          },
          legend: {
            orient: 'vertical',
            left: '92%',
            bottom: '50%',
            data: ['应还金额', '实还金额']
          },
          xAxis: [
            {
              type: 'category',
              data: this.loanPaidData.xAxis,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                interval: this.loanPaidSearchParams.unit === '0' ? 'auto' : () => {return true},
                formatter: (value) => {
                  let date, Y, M, D;
                  if (this.loanPaidSearchParams.unit === '0') {
                    date = new Date(value);
                    M = date.getMonth() + 1;
                    D = date.getDate();
                    return `${M}月${D}日`;
                  } else {
                    date = new Date(`${value}/01`);
                    Y = date.getFullYear();
                    M = date.getMonth() + 1;
                    return `${Y}年${M}月`;
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（万元）',
              min: 0,
              axisLine: {
                show: false
              }
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              show: this.loanPaidSearchParams.unit === '0',
            },
          ],
          series: [
            {
              name: '应还金额',
              type: 'bar',
              barMaxWidth: '50',
              data: this.loanPaidData.loanPayAmt
            },
            {
              name: '实还金额',
              type: 'bar',
              barMaxWidth: '50',
              data: this.loanPaidData.loanPaidAmt
            }
          ]
        }
      }
    },
    methods: {
      initSearchDateParams() {
        const now = new Date();
        const nearlyWeek = new Date();
        nearlyWeek.setTime(nearlyWeek.getTime() - 3600 * 1000 * 24 * 6);
        this.$set(this.loanSuccessSearchParams, 'date', [nearlyWeek, now]);
        this.$set(this.loanPaidSearchParams, 'date', [nearlyWeek, now]);
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + 3600 * 1000 * 24);
        const nextWeek = new Date();
        nextWeek.setTime(nextWeek.getTime() + 3600 * 1000 * 24 * 7);
        this.$set(this.loanPaySearchParams, 'date', [tomorrow, nextWeek]);
      },
      // 获取放款概况
      getLoanStatistics() {
        getLoanStatistics().then(res => {
          if (res.code === '200') {
            this.loanStatistics = {
              sumLoanAmt: filter_formatMoney(res.body.sumLoanAmt),
              sumPayAmt: filter_formatMoney(res.body.sumPayAmt),
              sumDelayAmt: filter_formatMoney(res.body.sumDelayAmt),
              sumPaidAmt: filter_formatMoney(res.body.sumPaidAmt),
              sumLoanCount: filter_formatMoney(res.body.sumLoanCount),
              sumPayCount: filter_formatMoney(res.body.sumPayCount),
              sumDelayCount: filter_formatMoney(res.body.sumDelayCount),
              sumPaidCount: filter_formatMoney(res.body.sumPaidCount),
            }
          }
        })
      },
      calMax(arr) {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) { // 求出一组数组中的最大值
          if (max < arr[i]) {
            max = arr[i];
          }
        }
        let maxInt = Math.ceil(max / 10); // 向上取整
        let maxVal = maxInt * 10; // 最终设置的最大值
        return maxVal; // 输出最大值
      },
      formatDate(date) {
        let newDate, Y, M, D;
        newDate = new Date(date);
        Y = newDate.getFullYear() + '-';
        M = (newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1) + '-';
        D = (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate());
        return (Y + M + D)
      },
      getSearchParams(type) {
        const searchKey = `loan${type}SearchParams`;
        const search = {
          startDate: this[searchKey].date && this[searchKey].date[0],
          endDate: this[searchKey].date && this[searchKey].date[1],
          unit: this[searchKey].unit,
        };
        if (search.startDate && typeof search.startDate !== 'string') {
          search.startDate = this.formatDate(search.startDate)
        }
        if (search.endDate && typeof search.endDate !== 'string') {
          search.endDate = this.formatDate(search.endDate)
        }
        return search
      },
      drawLoanSuccess() {
        this.loanSuccessDataLoading = true;
        this.loanSuccessData = {
          sumLoanAmt: '',// 合计放款金额
          sumLoanCount: '',// 合计放款笔数
          xAxis: [],//横坐标
          loanCount: [],//放款笔数
          loanAmt: [],//放款金额
          countMax: 0,
          amountMax: 0,
          originalLoanAmt: [],//接口返回的放款金额数据
        };
        if (this.loanSuccess) {
          this.loanSuccess.clear()
        }
        this.loanSuccess = echarts.init(this.loanSuccessContainer);
        this.loanSuccess.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        const search = this.getSearchParams('Success');
        getLoanSuccessByTime(search).then(res => {
          if (res.code === '200') {
            let data = res.body;
            let xAxis = data.loanAmtList.map(ele => {
              return ele.intervalTime;
            });
            xAxis.forEach(time => {
              for(let loanAmt of data.loanAmtList) {
                if (loanAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanAmt.amount, 10000));
                  this.loanSuccessData.loanAmt.push(amount);
                  this.loanSuccessData.originalLoanAmt.push(loanAmt.amount);
                  break;
                }
              }
              for(let loanCount of data.loanCountList) {
                if (loanCount.intervalTime === time) {
                  this.loanSuccessData.loanCount.push(loanCount.quantity);
                  break;
                }
              }
              this.loanSuccessData.xAxis.push(time);
            });
            this.loanSuccessData.sumLoanAmt = data.sumLoanAmt;
            this.loanSuccessData.sumLoanCount = data.sumLoanCount;
            this.loanSuccessData.countMax = this.calMax(this.loanSuccessData.loanCount);
            this.loanSuccessData.amountMax = this.calMax(this.loanSuccessData.loanAmt);
            if (!this.loanSuccessData.countMax) {
              this.loanSuccessData.countMax = 50
            }
            if (!this.loanSuccessData.amountMax) {
              this.loanSuccessData.amountMax = 50
            }
            this.loanSuccess.setOption(this.loanSuccessOption, true);
          }
        }).finally(() => {
          this.loanSuccessDataLoading = false;
          if (this.loanSuccess) {
            this.loanSuccess.hideLoading()
          }
        })
      },
      drawLoanPay() {
        this.loanPayDataLoading = true;
        this.loanPayData = {
          sumPayAmt: '',// 合计待还金额
          xAxis: [],//横坐标
          loanPayAmt: [],//待还金额
          originalLoanPayAmt: [],//接口返回的待还金额
        };
        if (this.loanPay) {
          this.loanPay.clear()
        }
        this.loanPay = echarts.init(this.loanPayContainer);
        this.loanPay.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        this.loanPay = echarts.init(this.loanPayContainer);
        const search = this.getSearchParams('Pay');
        getLoanPayByTime(search).then(res => {
          if (res.code === '200') {
            let data = res.body;
            let xAxis = data.loanPayAmtList.map(ele => {
              return ele.intervalTime;
            });
            xAxis.forEach(time => {
              for (let loanPayAmt of data.loanPayAmtList) {
                if (loanPayAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanPayAmt.amount, 10000));
                  this.loanPayData.loanPayAmt.push(amount);
                  this.loanPayData.originalLoanPayAmt.push(loanPayAmt.amount);
                  break;
                }
              }
              this.loanPayData.xAxis.push(time);
            });
            this.loanPayData.sumPayAmt = data.sumPayAmt;
            this.loanPay.setOption(this.loanPayOption, true);
          }
        }).finally(() => {
          this.loanPayDataLoading = false;
          if (this.loanPay) {
            this.loanPay.hideLoading()
          }
        })
      },
      drawLoanPaid() {
        this.loanPaidDataLoading = true;
        this.loanPaidData = {
          xAxis: [],//横坐标
          loanPayAmt: [],//应还金额
          loanPaidAmt: [],//已还金额
          originalLoanPayAmt: [],//接口返回的应还金额
          originalLoanPaidAmt: [],//接口返回的已还金额
        };
        if (this.loanPaid) {
          this.loanPaid.clear()
        }
        this.loanPaid = echarts.init(this.loanPaidContainer);
        this.loanPaid.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        this.loanPaid = echarts.init(this.loanPaidContainer);
        const search = this.getSearchParams('Paid');
        getLoanPaidByTime(search).then(res => {
          if (res.code === '200') {
            let data = res.body;
            let xAxis = data.loanPayAmtList.map(ele => {
              return ele.intervalTime;
            });
            xAxis.forEach(time => {
              for (let loanPayAmt of data.loanPayAmtList) {
                if (loanPayAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanPayAmt.amount, 10000));
                  this.loanPaidData.loanPayAmt.push(amount);
                  this.loanPaidData.originalLoanPayAmt.push(loanPayAmt.amount);
                  break;
                }
              }
              for (let loanPaidAmt of data.loanPaidAmtList) {
                if (loanPaidAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanPaidAmt.amount, 10000));
                  this.loanPaidData.loanPaidAmt.push(amount);
                  this.loanPaidData.originalLoanPaidAmt.push(loanPaidAmt.amount);
                  break;
                }
              }
              this.loanPaidData.xAxis.push(time);
            });
            this.loanPaid.setOption(this.loanPaidOption, true);
          }
        }).finally(() => {
          this.loanPaidDataLoading = false;
          if (this.loanPaid) {
            this.loanPaid.hideLoading()
          }
        })
      },
      handleExport(type) {
        this[`export${type}Loading`] = true;
        const search = this.getSearchParams(type);
        let api;
        switch (type) {
          case 'Success':
            api = exportLoanSuccess;
            break;
          case 'Pay':
            api = exportLoanPay;
            break;
          case 'Paid':
            api = exportLoanPaid;
            break;
          default:
            break;
        }
        api(search).then(res => {
          let data = res.data;
          let downloadFile = () => {
            let filename = res.header['content-disposition']
              ? res.header['content-disposition'].split('filename=')[1]
              : 'dataCount_list.xlsx';
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
          this[`export${type}Loading`] = false;
        })
      },
      resize() {
        this.loanSuccess.resize();
        this.loanPay.resize();
        this.loanPaid.resize();
      }
    },
    mounted() {
      this.loanSuccessContainer = document.getElementById('loan-success');
      this.loanPayContainer = document.getElementById('loan-pay');
      this.loanPaidContainer = document.getElementById('loan-paid');
      this.drawLoanSuccess();
      this.drawLoanPay();
      this.drawLoanPaid();
      window.addEventListener('resize', this.resize)
    },
    created() {
      this.initSearchDateParams();
      this.getLoanStatistics();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
    }
  }
</script>

<style lang="scss">
    .data-overview {
        min-width: 1200px;
        background: #EEE;
        padding: 15px 0;
        .top-container {
            padding: 10px 0;
        }
        .top-line {
            width: 85%;
            margin: 0 auto;
            list-style: none;
            overflow: hidden;
            padding: 0 0 30px;
            &:last-child {
                padding-bottom: 0;
            }
            li {
                float: left;
                width: 25%;
                text-align: center;
                p {
                    margin: 0;
                    color: #0077ff;
                    font-size: 26px;
                }
                span {
                    color: #b4bac6;
                    font-size: 12px;
                }
                .el-button{
                    padding: 5px;
                    color: #b4bac6;
                }
            }
        }
        .loan-container{
            background: #fff;
            .title-container{
                .title{
                    padding-bottom: 20px;
                    text-align: center;
                    font-size: 18px;
                    color: #409EFF;
                }
            }
            .echarts {
                width: 100%;
                height: 360px;
            }
        }
        .circle>span{
            display: inline-block;
            height: 6px;
            width: 6px;
            margin-right: 5px;
            vertical-align: middle;
            border-radius: 3px;
        }
    }
</style>