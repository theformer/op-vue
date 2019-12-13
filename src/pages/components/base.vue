<template>
  <router-view/>
</template>

<script>
  export default {
    // 页面添加监听
    mounted() {
      window.addEventListener('keyup', this.handleKeyUpListener);
    },
    // 页面移除监听
    destroyed() {
      window.removeEventListener('keyup', this.handleKeyUpListener);
    },
    methods: {
      // 监听回车按键
      handleKeyUpListener(e) {
        // 回车键，获取焦点的控件非分页功能中页码跳转输入框
        if (e.keyCode === 13 && document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
          this.handleKeyUpEnter && this.handleKeyUpEnter();
        }
      }
    }
  }
</script>