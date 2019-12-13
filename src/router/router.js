import Vue from 'vue'
import Router from 'vue-router'
import {MessageBox} from "element-ui";

import Organization from './modules/organization.router'
import Rights from './modules/rights.router'
import Customer from './modules/customer.router'
import Channel from './modules/channel.router'
import Product from './modules/product.router'
import Income from './modules/income.router'
import DataCount from './modules/dataCount.router'
import LoanManage from './modules/loanManage.router'
import Common from './modules/common.router'

import store from "../store/store";

import {$getLocalStorage, $setLocalStorage, $removeLocalStorage} from "../lib/methods";

import {R_AllSysEnum} from "../service/common/common";
import {R_CheckMenu, checkTenantStatus} from "../service/account/account";

Vue.use(Router);

const router = new Router({mode: 'history', routes: [Organization, Rights, Customer, Channel, Product, Income, DataCount, LoanManage, ...Common]});

router.beforeEach((to, from, next) => {
  let _orgCode = to.params.orgCode;
  // 地址不带机构号，直接加载页面信息，页面显示404
  if (!_orgCode) return next();
  if (!$getLocalStorage('orgCode') || $getLocalStorage('orgCode') !== _orgCode) {
    $setLocalStorage('orgCode', _orgCode);
  }
  // 登录后修改地址中的机构号，需要跳转到登录页，清除tenantToken
  if(_orgCode !== window.$cookies.get('tenantToken')) {
    let returnUrl = to.path;
    window.$cookies.remove('tenantToken');
    window.$cookies.remove('opfunToken');
    $setLocalStorage('orgCode', _orgCode);
    to.name !== 'login' ? $setLocalStorage('returnUrl', returnUrl) : $removeLocalStorage('returnUrl');
  }

  // 登录页面，直接加载页面信息
  if (to.name === 'login') {
    return checkTenantStatus({tenantNo: _orgCode}).then(res => {
      if (res.code === '200') {
        next();
      } else {
        MessageBox.alert(res.message, '提示', {
          callback: () => {
          }
        })
      }
    })
  }

  // 无用户信息时，跳转至登录页面
  if (!$getLocalStorage('userInfo')) return next({name: 'login', query: {returnUrl: to.path}, params: {orgCode: _orgCode}});

  // 页面左上角公司logo
  /*if (!$getLocalStorage('logoUrl')) {
    $setLocalStorage('logoUrl', 'https://h5.360fengdai.com/favicon.ico');
  }*/

  let goNext = function () {
    // 设置已选中菜单
    store.dispatch("saveActiveMenuPath", to.matched.length > 1 ? (to.matched[to.matched.length - 2].path).replace(/:orgCode/, _orgCode) : '').then();

    // 设置面包屑
    store.dispatch("saveBreadcrumbs", to.matched).then();

    // 检查用户的权限按钮
    if (!store.state.buttons.length) {
      const asideMenus = $getLocalStorage('asideMenus');
      let buttons = [];
      let getButtons = ele => {
        if (ele.button && ele.button.length) {
          ele.button.forEach(button => {
            buttons.push(button.url)
          })
        }
        if (ele.child && ele.child.length) {
          ele.child.forEach(child => {
            getButtons(child);
          });
        }
      };
      if (asideMenus) {
        asideMenus.forEach(ele => getButtons(ele));
        store.commit("saveButtons", buttons);
      }
    }

    // 检查数据字典
    if (!Object.keys(store.state.enums).length) return R_AllSysEnum().then(res => {
      let enums = {};
      if (res.code === '200') {
        res.body.forEach(item => {
          enums[item.type] = enums[item.type] || [];
          enums[item.type].push({text: item.label, value: item.value});
        });
        store.commit("saveSysEnum", enums);
      }
      next();
    }).catch(next);

    next();
  };

  // 判断有无查看页面权限
  if (to.name !== 'blank' && to.name !== '404') {
    // let route = to.matched.length > 1 ? (to.matched[to.matched.length - 2].path).replace(/\/:orgCode/, '') : '';
    // return R_CheckMenu(route).then(res => {
    //   if (res.code === '200') {
    //     $setLocalStorage('returnUrl', to.path);
    //     goNext();
    //   } else {
    //     if (res.code === 'AUTHORITY_NO_PERMISSSION_ERROR') {
    //        MessageBox.alert(res.message, '提示', {
    //         callback: () => {
    //         }
    //       })
    //     }
    //   }
    // });
    goNext();
  }
  else {
    $removeLocalStorage('returnUrl');
    goNext();
  }
})

export default router;