<template>
  <div>
    <pt-search :items="items" :params="searchParams"></pt-search>
    <div class="pt-table margin-top20 inside-margin">
      <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
        <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
        <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop" :label="column.label"
                         :formatter="column.formatter" :width="column.width"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="修改">
              <el-button type="text" icon="el-icon-edit" class="btn-operation"
                         @click="handleEdit(scope.row)" v-if="$hasButton('channel-channel-edit')"></el-button>
            </el-tooltip>
            <el-tooltip content="生成渠道二维码">
              <el-button type="text" icon="iconfont icon-ico" class="btn-operation"
                         @click="handleQrCode(scope.row, 'channel')" v-if="$hasButton('channel-channel-qrCode')"></el-button>
            </el-tooltip>
            <el-tooltip content="账号管理">
              <el-button type="text" icon="iconfont icon-zhanghaoguanli" class="btn-operation"
                         @click="handleDetail(scope.row)" v-if="$hasButton('channel-channel-account')"></el-button>
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
        @size-change="handleSizeChange($event, 'searchParams')"
        @current-change="handleCurrentChange($event, 'searchParams')"
        :disabled="searchLoading"
      ></el-pagination>
    </div>

    <el-dialog :title="channelDetailTitle" :visible.sync="channelVisible" append-to-body width="40%"
               :close-on-click-modal="false">
      <el-form :model="channelDetail" label-width="100px" :rules="channelRules" ref="channelDetail">
        <el-form-item label="渠道编号" prop="channelCode" v-if="mode !== 'add'">
          <el-input v-model.trim="channelDetail.channelCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channelName">
          <el-input v-model.trim="channelDetail.channelName" placeholder="请输入渠道名称"></el-input>
        </el-form-item>
        <el-form-item label="关联产品" prop="relationProduct" class="required">
          <template>
            <el-button v-for="(item, index) in channelDetail.productList" :key="index" type="danger" size="mini"
                       @click="deleteRelationProduct(item)">{{item.productName}}
              <i class="el-icon-delete el-icon--right"></i>
            </el-button>
          </template>
          <el-button type="primary" size="mini" @click="handleAddProduct">+添加已有产品
          </el-button>
        </el-form-item>
        <el-form-item label="渠道状态" prop="channelStatus">
          <el-radio-group v-model="channelDetail.channelStatus">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="channelVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveChannel" :loading="channelSaveLoading"
                   :disabled="channelSaveLoading">保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加已有产品" :visible.sync="productVisible" append-to-body width="40%" :close-on-click-modal="false">
      <div class="pt-table">
        <el-table :data="productList" header-cell-class-name="thead" cell-class-name="tbody">
          <el-table-column label="选择" width="50" fixed="left">
            <template slot-scope="scope">
              <el-checkbox :key="scope.row.id + scope.row.isChecked" v-model="scope.row.isChecked"
                           @change="handleSelectProduct(scope.row)" :checked="isChecked(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="产品编号" prop="productNo"></el-table-column>
          <el-table-column label="产品名称" prop="productName"></el-table-column>
          <el-table-column label="产品类型" prop="productType"
                           :formatter="(row, col, val) => this.$filterSysEnumByDicCode(val, this.$enum.ProductType)"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="jumper, prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 30, 50, 100]"
          :total="productTotal || 0"
          :current-page="productSearchParams.pageNum"
          :page-size="productSearchParams.pageSize"
          @size-change="handleSizeChange($event, 'productSearchParams')"
          @current-change="handleCurrentChange($event, 'productSearchParams')"
          :disabled="productSearchLoading"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProduct">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="qrCodeVisible" append-to-body :close-on-click-modal="false" width="500px">
      <div class="center">
              <span v-for="item in qrCodes" :key="item.id" class="qrCode-container">
                <img :src="item.qrcodeUrl" alt="">
                <el-button type="primary" @click="handleDownloadQrCode(item)" :loading="item.loading"
                           :disabled="item.loading">下载</el-button>
              </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getChannelList, addChannel, updateChannel, qrcode, getChannelDetail, downloadQrcode} from '@/service/channel/channel'
  import {getProductList} from '@/service/product/product'

  export default {
    name: "channelList",
    data() {
      return {
        list: [],
        baseNum: 1,
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        mode: '',
        channelVisible: false,
        channelDetailTitle: '添加渠道',
        channelDetail: {
          productList: []
        },
        channelRules: {
          channelName: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 50)
              }, trigger: 'blur'
            }
          ],
          channelStatus: [{
            required: true, message: '请选择渠道状态', trigger: 'change'
          }]
        },
        qrCodeVisible: false,
        qrCodes: [],
        columns: [
          {label: '渠道名称', prop: 'channelName'},
          {label: '关联产品', prop: 'relationProducts'},
          {label: '状态', prop: 'channelStatus'}
        ],
        total: 0,
        accountSearchParams: {
          pageNum: 1,
          pageSize: 10
        },
        accountList: [],
        accountColumns: [
          {label: '注册手机号码', prop: 'phone'},
          {label: '姓名', prop: 'username'},
          {
            label: '角色', prop: 'accountType',
            formatter: (row, col, val) => {
              return {2: '渠道管理员', 3: '业务员'}[val];
            }
          }
        ],
        ownId: [],
        newAccount: {
          riskResult: ''
        },
        productList: [],
        productSearchParams: {
          pageNum: 1,
          pageSize: 10
        },
        selectProducts: [],
        productTotal: 0,
        productVisible: false,
        saveLoading: false,
        searchLoading: false,
        productSearchLoading: false,
        accountSearchLoading: false,
        channelSaveLoading: false
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '渠道名称', key: 'channelName', placeholder: ''},
          {
            type: 'buttonGroup',
            buttons: [
              {label: '查询', type: 'primary', function: this.handleClickSearch, disabled: this.searchLoading},
              {label: '重置', function: this.handleResetSearch},
            ]
          },
          {
            type: 'rightButtonGroup',
            buttons: [
              {label: '+添加渠道', type: 'primary', function: this.handleAddChannel, hidden: !this.$hasButton('channel-channel-add')}
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
      handleDetail(row) {
         this.$router.push({
           name: 'channelAccount',
           params: {orgCode: this.$route.params.orgCode},
           query: {id: row.id}
         })
      },
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getChannelList(search).then(res => {
          if (res.code === '200') {
            if (res.body.list && res.body.list.length) {
              res.body.list.forEach(ele => {
                let relationProducts = [];
                if (ele.loanProductList && ele.loanProductList.length) {
                  ele.loanProductList.forEach(ele => {
                    ele ? relationProducts.push(ele.productName) : '';
                  })
                }
                ele['relationProducts'] = relationProducts.join('，')
              })
            }
            this.list = res.body.list;
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].channelStatus == false) {
                this.list[i].channelStatus = '启用'
              } else {
                this.list[i].channelStatus = '停用'
              }
            }
            this.total = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
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
            if (this.productVisible) {
              this.getProductList()
            }  else {
              this.handleClickSearch()
            }
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
      handleSizeChange(val, type) {
        this[type]['pageSize'] = val;
        switch (type) {
          case 'searchParams':
            this.getList();
            break;
          case 'productSearchParams':
            this.getProductList();
            break;
        }
      },
      handleCurrentChange(val, type) {
        this[type]['pageNum'] = val;
        switch (type) {
          case 'searchParams':
            this.getList();
            break;
            case 'productSearchParams':
            this.getProductList();
            break;
        }
      },
      resetFields(form) {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      //添加渠道
      handleAddChannel() {
        this.channelVisible = true;
        this.channelDetailTitle = '添加渠道';
        this.resetFields('channelDetail');
        this.selectProducts = [];
        this.channelDetail = {
          productList: []
        };
        this.mode = 'add';
      },
      // 删除关联的产品
      deleteRelationProduct(item) {
        for (let i = 0, len = this.channelDetail.productList.length; i < len; i++) {
          if (item.id === this.channelDetail.productList[i].id) {
            this.channelDetail.productList.splice(i, 1);
            break
          }
        }
      },
      getProductList() {
        this.productSearchLoading = true;
        const search = this.$deepcopy(this.productSearchParams);
        getProductList(search).then(res => {
          if (res.code === '200') {
            this.productList = res.body.list;
            if (this.productList && this.productList.length) {
              this.productList.forEach(ele => {
                ele['isChecked'] = false;
                this.selectProducts.forEach(item => {
                  if (ele.id === item.id) {
                    ele['isChecked'] = true
                  }
                })
              })
            }
            this.productTotal = res.body.total;
            this.productVisible = true;
          }
        }).finally(() => {
          this.productSearchLoading = false;
        });
      },
      handleAddProduct() {
        this.productSearchLoading = false;
        this.selectProducts = this.$deepcopy(this.channelDetail.productList);
        this.productSearchParams = {
          pageNum: 1,
          pageSize: 10
        };
        this.getProductList();
      },
      // 选择产品
      handleSelectProduct(row) {
        if (row.isChecked) {
          if (!this.selectProducts.some(ele => {
            return ele.id === row.id
          })) {
            this.selectProducts.push(row)
          }
        } else {
          for (let i = 0, len = this.selectProducts.length; i < len; i++) {
            if (row.id === this.selectProducts[i].id) {
              this.selectProducts.splice(i, 1);
              break
            }
          }
        }
      },
      // 判断是否选中
      isChecked(row) {
        return this.selectProducts.some(ele => {
          return ele.id === row.id
        })
      },
      handleSaveProduct() {
        this.channelDetail.productList = this.$deepcopy(this.selectProducts);
        this.productVisible = false;
      },
      handleEdit(row) {
        this.resetFields('channelDetail');
        this.selectProducts = [];
        getChannelDetail(row.id).then(res => {
          if (res.code === '200') {
            this.channelVisible = true;
            this.channelDetailTitle = '修改渠道';
            let data = res.body;
            this.channelDetail = {
              id: data.id,
              channelCode: data.channelCode,
              channelName: data.channelName,
              productList: [],
              channelStatus: data.channelStatus
            };
            if (data.loanProductList && data.loanProductList.length) {
              data.loanProductList.forEach(ele => {
                ele ? this.channelDetail.productList.push(ele) : ''
              })
            }
            this.mode = 'edit';
          }
        });
      },
      // 生成渠道二维码
      handleQrCode(row, type) {
        this.qrCodes = [];
        let params;
        if (type === 'ywy') {
          params = {
            channelId: this.newAccount.channelId,
            agentId: row.id
          }
        } else {
          params = {
            channelId: row.id
          };
        }
        qrcode(params).then(res => {
          if (res.code === '200') {
            this.qrCodeVisible = true;
            if (res.body && res.body.length) {
              res.body.forEach(ele => {
                ele['loading'] = false;
              })
            }
            this.qrCodes = res.body;
          }
        })
      },
      // 下载二维码
      handleDownloadQrCode(item) {
        item.loading = true;
        downloadQrcode({url: item.qrcodeUrl}).then(res => {
          let arr = item.qrcodeUrl.split('?')[0].split('/');
          let fileName = arr[arr.length - 1];
          let src = 'data:image/jpg;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.$downloadFile(src, fileName, 'image/jpg');
        }).finally(() => {
          item.loading = false;
        })
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: message
          });
          this.channelVisible = false;
          this.searchParams.pageNum = 1;
          this.getList();
        }
      },
      handleSaveChannel() {
        this.$refs.channelDetail.validate(valid => {
          if (valid) {
            if (!this.channelDetail.productList.length) {
              this.$message({
                showClose: true,
                type: 'error',
                message: '请添加已有产品'
              });
              return false;
            }
            this.channelSaveLoading = true;
            const params = this.$deepcopy(this.channelDetail);
            params.productIds = [];
            params.productList.forEach(ele => {
              params.productIds.push(ele.id)
            });
            delete params.productList;
            if (!this.channelDetail.id) {
              addChannel(params).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.channelSaveLoading = false;
              })
            } else {
              updateChannel(params).then(response => {
                this.handleConfirm(response, '修改成功');
              }).finally(() => {
                this.channelSaveLoading = false;
              });
            }
          } else {
            return false;
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .colorGray {
    color: #c0c4cc;
  }

  .center {
    text-align: center;
  }

  .maxLength {
    width: 80%;
  }

  .account-tip {
    color: red;
  }

  .divDisplay {
    display: inline;
    margin-left: 15px;
  }

  .qrCode-container {
    width: 230px;
    padding: 5px;
    display: inline-block;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }

    .el-button {
      width: 75%;
    }
  }
</style>