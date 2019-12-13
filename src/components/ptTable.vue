<template>
  <div class="pt-table">
    <el-table :data="data" border header-cell-class-name="thead" cell-class-name="tbody">
      <el-table-column v-if="showIndex" label="序号" type="index" width="50" fixed="left"></el-table-column>

      <el-table-column v-for="(column,index) in columns" :key="index" :label="column.label" :prop="column.prop" :width="column.width" :fixed="column.fixed">

        <template slot-scope="scope">
          <template v-if="column.extends">
            <template v-for="(extend,index) in column.extends">
              <template v-if="extend.filterFunction && extend.clickFunction">
                <el-button :key="index" @click="handleClickItem(extend.clickFunction, scope.row)" type="text">
                  {{(typeof extend.filterFunction ==='function') ? extend.filterFunction(scope.row[column.prop]): '列配置有误'}}
                </el-button>
              </template>
              <template v-else-if="extend.filterFunction">
                {{(typeof extend.filterFunction ==='function') ? extend.filterFunction(scope.row[column.prop]) : '列配置有误'}}
              </template>
              <template v-else-if="extend.clickFunction">
                <el-button :key="index" @click="handleClickItem(extend.clickFunction, scope.row)" type="text">
                  {{extend.label ? extend.label : scope.row[column.prop]}}
                </el-button>
              </template>
              <template v-else>
                {{scope.row[column.prop]}}
              </template>
            </template>
          </template>
          <template v-else>
            {{scope.row[column.prop]}}
          </template>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      v-if="data && pagination"
      background
      layout="jumper, prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 30, 50, 100]"
      :total="pagination.total || 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  /**
   * 控件说明 : 方便各页面表格内容样式统一，将 element-ui 的 el-table 、el-table-column 、el-pagination 二次封装，使用方式参考【参数说明】和 【element-ui】控件使用说明
   *
   * 参数说明 :
   * data : 加载数据数组
   * showIndex : 是否显示序号，true:显示，false:隐藏
   * columns : 列配置数组
   *    [
   *      label : 对应列头名称
   *      prop : 对应列加载data内容对应 key 值
   *      fixed : 列是否固定在左侧或者右侧，true 表示固定在左侧，或 left(左侧), right(右侧)
   *      width : 对应列的宽度
   *      extends : 扩展内容，支持过滤器、点击、过滤加点击功能
   *          [ 支持一列展示多个内容
   *              {
   *                filterFunction : 过滤器函数，可为空，
   *                clickFunction : 点击操作函数，可为空
   *                label : 固定名称，可为空
   *              }
   *          ]
   *
   * pagination : 分页功能配置，可为空，空时不展示分页
   *    {
   *      total : 数据总条数
   *      handleSizeChange : pageSize 改变时会触发，回调参数为每页条数
   *      handleCurrentChange : currentPage 改变时会触发，回调参数为当前页
   *    }
   *
   */
  export default {
    props: {
      data: Array,
      showIndex: Boolean,
      columns: Array,
      pagination: Object
    },
    mounted() {
    },
    data() {
      return {}
    },
    watch: {},
    methods: {
      handleClickItem(click, item) {
        if (typeof click === 'function') {
          click(item);
        } else {
          this.$message.error('列配置有误')
        }
      },
      handleSizeChange(val) {
        if (typeof this.pagination.handleSizeChange === 'function') {
          this.pagination.handleSizeChange(val);
        } else {
          this.$message.error('分页配置有误')
        }
      },
      handleCurrentChange(val) {
        if (typeof this.pagination.handleCurrentChange === 'function') {
          this.pagination.handleCurrentChange(val);
        } else {
          this.$message.error('分页配置有误')
        }
      }
    }
  }
</script>
<style lang="scss">
  .pt-table {
    .thead {
      background: #F6F7FB;
      color: dimgray;
      text-align: center;
    }

    .tbody {
      text-align: center;
    }

    .el-pagination {
      text-align: center;
      padding: 20px;
    }
  }
</style>
