import http from 'axios';
import {$getLocalStorage, $clearLocalStorage, $setLocalStorage} from "./methods";
import {Loading, Message} from "element-ui";
import router from '../router/router';
import store from "../store/store";

let loadingDom;
let loadCount = 0;

export const httpSingle = (opts) => {
  return http(opts);
};

/**
 * 批量请求，统一响应
 */
export const httpAll = (...reqArray) => {
  return http.all(reqArray).then(http.spread((...resArray) => {
    return resArray;
  }))
};

http.interceptors.request.use(
  config => {

    // 防止页面有多个请求时，有一个请求完成后，关闭loading
    loadCount++;

    // loadingDom未初始化时，初始化loadingDom
    if (!loadingDom) {
      loadingDom = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }

    // 从机构A改为机构B，需要跳转到登录页，清除tenantToken
    let _orgCode = router.history.current.params.orgCode;
    if (window.$cookies.get('tenantToken') && _orgCode && (window.$cookies.get('tenantToken') !== _orgCode)) {
      $setLocalStorage('orgCode', _orgCode);
      window.$cookies.remove('tenantToken');
      window.$cookies.remove('opfunToken');
    }

    if (config.method === 'get') {
      // get请求时，参数中增加时间戳，防止缓存
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
      // get参数编码,针对[]没有被encodeURL转义
      let url = config.url;
      url += '?';
      let keys = Object.keys(config.params);
      for (let key of keys) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
      config.url = url;
    }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  response => {

    loadCount--;

    // loadingDom已初始化 且 loadCount小于等于0时，关闭loading
    if (loadingDom && loadCount <= 0) loadingDom.close();

    const {data = {}, config = {}} = response;

    // 401时，提示无权限并跳转至登录
    if (data.code === '401') {
      let _orgCode = $getLocalStorage('orgCode');
      let _returnUrl = $getLocalStorage('returnUrl');
      $clearLocalStorage();
      store.dispatch('saveBreadcrumbs', []);
      Message.error({
        showClose: true,
        message: '未登录或登录已失效,请重新登录'
      });
      try {
        if (router.history.current.name === 'login') {
          // 登录页请求401
          router.push({name: 'login', params: {orgCode:router.history.current.params.orgCode || _orgCode}});
        } else {
          // 从机构A修改地址为机构B，接口401，router.history.current.path为 '/'
          if (router.history.current.path === '/') {
            if (_returnUrl && _returnUrl.replace(/\/:orgCode/, '') !== '/blank') {
              router.push({name: 'login', query: {returnUrl: _returnUrl}, params: {orgCode:router.history.current.params.orgCode || _orgCode}});
            } else {
              throw 'no_returnUrl'
            }
          } else {
            if (router.history.current.path && router.history.current.path.replace(/\/:orgCode/, '') !== '/blank') {
              router.push({name: 'login', query: {returnUrl: router.history.current.path}, params: {orgCode:router.history.current.params.orgCode || _orgCode}});
            } else {
              throw 'no_returnUrl'
            }
          }
        }
      } catch (e) {
        router.push({name: 'login', params: {orgCode:router.history.current.params.orgCode || _orgCode}});
      }
    } else if (data.code === '400' || data.code === '401' || data.code === '403' || data.code === '404' || data.code === '409' || data.code === '423' ||data.code === '415' || data.code === '500' || data.code === '501' || data.code === '503'|| data.code === '419') {
      // code不等于200时 且 配置中hideMessage 不为 true（代码中未针对code值单独处理）时，显示message信息
      !config.hideMessage && Message.error({
        showClose: true,
        message: data.message || '服务器异常，请稍后重试'
      });
    }

    if(config.hasHeader){
        return {data,header: response.headers };
    }else {
        return data;
    }

  },
  error => {

    loadCount--;

    if (loadingDom && loadCount <= 0) loadingDom.close();

    let {data} = error.response;
    if (typeof data !== 'object') data = {code: -1, message: '服务器异常，请稍后重试'};
    Message.error({
      showClose: true,
      message: data.message
    });

    return Promise.reject(data);
  }
);
