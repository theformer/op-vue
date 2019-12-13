<template>
  <div class="pt-public">
    <el-container class="public-header">
      <Header/>
    </el-container>
    <el-container class="public-content">
      <Main class="content-main"/>
    </el-container>
  </div>
</template>

<script>
  import Header from '@/components/ptHeader'
  import Main from '@/components/ptMain'

  export default {components: {Header, Main}}

</script>

<style lang="scss">
  .pt-public {
    display: flex;
    flex-direction: column;

    .public-header {
      border-bottom: 1px solid #dfdfdf;
      background: #001629;
      height: 60px;
    }

    .public-content {
      height: calc(100vh - 60px);
      display: flex;
      flex-direction: row;

      .content-aside {
        width: 200px !important;
        background: #1E262F no-repeat 50% 100%;
        background-size: 126px 54px;
      }

      .content-main {
        overflow: hidden;
        background: #EEE;
        padding: 50px 40px;
      }
    }
  }
</style>