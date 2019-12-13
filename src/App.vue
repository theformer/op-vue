<template>
  <router-view/>
</template>
<script>
  export default {
    watch: {
      '$store.state.breadcrumbs'(val) {
        val = val.length > 0 ? val : [{title: '盘古OSS'}];
        document.title = val[val.length - 1].title || '盘古OSS';
      }
    }
  }
</script>