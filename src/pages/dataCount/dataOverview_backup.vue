<template>
    <div class="data-overview">
        <el-row>
            <el-col :span="22" :offset="1">
                <el-card class="top-container" shadow="never">
                    <ul class="top-line">
                        <li>
                            <p>{{loanStatistics.sumLoanCount}}</p>
                            <span>累计放款笔数</span>
                        </li>
                        <li>
                            <p>{{loanStatistics.sumPayCount}}</p>
                            <span>累计应还笔数</span>
                        </li>
                        <li>
                            <p>{{loanStatistics.sumPaidCount}}</p>
                            <span>累计已还笔数</span>
                        </li>
                    </ul>
                    <ul class="top-line">
                        <li>
                            <p>¥{{loanStatistics.sumLoanAmt}}</p>
                            <span>累计放款金额</span>
                        </li>
                        <li>
                            <p>¥{{loanStatistics.sumPayAmt}}</p>
                            <span>累计应还金额</span>
                        </li>
                        <li>
                            <p>¥{{loanStatistics.sumPaidAmt}}</p>
                            <span>累计已还金额</span>
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="margin-top20">
            <el-col :span="10" :offset="1">
                <el-card shadow="never">
                    <div slot="header">
                        <span>放款量占比</span>
                    </div>
                    <div class="tab-title">
                        <el-button @click="changeTab('loanCount', 'product_no')" :class="{'active': loanCount.activeName === 'product_no'}" :disabled="loanCountDataLoading">产品</el-button>
                        <el-button @click="changeTab('loanCount', 'apply_channel')" :class="{'active': loanCount.activeName === 'apply_channel'}" :disabled="loanCountDataLoading">渠道</el-button>
                    </div>
                    <div class="pie-chart-container">
                        <div id="loan-count-pie" class="echarts"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10" :offset="2">
                <el-card shadow="never">
                    <div slot="header">
                        <span>放款金额占比</span>
                    </div>
                    <div class="tab-title">
                        <el-button @click="changeTab('loanAmt', 'product_no')" :class="{'active': loanAmt.activeName === 'product_no'}" :disabled="loanAmtDataLoading">产品</el-button>
                        <el-button @click="changeTab('loanAmt', 'apply_channel')" :class="{'active': loanAmt.activeName === 'apply_channel'}" :disabled="loanAmtDataLoading">渠道</el-button>
                    </div>
                    <div class="pie-chart-container">
                        <div id="loan-amt-pie" class="echarts"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-card class="loan-num-container" shadow="never">
            <div class="title-container">
                <div class="title"><span>放款笔数/放款金额</span></div>
                <el-form label-width="50px">
                    <el-row>
                        <el-col :span="5" :offset="1">
                            <el-form-item label="渠道">
                                <el-select v-model="searchParams.applyChannel" filterable :disabled="searchParamsLoading || loanNumHistogramDataLoading" clearable>
                                    <el-option label="所有渠道（默认）" value=""></el-option>
                                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.channelCode"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="产品">
                                <el-select v-model="searchParams.productNo" :disabled="searchParamsLoading || loanNumHistogramDataLoading" clearable>
                                    <el-option label="所有产品（默认）" value=""></el-option>
                                    <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.productNo"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="7" @click="changeTime" class="select-time">
                            <span v-for="(item, index) in timeList" :key="index" @click="changeTime(item.value)" :class="{'active': searchParams.timeLabel === item.value, 'time-disable': loanNumHistogramDataLoading || searchParamsLoading}">{{item.label}}</span>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="echarts" id="loan-num-his"></div>
        </el-card>
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
  import 'echarts/lib/component/legendScroll';

  import {getAllChannel} from '@/service/income/income';
  import {getLoanStatistics, getLoanCountStatistics, getLoanAmtStatistics, getAllProduct, getChannelByProductId, getProductByChannelId, getLoanStatisticsByTime} from '@/service/dataCount/dataCount';
  import {filter_formatMoney} from '../../lib/filters';
  export default {
    name: 'dataOverview',
    data() {
      return {
        loanStatistics: {
          sumLoanCount: '',
          sumPayCount: '',
          sumPaidCount: '',
          sumLoanAmt: '',
          sumPayAmt: '',
          sumPaidAmt: '',
        },
        // 放款量、放款金额圆环图tab
        loanCount: {
          activeName: 'product_no'
        },
        loanAmt: {
          activeName: 'product_no'
        },
        // 放款笔数/放款金额柱状图
        loanCountPie: null,
        loanCountPieContainer: '',
        loanCountPieHighLightIndex: 0,
        loanCountDataLoading: false,
        loanCountData: {
          legend: [],
          series: [],
          valueList: []
        },
        loanAmtPie: null,
        loanAmtPieContainer: '',
        loanAmtPieHighLightIndex: 0,
        loanAmtDataLoading: false,
        loanAmtData: {
          legend: [],
          series: [],
          valueList: []
        },
        loanNumHis: null,
        loanNumHisContainer: '',
        // 搜索条件
        channelList: [],
        productList: [],
        timeList: [{
          value: 'today',
          label: '今日'
        }, {
          value: 'week',
          label: '近1周'
        }, {
          value: 'month',
          label: '近1月'
        }, {
          value: 'year',
          label: '近1年'
        }],
        searchParams: {
          productNo: '',
          applyChannel: '',
          timeLabel: 'today',
          time: 1
        },
        searchParamsLoading: false,
        loanNumHistogramData: {
          xAxis: [],//横坐标
          loanCount: [],//放款笔数
          loanPay: [],//应还笔数
          loanPaid: [],//已还笔数
          loanAmt: [],//放款金额
          loanPayAmt: [],//应还金额
          loanPaidAmt: [],//已还金额
          numMax: 0,
          amountMax: 0
        },
        loanNumHistogramDataLoading: false
      }
    },
    computed: {
      // 放款量、放款金额圆环图配置项
      loanCountOption() {
        return {
          color: ['#f2637b', '#ffa500', '#ffd700', '#3cb371', '#00c1d1', '#3ba0ff'],
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              let num = filter_formatMoney(params.value);
              let name = params.name.split(' ')[0];
              return `${params.seriesName} <br/>${name}: ${num} (${params.percent}%)`
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '60%',
            top: '10%',
            width: 1,
            itemWidth: 10,
            itemGap: 20,
            selectedMode: false,
            formatter: (name) => {
              let series = this.loanCountData.series;
              let number, rate, index;
              for (let i = 0, len = series.length; i < len; i++) {
                if (series[i].name === name) {
                  name = series[i].name.split(' ')[0];
                  number = series[i].value;
                  index = i;
                  break
                }
              }
              number = filter_formatMoney(number);
              rate = this.getPercentWithPrecision(this.loanCountData.valueList, index);
              if (name.length > 5) {
                name = name.substring(0, 5) + '...'
              }
              return `{name|${name}}  {rate|${rate}%}  {num|${number}}`;
            },
            textStyle: {
              rich: {
                name: {
                  color: '#595959'
                },
                rate: {
                  color: '#8c8c8c'
                },
                num: {
                  color: '#595959'
                }
              }
            },
            data: this.loanCountData.legend
          },
          series: [
            {
              name:'放款量',
              type:'pie',
              radius: ['60%', '80%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
                formatter: (params) => {
                  let num = filter_formatMoney(params.value);
                  return [
                    '{title|放款量}',
                    `{num|${num}}`
                  ].join('\n')
                },
                emphasis: {
                  show: true,
                },
                rich: {
                  title: {
                    color: '#8c8c8c',
                    fontSize: 12,
                    lineHeight: 20
                  },
                  num: {
                    color: '#262626',
                    fontSize: 24
                  }
                }
              },
              itemStyle:{
                borderWidth: 1,
                borderColor: '#fff',
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.loanCountData.series
            }
          ]
        }
      },
      loanAmtOption() {
        return {
          color: ['#f2637b', '#ffa500', '#ffd700', '#3cb371', '#00c1d1', '#3ba0ff'],
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              let num = filter_formatMoney(params.value);
              let name = params.name.split(' ')[0];
              return `${params.seriesName} <br/>${name}: ¥${num} (${params.percent}%)`
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '60%',
            top: '15%',
            itemWidth: 10,
            itemGap: 20,
            selectedMode: false,
            formatter: (name) => {
              let series = this.loanAmtData.series;
              let number, rate, index;
              for (let i = 0, len = series.length; i < len; i++) {
                if (series[i].name === name) {
                  name = series[i].name.split(' ')[0];
                  number = series[i].value;
                  index = i;
                  break
                }
              }
              number = filter_formatMoney(number);
              rate = this.getPercentWithPrecision(this.loanAmtData.valueList, index);
              if (name.length > 5) {
                name = name.substring(0, 5) + '...'
              }
              return `{name|${name}}  {rate|${rate}%}  ¥{num|${number}}`;
            },
            textStyle: {
              rich: {
                name: {
                  color: '#595959'
                },
                rate: {
                  color: '#8c8c8c'
                },
                num: {
                  color: '#595959'
                }
              }
            },
            data: this.loanAmtData.legend
          },
          series: [
            {
              name:'放款金额',
              type:'pie',
              radius: ['60%', '80%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
                formatter: (params) => {
                  let num = filter_formatMoney(params.value);
                  return [
                    '{title|放款金额}',
                    `{num|¥${num}}`
                  ].join('\n')
                },
                emphasis: {
                  show: true,
                },
                rich: {
                  title: {
                    color: '#8c8c8c',
                    fontSize: 12,
                    lineHeight: 20
                  },
                  num: {
                    color: '#262626',
                    fontSize: 24
                  }
                }
              },
              itemStyle:{
                borderWidth: 1,
                borderColor: '#fff',
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.loanAmtData.series
            }
          ]
        }
      },
      // 柱状图配置项
      loanNumHistogramOption() {
        return {
          color: ['#f2637b', '#ffd700', '#3ba0ff'],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let relVal = params[0].name;
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesType === 'bar') {
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+"万</div>";
                } else {
                  relVal += '<div class="circle"><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+"</div>";
                }
              }
              return relVal;
            },
            backgroundColor: '#393939',
          },
          toolbox: {
            show: false
          },
          xAxis: [
            {
              type: 'category',
              data: this.loanNumHistogramData.xAxis,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel:{
                interval: () => {
                  return true
                }
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（万元）',
              min: 0,
              max: this.loanNumHistogramData.amountMax * 2,
              interval: this.loanNumHistogramData.amountMax / 5
            },
            {
              type: 'value',
              name: '订单量（个）',
              min: -this.loanNumHistogramData.numMax,
              max: this.loanNumHistogramData.numMax,
              interval: this.loanNumHistogramData.numMax / 5,
              axisLabel: {
                formatter: (value) => {
                  if (value >= 0) {
                    return value
                  }
                }
              }
            }
          ],
          series: [
            {
              name: '放款笔数',
              type: 'line',
              yAxisIndex: 1,
              data: this.loanNumHistogramData.loanCount
            },
            {
              name: '应还笔数',
              type: 'line',
              yAxisIndex: 1,
              data: this.loanNumHistogramData.loanPay
            },
            {
              name: '已还笔数',
              type: 'line',
              yAxisIndex: 1,
              data: this.loanNumHistogramData.loanPaid
            },
            {
              name: '放款金额',
              type: 'bar',
              data: this.loanNumHistogramData.loanAmt
            },
            {
              name: '应还金额',
              type: 'bar',
              data: this.loanNumHistogramData.loanPayAmt
            },
            {
              name: '已还金额',
              type: 'bar',
              data: this.loanNumHistogramData.loanPaidAmt
            }
          ]
        }
      }
    },
    methods: {
      // 获取放款概况
      getLoanStatistics() {
        getLoanStatistics().then(res => {
          if (res.code === '200') {
            this.loanStatistics = {
              sumLoanCount: filter_formatMoney(res.body.sumLoanCount),
              sumPayCount: filter_formatMoney(res.body.sumPayCount),
              sumPaidCount: filter_formatMoney(res.body.sumPaidCount),
              sumLoanAmt: filter_formatMoney(res.body.sumLoanAmt),
              sumPayAmt: filter_formatMoney(res.body.sumPayAmt),
              sumPaidAmt: filter_formatMoney(res.body.sumPaidAmt)
            }
          }
        })
      },
      /**最大余额法取百分比
       * @param valueList 数组数据
       * @param idx 数组下标
       * @param precision 精度
       * */
      getPercentWithPrecision(valueList, idx, precision = 2) {
        // 判断是否为空
        if (!valueList[idx]) {
          return 0;
        }
        // 求和
        let sum = valueList.reduce(function (acc, val) {
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        if (sum === 0) {
          return 0;
        }
        // 10的2次幂是100，用于计算精度。
        let digits = Math.pow(10, precision);
        // 扩大比例100，
        let votesPerQuota = valueList.map(function (val) {
          return (isNaN(val) ? 0 : val) / sum * digits * 100;
        });
        // 总数，扩大比例意味的总数要扩大
        let targetSeats = digits * 100;
        // 再向下取值，组成数组
        let seats = votesPerQuota.map(function (votes) {
          return Math.floor(votes);
        });
        // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
        let currentSum = seats.reduce(function (acc, val) {
          return acc + val;
        }, 0);
        // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
        let remainder = votesPerQuota.map(function (votes, idx) {
          return votes - seats[idx];
        });
        // 给最大的余额加1，凑个占比100%；
        while (currentSum < targetSeats) {
          //  找到下一个最大的余额，给其加1
          let max = Number.NEGATIVE_INFINITY;
          let maxId = null;
          for (let i = 0, len = remainder.length; i < len; ++i) {
            if (remainder[i] > max) {
              max = remainder[i];
              maxId = i;
            }
          }
          // 对最大项余额加1
          ++seats[maxId];
          // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
          remainder[maxId] = 0;
          // 总的也要加1，为了判断是否总数是否相同，跳出循环。
          ++currentSum;
        }
        // 这时候的seats就会总数占比会100%
        return seats[idx] / digits
      },
      // 放款量、放款金额圆环图切换tab值
      changeTab(scope, name) {
        this[scope].activeName = name;
        if (scope === 'loanCount') {
          this.drawLoanCountPie(name)
        } else {
          this.drawLoanAmtPie(name)
        }
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
      changeTime(value) {
        if (!this.loanNumHistogramDataLoading && !this.searchParamsLoading) {
          this.searchParams.timeLabel = value;
          switch (value) {
            case 'today':
              this.searchParams.time = 1;
              break;
            case 'week':
              this.searchParams.time = 7;
              break;
            case 'month':
              this.searchParams.time = 30;
              break;
            case 'year':
              this.searchParams.time = 365;
              break;
            default:
              break;
          }
          this.drawLoanNumHis();
        }
      },
      // 获取产品
      getAllProduct() {
        getAllProduct().then(res => {
          if (res.code === '200') {
            if (res.body && res.body.length) {
              this.productList = res.body;
            }
          }
        })
      },
      // 获取渠道
      getAllChannel() {
        getAllChannel().then(res => {
          if (res.code === '200') {
            if (res.body && res.body.length) {
              this.channelList = res.body;
            }
          }
        })
      },
      highLight(pre) {
        // 默认高亮第一个
        this[`${pre}PieHighLightIndex`] = 0;
        let chart = this[`${pre}Pie`];
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        });
        chart.on('mouseover', (e) => {
          if (e.dataIndex !== this[`${pre}PieHighLightIndex`]) {
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: this[`${pre}PieHighLightIndex`]
            });
          }
        });
        chart.on('mouseout', (e) => {
          this[`${pre}PieHighLightIndex`] = e.dataIndex;
          chart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex});
        });
        chart.on('legendscroll', () => {
          chart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: this[`${pre}PieHighLightIndex`]});
        });
      },
      drawLoanCountPie(type) {
        this.loanCountDataLoading = true;
        this.loanCountData = {
          legend: [],
          series: [],
          valueList: []
        };
        if (this.loanCountPie) {
          this.loanCountPie.clear()
        }
        this.loanCountPie = echarts.init(this.loanCountPieContainer);
        this.loanCountPie.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        getLoanCountStatistics({type: type}).then(res => {
          if (res.code === '200') {
            if (res.body) {
              res.body.forEach(ele => {
                this.loanCountData.legend.push({
                  name: `${ele.name} ${ele.code}`,
                  icon: 'circle'
                });
                this.loanCountData.series.push({
                  value: ele.quantity,
                  name: `${ele.name} ${ele.code}`
                });
                this.loanCountData.valueList.push(ele.quantity);
              });
              this.loanCountPie.setOption(this.loanCountOption, true);
              this.highLight('loanCount');
            }
          }
        }).finally(() => {
          this.loanCountDataLoading = false;
          if (this.loanCountPie) {
            this.loanCountPie.hideLoading()
          }
        })
      },
      drawLoanAmtPie(type) {
        this.loanAmtDataLoading = true;
        this.loanAmtData = {
          legend: [],
          series: [],
          valueList: []
        };
        if (this.loanAmtPie) {
          this.loanAmtPie.clear()
        }
        this.loanAmtPie = echarts.init(this.loanAmtPieContainer);
        this.loanAmtPie.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        getLoanAmtStatistics({type: type}).then(res => {
          if (res.code === '200') {
            if (res.body) {
              res.body.forEach(ele => {
                this.loanAmtData.legend.push({
                  name: `${ele.name} ${ele.code}`,
                  icon: 'circle'
                });
                this.loanAmtData.series.push({
                  value: ele.amount,
                  name: `${ele.name} ${ele.code}`
                });
                this.loanAmtData.valueList.push(ele.amount);
              });
              this.loanAmtPie.setOption(this.loanAmtOption, true);
              this.highLight('loanAmt');
            }
          }
        }).finally(() => {
          this.loanAmtDataLoading = false;
          if (this.loanAmtPie) {
            this.loanAmtPie.hideLoading()
          }
        })
      },
      drawLoanNumHis() {
        this.loanNumHistogramDataLoading = true;
        this.loanNumHistogramData = {
          xAxis: [],//横坐标
          loanCount: [],//放款笔数
          loanPay: [],//应还笔数
          loanPaid: [],//已还笔数
          loanAmt: [],//放款金额
          loanPayAmt: [],//应还金额
          loanPaidAmt: [],//已还金额
          numMax: 0,
          amountMax: 0
        };
        if (this.loanNumHis) {
          this.loanNumHis.clear()
        }
        this.loanNumHis = echarts.init(this.loanNumHisContainer);
        this.loanNumHis.showLoading({
          text: '正在加载数据',
          color: '#409EFF'
        });
        const search = {
          productNo: this.searchParams.productNo,
          applyChannel: this.searchParams.applyChannel,
          timeLabel: this.searchParams.timeLabel,
          time: this.searchParams.time
        };
        !search.productNo ? delete search.productNo : '';
        !search.applyChannel ? delete search.applyChannel : '';
        delete search.timeLabel;
        getLoanStatisticsByTime(search).then(res => {
          if (res.code === '200') {
            let data = res.body;
            let xAxis = [];
            data.loanAmtList.forEach(ele => {
              xAxis.push(ele.intervalTime);
            });
            xAxis.forEach(time => {
              for(let i = 0, len = data.loanAmtList.length; i < len ; i++) {
                let loanAmt = data.loanAmtList[i];
                if (loanAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanAmt.amount, 10000));
                  this.loanNumHistogramData.loanAmt.push(amount);
                  break;
                }
              }
              for(let i = 0, len = data.loanCountList.length; i < len ; i++) {
                let loanCount = data.loanCountList[i];
                if (loanCount.intervalTime === time) {
                  this.loanNumHistogramData.loanCount.push(loanCount.quantity);
                  break;
                }
              }
              for(let i = 0, len = data.loanPaidAmtList.length; i < len ; i++) {
                let loanPaidAmt = data.loanPaidAmtList[i];
                if (loanPaidAmt.intervalTime === time) {
                  let amount = this.$floatToFixed(this.$floatDivide(loanPaidAmt.amount, 10000));
                  this.loanNumHistogramData.loanPaidAmt.push(amount);
                  break;
                }
              }
              for(let i = 0, len = data.loanPaidList.length; i < len ; i++) {
                let loanPaid = data.loanPaidList[i];
                if (loanPaid.intervalTime === time) {
                  this.loanNumHistogramData.loanPaid.push(loanPaid.quantity);
                  break;
                }
              }
              if (data.loanPayAmtList) {
                for(let i = 0, len = data.loanPayAmtList.length; i < len ; i++) {
                  let loanPayAmt = data.loanPayAmtList[i];
                  if (loanPayAmt.intervalTime === time) {
                    let amount = this.$floatToFixed(this.$floatDivide(loanPayAmt.amount, 10000));
                    this.loanNumHistogramData.loanPayAmt.push(amount);
                    break;
                  }
                }
              }
              if (data.loanPayList) {
                for(let i = 0, len = data.loanPayList.length; i < len ; i++) {
                  let loanPay = data.loanPayList[i];
                  if (loanPay.intervalTime === time) {
                    this.loanNumHistogramData.loanPay.push(loanPay.quantity);
                    break;
                  }
                }
              }
              this.loanNumHistogramData.xAxis.push(time)
            });
            this.loanNumHistogramData.numMax = this.calMax(this.loanNumHistogramData.loanCount.concat(this.loanNumHistogramData.loanPay).concat(this.loanNumHistogramData.loanPaid));
            this.loanNumHistogramData.amountMax = this.calMax(this.loanNumHistogramData.loanAmt.concat(this.loanNumHistogramData.loanPayAmt).concat(this.loanNumHistogramData.loanPaidAmt));
            if (!this.loanNumHistogramData.numMax) {
              this.loanNumHistogramData.numMax = 50
            }
            if (!this.loanNumHistogramData.amountMax) {
              this.loanNumHistogramData.amountMax = 50
            }
            this.loanNumHis.setOption(this.loanNumHistogramOption, true);
          }
        }).finally(() => {
          this.loanNumHistogramDataLoading = false;
          if (this.loanNumHis) {
            this.loanNumHis.hideLoading()
          }
        })
      },
      resize() {
        this.loanCountPie.resize();
        this.loanAmtPie.resize();
        this.loanNumHis.resize();
        this.loanCountPie.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.loanCountPieHighLightIndex
        });
        this.loanAmtPie.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.loanAmtPieHighLightIndex
        });
      }
    },
    watch: {
      'searchParams.applyChannel'(val) {
        if (val) {
          this.searchParamsLoading = true;
          getProductByChannelId({channelCode: val}).then(res => {
            if (res.code === '200') {
              this.productList = res.body;
              if (res.body && res.body.length) {
                if (!res.body.some(ele => {
                  return ele.productNo === this.searchParams.productNo
                })) {
                  this.searchParams.productNo = ''
                }
              } else {
                this.searchParams.productNo = ''
              }
              this.drawLoanNumHis();
            }
          }).finally(() => {
            this.searchParamsLoading = false
          })
        } else {
          this.getAllProduct();
          this.drawLoanNumHis();
        }
      },
      'searchParams.productNo'(val) {
        if (val) {
          this.searchParamsLoading = true;
          getChannelByProductId({productCode: val}).then(res => {
            if (res.code === '200') {
              this.channelList = res.body;
              if (res.body && res.body.length) {
                if (!res.body.some(ele => {
                  return ele.channelCode === this.searchParams.applyChannel
                })) {
                  this.searchParams.applyChannel = ''
                }
              } else {
                this.searchParams.applyChannel = ''
              }
              this.drawLoanNumHis();
            }
          }).finally(() => {
            this.searchParamsLoading = false
          })
        } else {
          this.getAllChannel();
          this.drawLoanNumHis();
        }
      }
    },
    mounted() {
      this.loanCountPieContainer = document.getElementById('loan-count-pie');
      this.loanAmtPieContainer = document.getElementById('loan-amt-pie');
      this.loanNumHisContainer = document.getElementById('loan-num-his');
      this.drawLoanCountPie('product_no');
      this.drawLoanAmtPie('product_no');
      this.drawLoanNumHis();
      window.addEventListener('resize', this.resize)
    },
    created() {
      this.getLoanStatistics();
      this.getAllChannel();
      this.getAllProduct();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
    }
  }
</script>

<style lang="scss">
    .data-overview{
        min-width: 1200px;
        background: #EEE;
        padding: 20px 0;
        .top-container{
            padding: 10px 0;
        }
        .top-line{
            width: 70%;
            margin: 0 auto;
            list-style: none;
            overflow: hidden;
            padding: 0 0 30px;
            &:last-child{
                padding-bottom: 0;
            }
            li{
                float: left;
                width: 33.33%;
                text-align: center;
                p{
                    margin: 0;
                    color: #0077ff;
                    font-size: 32px;
                }
                span{
                    color: #b4bac6;
                    font-size: 12px;
                }
            }
        }
        .tab-title{
            text-align: center;
            .active{
                border-color: #409EFF;
                background: transparent;
                color: #409EFF;
            }
        }
        .pie-chart-container{
            .echarts {
                width: 100%;
                height: 300px;
            }
        }
        .loan-num-container{
            background: #fff;
            margin: 20px 20px 0;
            .title-container{
                border-bottom: 2px solid #EEE;
                .title{
                    padding-bottom: 40px;
                    text-align: center;
                    font-size: 18px;
                    color: #409EFF;
                    span{
                        padding: 15px 20px;
                        border-bottom: 2px solid #409EFF;
                    }
                }
                .select-time{
                    span{
                        line-height: 40px;
                        margin-right: 10px;
                        cursor: pointer;
                        &.active{
                            color: #409EFF;
                        }
                        &.time-disable{
                            cursor: not-allowed;
                        }
                    }
                }
            }
            .echarts {
                width: 100%;
                height: 500px;
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