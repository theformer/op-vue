import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'
import {$params2query} from '@/lib/methods'

/**
 * 查询菜单
 * @returns {*}
 * @constructor
 */
export const R_AsideMenus = () => {
  return httpSingle({
    url: API.ACCOUNT.MENUS,
    method: 'get'
  });
};

/**
 * 判断用户是否拥有此菜单权限
 * @returns {*}
 * @constructor
 */
export const R_CheckMenu = (_route) => {
  return httpSingle({
    url: API.ACCOUNT.CHECKMENU,
    method: 'get',
    params: {
      route: _route
    }
  });
};

// 登录
export const login = (params) => {
  return httpSingle({
    url: API.ACCOUNT.LOGIN,
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: $params2query(params)
  });
};

// 快速登录
export const fastLogin = (params) => {
  return httpSingle({
    url: API.ACCOUNT.FASTLOGIN,
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: $params2query(params)
  });
};

// 注册
export const register = (params) => {
  return httpSingle({
    url: API.ACCOUNT.REGISTER,
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: $params2query(params)
  });
};

// 退出
export const logout = (_tenantNo) => {
  return httpSingle({
    url: API.ACCOUNT.LOGOUT + '?tenantNo=' + _tenantNo,
    method: 'post'
  });
};

// 发送验证码
export const sendCode = (params) => {
  return httpSingle({
    url: API.ACCOUNT.SENDCODE,
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: $params2query(params)
  });
};

// 重置密码
export const resetPwd = (params) => {
  return httpSingle({
    url: API.ACCOUNT.RESETPWD,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'put',
    data: $params2query(params)
  });
};

// 判断机构状态
export const checkTenantStatus = (params) => {
  return httpSingle({
    url: API.ACCOUNT.TENANTSTATUS,
    method: 'get',
    hideMessage: true,
    params: params
  });
};

//校验token是否失效
export const checkToken = (params) => {
  return httpSingle({
    url: API.ACCOUNT.CHECKTOKEN,
    method: 'post',
    hideMessage: true,
    params: params
  });
};