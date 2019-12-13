<template>
    <div>
        <pt-search :items="items" :params="searchParams"></pt-search>
        <div class="pt-table margin-top20 inside-margin">
            <el-table :data="list" header-cell-class-name="thead" cell-class-name="tbody">
                <el-table-column label="序号" type="index" width="50" fixed="left" :index="baseNum"></el-table-column>
                <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.prop" :label="column.label" :formatter="column.formatter" :width="column.width"></el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip content="修改">
                            <el-button type="text" icon="el-icon-edit"  class="btn-operation" @click="handleEdit(scope.row)" v-if="$hasButton('rights-role-edit')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除">
                            <el-button type="text" icon="el-icon-delete" class="btn-operation btn-operation-delete" @click="handleDelete(scope.row)" :disabled="scope.row.id === 1 || scope.row.id === 2 || scope.row.id === 3" v-if="$hasButton('rights-role-delete')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看">
                            <el-button type="text" icon="el-icon-view"  class="btn-operation" @click="handleCheckDetail(scope.row)" v-if="$hasButton('rights-role-check')"></el-button>
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

        <el-dialog :title="roleDetailTitle" :visible.sync="roleVisible" append-to-body width="60%" :close-on-click-modal="false">
            <el-row>
                <el-col :span="22">
                    <el-form :model="roleDetail" label-width="100px" :rules="roleRules" ref="roleDetail" :disabled="mode === 'check'">
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model.trim="roleDetail.name" placeholder="请输入角色名称" :disabled="roleDetail.id === 1 || roleDetail.id  === 2 || roleDetail.id  === 3"></el-input>
                        </el-form-item>
                        <el-form-item label="权限分配" prop="menu">
                            <!--<el-tree
                                    class="margin-top10"
                                    :props="menuProp"
                                    :data="menuData"
                                    node-key="resourceId"
                                    :default-checked-keys="roleDetail.menus"
                                    show-checkbox
                                    default-expand-all
                                    ref="menuTree">
                            </el-tree>-->
                            <menu-tree @update="handleTreeUpdate" :data="menuData" ref="menuTree" :default-checked="roleDetail.checkedMenus"></menu-tree>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">{{mode === 'check' ? '关闭' : '取消'}}</el-button>
                <el-button type="primary" @click="handleSaveRole" :loading="saveLoading" v-if="mode !== 'check'">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {getRoleList, getRoleDetail, getMenuData, addRole, updateRole, deleteRole} from '@/service/rights/rights';
  import menuTree from './menuTree';
  /*
  * 系统管理员的角色id是1，渠道管理员是2，渠道业务员是3
  * */
  export default {
    name: "roleList",
    components: {menuTree},
    data() {
      return {
        list: [],
        baseNum: 1,
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        mode: '',
        roleVisible: false,
        roleDetailTitle: '添加角色',
        roleDetail: {},
        roleRules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.$valid.inviteCodeRule(rule, value, callback, 14)
              }, trigger: 'blur'
            }
          ],
        },
        columns: [
          {label: '角色名称', prop: 'name'},
          {
            label: '添加时间', prop: 'createdTime',
            /*formatter: (row, col, val) => {
              let newDate = new Date(val.split('.')[0].replace('T', ' ').replace(/-/g, '/'));
              newDate.setHours(newDate.getHours() + 8);
              let Y = newDate.getFullYear() + '-';
              let M = (newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1) + '-';
              let D = (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()) + ' ';
              let h = (newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()) + ':';
              let m = (newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()) + ':';
              let s = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
              return (Y + M + D + h + m + s)
            }*/
          },
        ],
        total: 0,
        /*menuProp: {
          label: 'name',
          children: 'child'
        },*/
        menuData: {},
        saveLoading: false,
        searchLoading: false
      }
    },
    computed: {
      items() {
        return [
          {type: 'input', label: '角色名称', key: 'name', placeholder: ''},
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
              {label: '+添加角色', type: 'primary', function: this.handleAddRole, hidden: !this.$hasButton('rights-role-add')}
            ]
          }
        ]
      }
    },
    created() {
      this.keyupSubmit();
      this.getList();
      this.getMenuData();
    },
    methods: {
      getList() {
        this.searchLoading = true;
        const search = this.$deepcopy(this.searchParams);
        getRoleList(search).then(res => {
          if (res.code === '200') {
            this.list = res.body.list;
            this.total = res.body.total;
            this.baseNum = 1 + (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          }
        }).finally(() => {
          this.searchLoading = false;
        })
      },
      // 获取菜单列表
      getMenuData() {
        getMenuData().then(res => {
          if (res.code === '200') {
            this.initTreeData(res.body);
          }
        })
      },
      initTreeData(data) {
        let allBranch = {};
        let rootIds = [];
        let fn = (ele, pid) => {
          if (!allBranch[ele.id]) {
            allBranch[ele.id] = ele;
            allBranch[ele.id].branch = [];
            allBranch[ele.id].checked = false;
            allBranch[ele.id].state = 0;// 选中状态 0：未选中  1：选中
            if (pid) {
              allBranch[ele.id].pid = pid;
            }
          }
          if (ele.button && ele.button.length) {
            ele.button.forEach(button => {
              button.isButton = true;
              allBranch[ele.id].branch.push(button.id);
              fn(button, ele.id);
            })
          }
          if (ele.child && ele.child.length) {
            ele.child.forEach(child => {
              allBranch[ele.id].branch.push(child.id);
              fn(child, ele.id)
            });
          }
        };
        data.forEach(ele => {
          fn(ele);
          rootIds.push(ele.id);
        });
        this.menuData = {
          root: rootIds,
          tree: allBranch
        };
      },
      handleTreeUpdate(newState) {
        let treeData = this.menuData.tree;
        let temp, i, j, k;
        for (i in newState) {
          temp = treeData[i];
          k = newState[i].state;
          for (j in k) {
            temp[j] = k[j];
          }
        }
      },
      keyupSubmit() {
        document.onkeydown = () => {
          // 回车键，获取焦点的控件非分页功能中页码跳转输入框
          if (window.event.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
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
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.getList()
      },
      resetTreeChecked() {
        let tree = this.menuData.tree;
        for(let i in tree) {
          tree[i].checked = false;
          tree[i].state = 0;
        }
      },
      resetFields(form = 'roleDetail') {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
        }
      },
      //添加角色
      handleAddRole() {
        this.resetFields();
        this.mode = 'add';
        this.roleVisible = true;
        this.roleDetailTitle = '添加角色';
        this.resetTreeChecked();
        this.roleDetail = {
          menus: [],
          checkedMenus: []
        };
        this.saveLoading = false;
      },
      handleEdit(row) {
        this.resetFields();
        this.mode = 'edit';
        this.resetTreeChecked();
        this.saveLoading = false;
        this.roleVisible = true;
        this.roleDetailTitle = '修改角色';
        this.getRoleDetail(row.id);
      },
      getRoleDetail(roleId) {
        this.roleDetail = {
          menus: [],
          checkedMenus: []
        };
        getRoleDetail(roleId).then(res => {
          if (res.code === '200') {
            this.roleDetail = {
              id: res.body.roleId,
              name: res.body.roleName,
              menus: res.body.menuId,
              checkedMenus: res.body.menuId.concat(res.body.buttonId)
            }
          }
        })
      },
      handleCheckDetail(row) {
        this.resetFields();
        this.resetTreeChecked();
        this.mode = 'check';
        this.roleVisible = true;
        this.roleDetailTitle = '查看角色';
        this.getRoleDetail(row.id);
      },
      handleConfirm(response, message) {
        if (response.code === '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: message
          });
          this.roleVisible = false;
          this.searchParams.pageNum = 1;
          this.getList();
        }
      },
      handleSaveRole() {
        this.$refs.roleDetail.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            const params = this.$deepcopy(this.roleDetail);
            params.menus = this.$refs.menuTree.getCheckedKeys();
            if (!this.roleDetail.id) {
              addRole(params).then(response => {
                this.handleConfirm(response, '添加成功');
              }).finally(() => {
                this.saveLoading = false;
              })
            } else {
              updateRole(params).then(response => {
                this.handleConfirm(response, '修改成功');
              }).finally(() => {
                this.saveLoading = false;
              });
            }
          } else {
            return false;
          }
        })
      },
      handleDelete(row) {
        if (row.id === 1 || row.id === 2 || row.id === 3) {
          return false
        }
        this.$alert('是否删除该角色?', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '再想想',
          showCancelButton: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              // 确认删除
              deleteRole(row.id).then(response => {
                if (response.code === '200') {
                  this.getList()
                }
              })
            }
          }
        });
      }
    }
  }
</script>