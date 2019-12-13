<template>
    <div>
        <pt-search :items="items" :params="searchParams" :label-width="125"></pt-search>
        <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick" class="margin-top20" style="padding: 0 20px">
            <el-tab-pane label="注册统计" name="register" :disabled="searchLoading">
                <div class="pt-table margin-top20">
                    <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                        <el-table-column v-for="(column,index) in registerColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                    </el-table>
                    <el-pagination
                            :class="{'pt-table-hideMaxPage': pagination.hideMaxPage}"
                            background
                            layout="jumper, prev, pager, next, sizes, total"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :total="pagination.total || 0"
                            :current-page="searchParams.pageNum"
                            :page-size="searchParams.pageSize"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :disabled="searchLoading"
                    ></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="实名统计" name="realName" :disabled="searchLoading">
                <div class="pt-table margin-top20">
                    <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                        <el-table-column v-for="(column,index) in realNameColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                    </el-table>
                    <el-pagination
                            :class="{'pt-table-hideMaxPage': pagination.hideMaxPage}"
                            background
                            layout="jumper, prev, pager, next, sizes, total"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :total="pagination.total || 0"
                            :current-page="searchParams.pageNum"
                            :page-size="searchParams.pageSize"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :disabled="searchLoading"
                    ></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="存管开户统计" name="cgkh" :disabled="searchLoading">
                <div class="pt-table margin-top20">
                    <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                        <el-table-column v-for="(column,index) in cgkhColumns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                    </el-table>
                    <el-pagination
                            :class="{'pt-table-hideMaxPage': pagination.hideMaxPage}"
                            background
                            layout="jumper, prev, pager, next, sizes, total"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :total="pagination.total || 0"
                            :current-page="searchParams.pageNum"
                            :page-size="searchParams.pageSize"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :disabled="searchLoading"
                    ></el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import {getDataCountList, exportExcel} from '@/service/dataCount/dataCount';
  import {filter_hidePhone} from '../../lib/filters';
  export default {
    name: 'dataCountList',
    data() {
      const filter_status = value => {
        return {false: '否', true: '是', null: '--'}[value];
      };
      return {
        loginAccountType: this.$getLocalStorage('userInfo').accountType,
        list: [],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        activeName: 'register',
        tabType: 1,//类型 1：注册 2：实名 3：存管
        roleVisible: false,
        newRoleTitle: '',
        newRole: {},
        roleRules: {},
        registerColumns: [
          {label: '渠道名称', prop: 'registerChannelName'},
          {label: '借款人姓名', prop: 'userName'},
          {
            label: '借款人手机号码', prop: 'userPhone',
            formatter: (row, col, val) => {
              if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
                return filter_hidePhone(val)
              } else {
                return val
              }
            }
          },
          {label: '注册时间', prop: 'registerTime'},
          {label: '是否在注册渠道存管开户', prop: 'openRegisterFlag', formatter: (row, col, val) => filter_status(val)},
          {label: '是否存管开户', prop: 'openAccountFlag', formatter: (row, col, val) => filter_status(val)},
          {label: '存管开户时间', prop: 'openAccountTime',
            formatter: (row, col, val) => {
              if (row.openAccountTime) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '绑卡卡号', prop: 'bankCardNo',
            formatter: (row, col, val) => {
              if (row.bankCardNo) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '是否在注册渠道提交订单', prop: 'submitRegisterFlag', formatter: (row, col, val) => filter_status(val)},
          {label: '是否提交订单', prop: 'submitFlag', formatter: (row, col, val) => filter_status(val)}
        ],
        realNameColumns: [
          {label: '渠道名称', prop: 'realNameChannelName'},
          {label: '借款人姓名', prop: 'userName'},
          {
            label: '借款人手机号码', prop: 'userPhone',
            formatter: (row, col, val) => {
              if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
                return filter_hidePhone(val)
              } else {
                return val
              }
            }
          },
          {label: '实名认证时间', prop: 'realNameTime'},
          {label: '是否存管开户', prop: 'openAccountFlag', formatter: (row, col, val) => filter_status(val)},
          {label: '存管开户时间', prop: 'openAccountTime',
            formatter: (row, col, val) => {
              if (row.openAccountTime) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '绑卡卡号', prop: 'bankCardNo',
            formatter: (row, col, val) => {
              if (row.bankCardNo) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '是否提交订单', prop: 'submitFlag', formatter: (row, col, val) => filter_status(val)},
        ],
        cgkhColumns: [
          {label: '渠道名称', prop: 'openChannelName'},
          {label: '借款人姓名', prop: 'userName'},
          {
            label: '借款人手机号码', prop: 'userPhone',
            formatter: (row, col, val) => {
              if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
                return filter_hidePhone(val)
              } else {
                return val
              }
            }
          },
          {label: '存管开户时间', prop: 'openAccountTime',
            formatter: (row, col, val) => {
              if (row.openAccountTime) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '绑卡卡号', prop: 'bankCardNo',
            formatter: (row, col, val) => {
              if (row.bankCardNo) {
                return val
              } else {
                return '--'
              }
            }
          },
          {label: '是否提交订单', prop: 'submitFlag', formatter: (row, col, val) => filter_status(val)},
        ],
        pagination: {
          total: 0
        },
        searchLoading: false,
        exportLoading: false
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '渠道名称', key: 'channelName', placeholder: '', hidden: this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman'},
          {type: 'input', label: '借款人姓名', key: 'userName', placeholder: ''},
          {type: 'input', label: '手机号码', key: 'userPhone', placeholder: ''},
          {
            type: 'dateTimeRange',
            hidden: this.activeName !== 'register',
            dateTimeRange: {
              start: {label: '注册时间开始', key: 'registerTimeStart', placeholder: ''},
              end: {label: '注册时间结束', key: 'registerTimeEnd', placeholder: ''}
            }
          },
          {
            type: 'dateTimeRange',
            hidden: this.activeName !== 'realName',
            dateTimeRange: {
              start: {label: '实名认证时间开始', key: 'realNameTimeStart', placeholder: ''},
              end: {label: '实名认证时间结束', key: 'realNameTimeEnd', placeholder: ''}
            }
          },
          {
            type: 'dateTimeRange',
            dateTimeRange: {
              start: {label: '存管开户时间开始', key: 'openAccountTimeStart', placeholder: ''},
              end: {label: '存管开户时间结束', key: 'openAccountTimeEnd', placeholder: ''}
            }
          },
          {
            type: 'select', label: '是否存管开户', key: 'openAccountFlag', placeholder: '',
            hidden: this.activeName === 'cgkh',
            options: [
              {text: '是', value: true},
              {text: '否', value: false}
            ]
          },
          {
            type: 'select', label: '是否提交订单', key: 'submitFlag', placeholder: '',
            options: [
              {text: '是', value: true},
              {text: '否', value: false}
            ]
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
              {label: '导出', type: 'primary', function: this.handleExportExcel, disabled: this.exportLoading}
            ]
          }
        ]
      }
    },
    created() {
      this.keyupSubmit();
      this.getList()
    },
    methods: {
      handleTabClick() {
        this.searchParams = {
          pageNum: 1,
          pageSize: 10
        };
        this.list = [];
        this.pagination = {
          total: 0
        };
        this.getList()
      },
      getList() {
        let search = this.$deepcopy(this.searchParams);
        switch (this.activeName) {
          case 'register':
            this.tabType = 1;
            // 注册tab没有实名认证时间查询条件
            delete search.realNameTimeStart;
            delete search.realNameTimeEnd;
            break;
          case 'realName':
            this.tabType = 2;
            // 实名tab没有注册时间查询条件
            delete search.registerTimeStart;
            delete search.registerTimeEnd;
            break;
          case 'cgkh':
            this.tabType = 3;
            // 存管开户tab没有注册时间、实名认证、是否存管开户查询条件
            delete search.registerTimeStart;
            delete search.registerTimeEnd;
            delete search.realNameTimeStart;
            delete search.realNameTimeEnd;
            delete search.openAccountFlag;
            break;
        }
        this.searchLoading = true;
        getDataCountList(this.tabType, search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.pagination.total = res.body.total;
            // 数据大于100页时隐藏分页器最大页数
            this.pagination.hideMaxPage = res.body.pages > 100
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
            this.handleClickSearch()
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
      handleExportExcel() {
        this.exportLoading = true;
        const search = this.$deepcopy(this.searchParams);
        delete search.pageSize;
        delete search.pageNum;
        exportExcel(this.tabType, search).then(res => {
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
          this.exportLoading = false;
        })
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList()
      },
    }
  }
</script>