import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'
import {$params2query} from '@/lib/methods'

/** ================ 贷后管理 ================ **/

//获取贷后列表
export const getLoanManageList = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.LIST,
    method: 'get',
    params: params
  });
};
export const getLoanApplyDetail = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.DETAIL,
    method: 'get',
    params: params
  });
};

export const getBillPageInfo = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.GETBILLPAGEINFO,
    method: 'get',
    params: params
  });
};
//贷后导出excel
export const exportExcel = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.EXPORTEXCEL,
    method: 'get',
    params: params,
    hasHeader: true,
    responseType: 'blob'
  });
};
export const exportShoudlExcel = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.EXPORTSHOULDEXCEL,
    method: 'get',
    params: params,
    hasHeader: true,
    responseType: 'blob'
  });
};
//贷后退保
export const surrenderLoan = (params) => {
  return httpSingle({
    url: API.LOANMANAGE.SURRENDERLOAN+'?' + $params2query(params),
    method: 'put',
    data: params
  });
};