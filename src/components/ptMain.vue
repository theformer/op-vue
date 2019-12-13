<template>
  <el-main class="pt-main">
    <div class="main-top">
      <el-breadcrumb class="top-breadcrumb" separator="/" v-if="$store.state.breadcrumbs.length">
        <template v-for="( breadcrumb ,index) in $store.state.breadcrumbs">
          <el-breadcrumb-item :key="index" v-if="$store.state.breadcrumbs.length-1!==index" :to="{ path: breadcrumb.path }">{{breadcrumb.title}}</el-breadcrumb-item>
          <el-breadcrumb-item :key="index" v-if="$store.state.breadcrumbs.length-1===index">{{breadcrumb.title}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="pt-router">
      <router-view/>
    </div>
  </el-main>
</template>
<style lang="scss">
  .pt-main {
    display: flex;
    flex-direction: column;

    .main-top {
      background: #F6F7FB;
      margin-bottom: 3px;

      .top-breadcrumb {
        float: left;
        padding: 10px 20px!important;

        .el-breadcrumb__separator {
          color: gray;
        }
      }

      .top-back {
        float: right;
        padding: 10px 20px;
      }
    }

    .pt-router {
      overflow: auto;
      background: white;
    }

  }
</style>