import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'

/** ================ 客户管理 ================ **/

//获取客户管理列表
export const getCustomerList = (params) => {
  return httpSingle({
    url: API.CUSTOMER.LIST,
    method: 'get',
    params: params
  });
};

//导出excel
export const exportExcel = (params) => {
  return httpSingle({
    url: API.CUSTOMER.EXPORTEXCEL,
    method: 'get',
    params: params,
    hasHeader: true,
    responseType: 'blob'
  });
};

//客户详情-基本信息
export const basicInfo = (_id) => {
  return httpSingle({
    url: API.CUSTOMER.BASICINFO,
    method: 'get',
    params: {
      id: _id
    }
  });
};

//客户详情-借款记录
export const loanList = (params) => {
  return httpSingle({
    url: API.CUSTOMER.LOANLIST,
    method: 'get',
    params: params
  });
};