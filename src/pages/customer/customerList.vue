<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip content="查看详情">
                            <el-button type="text" icon="el-icon-view"  class="btn-operation" @click="handleCheckDetail(scope.row)" v-if="$hasButton('customer-customer-check')"></el-button>
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
        </div>
    </div>
</template>

<script>
  import {getCustomerList, exportExcel} from '@/service/customer/customer'
  export default {
    name: "customerList",
    data() {
      return {
        list: [],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        columns: [
          {label: '手机号码', prop: 'phone'},
          {label: '姓名', prop: 'username'},
          {label: '注册时间', prop: 'registerTime'},
          {label: '是否实名认证', prop: 'realNameAuthentication'},
          {label: '是否存管开户', prop: 'openAccount'}
        ],
        total: 0,
        searchLoading: false,
        exportLoading: false
      }
    },
    computed: {
      items: function () {
        return [
          {type: 'input', label: '手机号码', key: 'phone', placeholder: ''},
          {type: 'input', label: '姓名', key: 'username', placeholder: ''},
          {
            type: 'dateTimeRange',
            dateTimeRange: {
              start: {label: '注册时间开始', key: 'registerTimeStart', placeholder: ''},
              end: {label: '注册时间结束', key: 'registerTimeEnd', placeholder: ''}
            }
          },
          {
            type: 'select', label: '实名认证', key: 'realNameAuthentication', placeholder: '',
            options: [
              {text: '是', value: true},
              {text: '否', value: false}
            ]
          },
          {
            type: 'select', label: '存管开户', key: 'openAccount', placeholder: '',
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
              {label: '导出', type: 'primary', function: this.exportExcel, disabled: this.exportLoading, hidden: !this.$hasButton('customer-customer-export')}
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
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getCustomerList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.total = res.body.total;
          }
        }).finally(() => {
          this.searchLoading = false
        })
      },
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
            this.handleClickSearch()
          }
        }
      },
      handleClickSearch() {
        this.searchParams.pageNum = 1;
        this.getList()
      },
      handleResetSearch() {
        this.searchParams = {
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize
        }
      },
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList()
      },
      handleCheckDetail(row) {
        this.$router.push({
          name: 'customerDetail',
          params: {orgCode: this.$route.params.orgCode, id: row.id}
        });
      },
      // 导出excel
      exportExcel() {
        this.exportLoading = true;
        const search = this.$deepcopy(this.searchParams);
        delete search.pageSize;
        delete search.pageNum;
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
      }
    }
  }
</script>

<style scoped>

</style>