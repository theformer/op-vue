import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'

/** ================ 进件列表 ================ **/

//获取进件列表
export const getIncomeList = (params) => {
  return httpSingle({
    url: API.INCOME.LIST,
    method: 'get',
    params: params
  });
};

//获取所有渠道
export const getAllChannel = (params) => {
  return httpSingle({
    url: API.INCOME.ALLCHANNEL,
    method: 'get',
    params: params
  });
};

//获取业务员
export const getSalesManList = (params) => {
  return httpSingle({
    url: API.INCOME.SALESMANLIST,
    method: 'get',
    params: params
  });
};

//获取进件详情
export const getDetail = (_id) => {
  return httpSingle({
    url: API.INCOME.DETAIL,
    method: 'get',
    params: {
      orderId: _id
    }
  });
};

//获取进件详情
export const getPersonalInfo = (_id) => {
  return httpSingle({
    url: API.INCOME.PERSONALINFO,
    method: 'get',
    params: {
      id: _id
    }
  });
};

//获取备案库自动填充数据
export const getRecordLibraryAutoFillData = (params) => {
  return httpSingle({
    url:  API.INCOME.getRecordLibraryAutoFillData,
    method: 'get',
    params: params
  });
};

//退回
export const returnBack = (params) => {
  return httpSingle({
    url:  API.INCOME.RETURNBACK,
    method: 'post',
    data: params
  });
};

//退回
export const reject = (params) => {
  return httpSingle({
    url:  API.INCOME.REJECT,
    method: 'post',
    data: params
  });
};

//提交
export const submit = (orderNo, fee, params) => {
  return httpSingle({
    url: API.INCOME.SUBMITORDER +`?orderNo=${orderNo}&fee=${fee}`,
    method: 'post',
    data: params
  });
};

//修改费率
export const updateLoanFee = (params) => {
  return httpSingle({
    url: API.INCOME.UPDATELOANFEE,
    method: 'post',
    params: params
  });
};

//获取团单列表
export const getGroupOrderList = (params) => {
  return httpSingle({
    url: API.INCOME.GROUPLIST,
    method: 'get',
    params: params
  });
};

//上传保单
export const uploadPolicy = (params) => {
  return httpSingle({
    url: API.INCOME.UPLOADPOLICY,
    method: 'post',
    params: params
  });
};

//单笔订单转移
export const singleOrderTransfer = (data) => {
  return httpSingle({
    url: API.INCOME.SINGLEORDERTRANSFER,
    method: 'post',
    data: data
  });
};

//订单批量转移
export const batchOrderTransfer = (data) => {
  return httpSingle({
    url: API.INCOME.BATCHORDERTRANSFER,
    method: 'post',
    data: data
  });
};