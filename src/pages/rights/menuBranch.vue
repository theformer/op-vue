<template>
    <li class="menu-branch" v-if="branch && !branch.isButton">
        <div class="menu-tree-content">
            <div><el-checkbox :true-label="branch.id" @change="check(branch.id)" :class="{'menu-tree-checked': branch.checked || branch.state}">{{ branch.name }}</el-checkbox></div>
            <div class="menu-button-tree-node">
                <template v-for="button in branch.button">
                    <el-checkbox :key="button.id" :true-label="button.id" @change="check(button.id)" :class="{'menu-tree-checked': button.checked || button.state}">{{ button.name }}</el-checkbox>
                </template>
            </div>
        </div>
        <ul class="tree-group" v-if="branch.branch.length">
            <li is="menuBranch" v-for="a in branch.branch" :key="a" :branch="tree[a]" :tree="tree" @check="check"></li>
        </ul>
    </li>
</template>

<script>
  export default {
    name: 'menuBranch',
    props: {
      branch: {},
      tree: {}
    },
    methods: {
      // 选中/取消选中的操作处理
      check: function (bId) {
        this.$emit('check', bId);
      },
      // 折叠/展开的事件处理
      /*toggle: function (bId) {
        this.$emit('toggle', bId);
      }*/
    }
  }
</script>

<style lang="scss">
    .menu-branch{
        margin: 0;
        padding: 0;
        list-style: none;
        .is-checked{
            &.el-checkbox__input{
                .el-checkbox__inner{
                    background-color: #FFF;
                    border-color: #DCDFE6;
                }
            }
            .el-checkbox__label{
                color: #606266;
            }
        }
        .is-disabled{
            &.el-checkbox__input{
                .el-checkbox__inner{
                    background-color: #edf2fc;
                    border-color: #DCDFE6;
                }
            }
            &.is-checked{
                .el-checkbox__inner:after{
                    display: none;
                }
            }
        }
    }
    .menu-tree-content{
        display: flex;
    }
    .tree-group{
        padding-left: 25px;
    }
    .menu-button-tree-node{
        margin-left: 20px;
        .el-checkbox{
            margin-right: 20px;
        }
        .btn-container{
            margin-right: 20px;
        }
    }
    .menu-tree-checked{
        .is-checked{
            &.el-checkbox__input{
                .el-checkbox__inner{
                    background-color: #409eff;
                    border-color: #409eff;
                    &:after{
                        display: inline-block;
                    }
                }
                &:after{
                    transform: rotate(45deg) scaleY(1);
                }
            }
        }
        .el-checkbox__inner{
            background-color: #409eff;
            border-color: #409eff;
            &:after{
                transform: rotate(45deg) scaleY(1);
            }
        }
        .is-disabled{
            &.el-checkbox__input{
                .el-checkbox__inner{
                    background-color: #edf2fc;
                    border-color: #DCDFE6;
                }
            }
        }
    }
</style>