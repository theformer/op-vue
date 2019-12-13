import {httpSingle} from '@/lib/axios';
import API from '@/constant/API';
import {$params2query} from '@/lib/methods'

/** ================ 渠道管理 ================ **/

//获取渠道管理列表
export const getChannelList = (params) => {
  return httpSingle({
    url: API.CHANNEL.LIST,
    method: 'get',
    params: params
  });
};

//获取渠道详情
export const getChannelDetail = (id) => {
  return httpSingle({
    url: API.CHANNEL.LIST + '/' + id,
    method: 'get',
  });
};

//添加渠道
export const addChannel = (params) => {
  return httpSingle({
    url: API.CHANNEL.LIST,
    method: 'post',
    data: params
  });
};

//修改渠道
export const updateChannel = (params) => {
  return httpSingle({
    url: API.CHANNEL.LIST,
    method: 'put',
    data: params
  });
};

//删除渠道
export const deleteChannel = (params) => {
  return httpSingle({
    url: API.CHANNEL.LIST + '?' + $params2query(params),
    method: 'delete',
    data: params
  });
};

//二维码
export const qrcode = (params) => {
  return httpSingle({
    url: API.CHANNEL.QRCODE,
    method: 'get',
    params: params
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

//添加渠道账号
export const addChannelAccount = (params) => {
  return httpSingle({
    url: API.CHANNEL.ADDCHANNELACCOUNT,
    method: 'post',
    data: params
  });
};

//渠道账号详情
export const getChannelAccount = (params) => {
  return httpSingle({
    url: API.CHANNEL.GETCHANNELACCOUNT,
    method: 'get',
    params: params
  });
};

//修改渠道账号
export const updateChannelAccount = (params) => {
  return httpSingle({
    url: API.CHANNEL.UPDATECHANNELACCOUNT,
    method: 'post',
    data: params
  });
};
//获取风控结果
export const getChannelRiskResult = (params) => {
  return httpSingle({
    url: API.CHANNEL.GETCHANNELRISKRESULT,
    method: 'get',
    params: params
  });
};
//添加账号获取风控结果
export const getQueryRiskResult = (params) => {
  return httpSingle({
    url: API.CHANNEL.GETQUERYRISKRESULT,
    method: 'get',
    params: params
  });
};

//渠道账号管理列表
export const getAccountList = (params) => {
  return httpSingle({
    url: API.CHANNEL.ACCOUNTLIST,
    method: 'get',
    params: params
  });
};
// //渠道账号回显
// export const getAccountDetail = (params) => {
//   return httpSingle({
//     url: API.CHANNEL.ACCOUNTDETAIL,
//     method: 'get',
//     params: params
//   });
// };
//获取账号详情
// export const getAccountDetail = (_id, channelId) => {
//   return httpSingle({
//     url: API.RIGHTS.ACCOUNT.DETAIL,
//     method: 'get',
//     params: {
//       id: _id,
//       channelId
//     }
//   });
// };
//查询登录用户所属的渠道，系统管理员没有所属渠道
export const queryChannel = (params) => {
  return httpSingle({
    url: API.CHANNEL.QUERYCHANNEL,
    method: 'get',
    params: params
  });
};