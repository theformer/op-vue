import Vue from 'vue'
import Vuex from 'vuex'
import {$getLocalStorage} from "../lib/methods";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { //原始数据
    activeMenuPath: '',
    breadcrumbs: [],
    enums: {},
    buttons: []
  },
  mutations: { //内部事件
    // 选中菜单path
    saveActiveMenuPath(state, activeMenuPath) {
      state.activeMenuPath = activeMenuPath;
    },
    // 面包屑导航
    saveBreadcrumbs(state, matched) {
      state.breadcrumbs = [];
      matched.forEach((item) => {
        item.meta.title && state.breadcrumbs.push({title: item.meta.title, path: item.path.replace(/:orgCode/, $getLocalStorage('orgCode'))});
      });
    },
    // 系统内数据字典
    saveSysEnum(state, enums) {
      state.enums = {...enums};
    },
    // 用户有权限的按钮集合
    saveButtons(state, buttons) {
      state.buttons = buttons;
    },
    // 清除store信息
    clearStore(state) {
      state.activeMenuPath = '';
      state.breadcrumbs = [];
      state.enums = {};
      state.buttons = [];
    }
  },
  actions: {
    saveActiveMenuPath(ctx, activeMenuPath) {
      ctx.commit("saveActiveMenuPath", activeMenuPath);
    },
    saveBreadcrumbs(ctx, path) {
      ctx.commit("saveBreadcrumbs", path);
    },
    saveButtons(ctx, buttons) {
      ctx.commit("saveButtons", buttons);
    }
  }
})