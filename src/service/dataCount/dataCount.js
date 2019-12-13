import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'

/** ================ 数据统计管理 ================ **/

//获取数据管理列表
export const getDataCountList = (type, params) => {
  return httpSingle({
    url: API.DATACOUNT.LIST + '/' + type,
    method: 'get',
    params: params
  });
};

//导出数据管理列表
export const exportExcel = (type, params) => {
  return httpSingle({
    url: API.DATACOUNT.EXPORTEXCEL + '/' + type,
    method: 'get',
    params: params,
    hasHeader: true,
    responseType: 'blob'
  });
};

/** ================ 数据概览 ================ **/

//获取放款概况
export const getLoanStatistics = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANSTATISTICS,
    method: 'get',
    params: _params
  });
};

//获取放款量占比
export const getLoanCountStatistics = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANCOUNTSTATISTICS,
    method: 'get',
    params: _params
  });
};

//获取放款金额占比
export const getLoanAmtStatistics = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANAMTSTATISTICS,
    method: 'get',
    params: _params
  });
};

//获取所有产品
export const getAllProduct = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.ALLPRODUCT,
    method: 'get',
    params: _params
  });
};

//根据产品id获取关联渠道
export const getChannelByProductId = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.GETRELATIONCHANNEL,
    method: 'get',
    params: _params
  });
};

//根据渠道id获取关联产品
export const getProductByChannelId = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.GETRELATIONPRODUCT,
    method: 'get',
    params: _params
  });
};

//根据时间查看放款概况
/*export const getLoanStatisticsByTime = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANSTATISTICSBYTIME,
    method: 'get',
    params: _params
  });
};*/

// 根据时间查看放款概况
export const getLoanSuccessByTime = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANSUCCESSSTATISTICSBYTIME,
    method: 'get',
    params: _params
  });
};

// 根据时间查看待还概况
export const getLoanPayByTime = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANPAYTATISTICSBYTIME,
    method: 'get',
    params: _params
  });
};

// 根据时间查看还款概况
export const getLoanPaidByTime = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.LOANPAIDTATISTICSBYTIME,
    method: 'get',
    params: _params
  });
};

// 放款概况excel
export const exportLoanSuccess = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.EXPORTLOANSUCCESS,
    method: 'get',
    params: _params,
    hasHeader: true,
    responseType: 'blob'
  });
};

// 待还概况excel
export const exportLoanPay = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.EXPORTLOANPAY,
    method: 'get',
    params: _params,
    hasHeader: true,
    responseType: 'blob'
  });
};

// 还款概况excel
export const exportLoanPaid = (_params) => {
  return httpSingle({
    url: API.DATACOUNT.DATAOVERVIEW.EXPORTLOANPAID,
    method: 'get',
    params: _params,
    hasHeader: true,
    responseType: 'blob'
  });
};