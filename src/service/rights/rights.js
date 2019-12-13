import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'

/** ================ 角色管理 ================ **/

//获取角色管理列表
export const getRoleList = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.LIST,
    method: 'get',
    params: params
  });
};

//获取角色详情
export const getRoleDetail = (code) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.DETAIL + code,
    method: 'get'
  });
};

//添加角色
export const addRole = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.LIST,
    method: 'post',
    data: params
  });
};

//修改角色
export const updateRole = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.DETAIL + params.id,
    method: 'put',
    data: params
  });
};


//获取菜单
export const getMenuData = () => {
  return httpSingle({
    url: API.RIGHTS.ROLE.MENUDATA,
    method: 'get'
  });
};

//删除角色
export const deleteRole = (id) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.DETAIL + id,
    method: 'delete'
  });
};

/** ================ 账号管理 ================ **/
//获取账号管理列表
export const getAccountList = (params) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.LIST,
    method: 'get',
    params: params
  });
};

//查询账号是否存在
export const querySysAccount = (_phone) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.QUERYSYSACCOUNT,
    method: 'get',
    params: {
      phone: _phone
    }
  });
};

//获取账号详情
export const getAccountDetail = (_id, channelId,accountType) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.DETAIL,
    method: 'get',
    params: {
      accountId: _id,
      channelId,
      accountType
    }
  });
};

//添加账号
export const addAccount = (params) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.LIST,
    method: 'put',
    data: params
  });
};

//修改账号
export const updateAccount = (params) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.LIST,
    method: 'post',
    data: params
  });
};

//删除账号
export const deleteAccount = (_id) => {
  return httpSingle({
    url: API.RIGHTS.ACCOUNT.LIST,
    method: 'delete',
    params: {
      id: _id
    }
  });
};