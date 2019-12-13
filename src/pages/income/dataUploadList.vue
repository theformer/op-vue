<template>
  <div>
    <div class="searchBox">
      <el-upload
        action=""
        accept="application/zip"
        :http-request="handleUploadZip"
        :before-upload="handleBeforeUpload"
        :show-file-list="false"
        :disabled="isUploading">
        <el-button size="small" type="primary" v-if="$hasButton('income-dataUpload-upload')">点击上传</el-button>
      </el-upload>
    </div>
    <div class="pt-table margin-top20 inside-margin">
      <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.uploadStatus === 1 || scope.row.uploadStatus === 4">
              <div style="height: 42px;"></div>
            </template>
            <template v-if="scope.row.uploadStatus === 2">
              <el-tooltip content="删除">
                <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDelete(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-delete')"></el-button>
              </el-tooltip>
            </template>
            <template v-if="scope.row.uploadStatus === 3">
              <el-tooltip content="导入">
                <el-button type="text" icon="el-icon-document-add" class="btn-operation" @click="handleImport(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-import')"></el-button>
              </el-tooltip>
              <el-tooltip content="删除">
                <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDelete(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-delete')"></el-button>
              </el-tooltip>
            </template>
            <template v-if="scope.row.uploadStatus === 5">
              <el-tooltip content="查看">
                <el-button type="text" icon="el-icon-view" class="btn-operation" @click="checkDetail(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-check')"></el-button>
              </el-tooltip>
            </template>
            <template v-if="scope.row.uploadStatus === 6">
              <el-tooltip content="查看">
                <el-button type="text" icon="el-icon-view" class="btn-operation" @click="checkDetail(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-check')"></el-button>
              </el-tooltip>
              <el-tooltip content="删除">
                <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDelete(scope.row.uploadNumber)" v-if="$hasButton('income-dataUpload-delete')"></el-button>
              </el-tooltip>
            </template>
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
  import { getDataUploadList, importData, deleteData, uploadFile } from '@/service/income/dataUpload';
  export default {
    name: 'dataUploadList',
    data() {
      return {
        statusMap: {
          1: '解析中',
          2: '解析失败',
          3: '解析成功',
          4: '导入中',
          5: '部分数据导入失败',
          6: '导入成功',
        },
        searchLoading: false,
        isUploading: false,
        isOperating: false,
        channelList: [],
        list: [],
        total: 0,
        columns: [
          {label: '上传编号', prop: 'uploadNumber'},
          {label: '文件名', prop: 'fileName'},
          {label: '上传时间', prop: 'uploadTime'},
          {
            label: '状态',
            prop: 'uploadStatus',
            formatter: (row, col, val) => {
              return this.statusMap[val];
            }
          },
          {label: '创建人', prop: 'createdByName'},
        ],
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getDataUploadList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.total = res.body.total;
          }
        }).finally(() => {
          this.searchLoading = false;
        });
      },
      handleBeforeUpload(file) {
        //系统不同，该类型不同
        // const isZIP = /^application\/(zip)/i.test(file.type);
        const tempArr = file.name.split('.');
        const isSuffix = tempArr[1].toLowerCase() === 'zip';
        const isLt500M = file.size / 1024 / 1024 < 500;
        if (!isSuffix ) {
          this.$message.error('只能上传zip压缩文件!');
        }
        if (!isLt500M) {
          this.$message.error('上传压缩包大小不能超过500MB！');
        }
        return isSuffix && isLt500M;
      },
      handleUploadZip(e) {
        this.isUploading = true;
        let _formData = new FormData();
        _formData.append('file', e.file);
        uploadFile(_formData).then(res => {
          if (res.code === '200') {
            this.$message.success('上传成功，请稍后刷新页面查看解析进度！');
            this.getList();
          }
        }).finally(() => {
          this.isUploading = false;
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

      //导入数据
      handleImport(uploadNumber) {
        if (this.isOperating) return;
        this.isOperating = true;
        importData(uploadNumber).then(res => {
          if (res.code === '200') {
            this.$message.success('导入成功，请稍后刷新页面查看！');
            this.getList();
          }
        }).finally(() => {
          this.isOperating = false;
        })
      },

      //删除数据
      handleDelete(uploadNumber) {
        if (this.isOperating) return;
        this.isOperating = true;
        deleteData(uploadNumber).then(res => {
          if (res.code === '200') {
            this.$message.success('删除成功！');
            this.getList();
          }
        }).finally(() => {
          this.isOperating = false;
        })
      },

      //查看数据
      checkDetail(uploadNumber) {
        this.$router.push({
          name: 'dataUploadDetail',
          params: { id: uploadNumber }
        });
      }
    },
  }
</script>

<style lang="scss" scoped>
  .searchBox {
    background: #F6F7FB;
    padding: 15px 25px;
    overflow: hidden;
    text-align: right;
  }
  .delete{
    color: #f56c6c;
  }
</style>
