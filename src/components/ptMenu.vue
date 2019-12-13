<template>
    <el-menu class="pt-menu" mode="horizontal" router :unique-opened="true" :default-active="$store.state.activeMenuPath" background-color="#001629" text-color="#D3D3D3" active-text-color="#ffffff">
        <el-submenu v-show="false" index="/">
            <el-menu-item index=""></el-menu-item>
        </el-submenu>
        <template v-for="(menu,index) in menus">
            <el-submenu v-if="menu.child && menu.child.length" :key="index" :index="menu.url" popper-class="pt-sub-menu">
                <template slot="title"><span>{{menu.name}}</span></template>
                <template v-for="(childrenMenu,childrenIndex) in menu.child">
                    <el-submenu v-if="childrenMenu.child && childrenMenu.child.length" :key="childrenIndex" :index="orgCode+menu.url+childrenMenu.url" popper-class="pt-sub-menu">
                        <template slot="title"><span>{{childrenMenu.name}}</span></template>
                        <el-menu-item v-for="(sub,subIndex) in childrenMenu.child" :key="subIndex" :index="orgCode+menu.url+childrenMenu.url+sub.url">
                            {{sub.name}}
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item :key="childrenIndex" :index="orgCode+menu.url+childrenMenu.url" v-else>{{childrenMenu.name}}</el-menu-item>
                </template>
            </el-submenu>
            <el-menu-item v-else :index="orgCode+menu.url">
                {{menu.name}}
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    export default {
      data() {
        return {
          menus: this.$getLocalStorage('asideMenus') || [],
          orgCode: this.$getLocalStorage('orgCode') ? '/' + this.$getLocalStorage('orgCode') : ''
        }
      }
    }
</script>

<style lang="scss">
    .pt-menu {
        border: 0;
        margin: -2px 20px 0;

        .el-menu-item:hover{
            color: white!important;
            background: #0094F9!important;
        }

        .el-submenu:hover{
            .el-submenu__title{
                color: white!important;
                background: #0094F9!important;
            }
        }

        /*打开状态下菜单*/
        .is-opened {
            /*一级菜单*/
            .el-submenu__title{
                border-bottom: transparent!important;
                i {
                    color: white;
                }
            }
        }

        /*选中状态下菜单*/
        .is-active {
            &.el-menu-item{
                color: white!important;
                border-bottom-color: #0094F9!important;
            }
            /*一级菜单*/
            .el-submenu__title {
                color: white!important;
                border-bottom-color: #0094F9!important;
                i {
                    color: white;
                }
                &:hover{
                    color: white!important;
                    i {
                        color: white;
                    }
                }
            }
        }
    }
    /*子菜单*/
    .pt-sub-menu{
        /*二级菜单*/
        .el-menu--popup-bottom-start{
            margin-top: 0;
            min-width: 150px;
            padding: 0;
        }
        .el-submenu__title:hover{
            color: white!important;
            background: #0094F9!important;
        }
        /*三级菜单*/
        .el-menu--popup-right-start{
            margin-left: 0;
            padding: 0;
            min-width: 150px;
            .el-menu-item{
                min-width: 150px;
            }
        }
        .el-menu-item{
            &:hover{
                color: white!important;
                background: #0094F9!important;
            }
        }
    }
</style>