import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'

/** ================ 角色管理 ================ **/

//获取角色管理列表
export const getRoleList = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.LIST,
    method: 'get',
    data: params
  });
};

//获取角色详情
export const getRoleDetail = (id) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.DETAIL,
    method: 'get',
    params: {
      roleId: id
    }
  });
};

//添加角色
export const addRole = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.ADDROLE,
    method: 'post',
    data:params
  });
};

//修改角色
export const updateRole = (params) => {
  return httpSingle({
    url: API.RIGHTS.ROLE.UPDATEROLE,
    method: 'post',
    data:params
  });
};


//获取菜单
export const getMenuData = () => {
  return httpSingle({
    url: API.RIGHTS.ROLE.MENUDATA,
    method: 'get'
  });
};

/** ================ 账号管理 ================ **/


/** ================ 机构管理 ================ **/
//二维码
export const qrcode = () => {
  return httpSingle({
    url: API.CHANNEL.QRCODE,
    method: 'get'
  });
};

//下载二维码
export const downloadQrcode = (params) => {
  return httpSingle({
    url: API.CHANNEL.DOWNLOADQRCODE,
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  });
};