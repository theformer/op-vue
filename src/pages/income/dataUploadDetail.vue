<template>
  <div>
    <div class="formBox">
      <el-form :model="searchForm" ref="searchForm" :inline="true" label-width="100px">
        <el-form-item label="数据编号" prop="thirdOrderNo">
          <el-input v-model.trim="searchForm.thirdOrderNo" placeholder="请输入数据编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="团单编号" prop="groupNo">
          <el-input v-model.trim="searchForm.groupNo" placeholder="请输入团单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyDate">
          <el-date-picker
            v-model="searchForm.applyDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model.trim="searchForm.name" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.trim="searchForm.phone" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <template v-if="showChannelFilter">
          <el-form-item label="渠道" prop="channel">
            <el-select v-model="searchForm.channel" filterable placeholder="请选择渠道" @change="getSalesMan" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="showSalesFilter">
          <el-form-item label="业务员" prop="salesman">
            <el-select v-model="searchForm.salesman" placeholder="请选择业务员" clearable>
              <el-option
                v-for="item in salesManList"
                :key="item.phone"
                :label="item.username+item.phone"
                :value="item.phone">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="handleSearch" :loading="isSearching">查询</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pt-table margin-top20 inside-margin">
      <el-table :data="listInfo" header-cell-class-name="thead" cell-class-name="tbody">
        <el-table-column prop="thirdOrderNo" label="数据编号"></el-table-column>
        <el-table-column prop="groupNo" label="团单编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="loanAmount" label="申请金额" :formatter="formatMoney"></el-table-column>
        <el-table-column prop="loanTerm" label="申请期限"></el-table-column>
        <el-table-column prop="fullName" label="客户姓名"></el-table-column>
        <el-table-column prop="loginName" label="手机号码" :formatter="mobileFilter"></el-table-column>
        <el-table-column width="100" prop="createdTime" label="申请时间"></el-table-column>
        <el-table-column prop="applyChannel" label="渠道"></el-table-column>
        <el-table-column prop="salesman" label="业务员"></el-table-column>
        <el-table-column label="导入状态">
          <template slot-scope="scope">
            <template v-if="scope.row.errorMsg">
              <el-popover
                placement="left"
                width="200"
                trigger="hover"
                effect="dark"
                :content="scope.row.errorMsg">
                <el-button type="text" style="color: #f56c6c;" slot="reference">有数据错误</el-button>
              </el-popover>
            </template>
            <template v-else>导入成功</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.errorMsg">
              <el-tooltip content="删除">
                <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDelete(scope.row.id)" v-if="$hasButton('income-dataUploadDetail-delete')"></el-button>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="jumper, prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="pagination.pageNum"
        :page-size.sync="pagination.pageSize">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import { getDataList, deleteSingleData } from '@/service/income/dataUpload';
  import { getAllChannel, getSalesManList } from '@/service/income/income';
  import {filter_hidePhone, filter_formatMoney} from '../../lib/filters';

  export default {
    name: "dataUploadDetail",
    data() {
      return {
        uploadId: null,
        loginAccountType: this.$getLocalStorage('userInfo').accountType,
        isSearching: false,
        isOperating: false,
        showChannelFilter: true,
        showSalesFilter: true,
        listInfo: [],
        searchForm: {
          thirdOrderNo: '',
          groupNo: '',
          name: '',
          phone: '',
          applyDate: [],
          channel: '',
          salesman: ''
        },
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        channelList: [],
        salesManList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        }
      }
    },
    created() {
      this.uploadId = this.$route.params.id || null;
      if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
        this.showChannelFilter = false;
      }
      if (this.loginAccountType === 'channelSalesman') {
        this.showSalesFilter = false;
      }

      //获取渠道
      getAllChannel().then(res => {
        if (res.code === '200') {
          this.channelList = res.body || [];
        }
        this.getListInfo();
      })

      //获取业务员列表
      if (this.loginAccountType === 'channelAdmin') {
        this.getSalesMan();
      }
    },
    methods: {
      getListInfo(pageSize = 10, pageNum = 1) {
        this.isSearching = true;
        const { thirdOrderNo, groupNo, name, phone, applyDate, channel, salesman } = this.searchForm;
        let params = {
          uploadNumber: this.uploadId,
          thirdOrderNo: thirdOrderNo,
          groupNo: groupNo,
          applyDateStart: applyDate && applyDate[0],
          applyDateEnd: applyDate && applyDate[1],
          fullName: name,
          mobilePhone: phone,
          applyChannel: channel,
          salesman: salesman,
          pageSize,
          pageNum
        };
        for (let key in params) {
          if (params.hasOwnProperty(key)) {
            if (!params[key]) delete params[key];
          }
        }
        getDataList(params).then(res => {
          if (res.code === '200') {
            this.listInfo = res.body.list || [];
            this.pagination.total = res.body.total;
          }
        }).finally(() => {
          this.isSearching = false;
        });
      },
      handleCurrentChange(val) {
        this.getListInfo(this.pagination.pageSize, val);
      },
      handleSizeChange(val) {
        this.getListInfo(val, this.pagination.pageNum);
      },
      handleSearch(e) {
        e.preventDefault();
        this.isSearching = true;
        this.pagination.pageNum = 1;
        this.getListInfo(this.pagination.pageSize, 1);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 获取业务员
      getSalesMan(channel) {
        let params = channel ? { channelCode: channel } : {};
        getSalesManList(params).then(res => {
          if (res.code === '200') {
            this.salesManList = res.body;
          }
        })
      },
      // 删除错误数据
      handleDelete(id) {
        if (this.isOperating) return;
        this.isOperating = true;
        deleteSingleData(id).then(res => {
          if (res.code === '200') {
            this.$message.success('删除成功！');
            this.getListInfo();
          }
        }).finally(() => {
          this.isOperating = false;
        })
      },
      formatMoney(row, col, val) {
        return filter_formatMoney(val);
      },
      mobileFilter(row, col, val) {
        if (this.loginAccountType === 'channelAdmin' || this.loginAccountType === 'channelSalesman') {
          return filter_hidePhone(val)
        } else {
          return val
        }
      },
    },

  }
</script>

<style lang="scss">
  .formBox{
    padding: 15px 25px;
    background: #F6F7FB;
    .el-form-item{
      margin-bottom: 10px;
      .el-form-item__content{
        min-width: 220px;
      }
      .el-select{
        width: 100%;
      }
    }
  }
</style>
