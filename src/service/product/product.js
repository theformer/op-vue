import {httpSingle} from '@/lib/axios';
import API from '@/constant/API'
import {$params2query} from '@/lib/methods'

/** ================ 产品列表 ================ **/
//产品列表List
export const getProductList = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.LIST,
    method: 'get',
    params: params
  });
};
//新增产品列表
export const productAdd = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.ADDPRODUCT,
    method: 'post',
    data: params
  })
};
//获取产品编辑
export const productEdit = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.UPDATEPRODUCT,
    method: 'post',
    data: params
  })
};
//产品状态切换
export const getStatusSwitch = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.SWITCH + '?' + $params2query(params),
    method: 'put',
  });
};
//获取认证模型列表
export const getModel = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.LIST,
    method: 'get',
    params: params
  });
};
export const fundList = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.FUNDLIST,
    method: 'get',
    params: params
  });
};
//查看产品详情
export const productDetatl = (params) => {
  return httpSingle({
    url: API.PRODUCT.PRODUCT.DETAIL,
    method: 'get',
    params: params
  });
};
//修改产品
export const updateProduct = (params) => {
  return httpSingle({
    url: API.RIGHTS.PRODUCT.UPDATEPRODUCT,
    method: 'post',
    data: params
  });
};

/** ================ 申请表管理 ================ **/

//获取申请表列表
export const getApplicationList = (_params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.LIST,
    method: 'get',
    params: _params
  });
};

//添加申请表
export const addApplication = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.ADDAPPLICATION,
    method: 'post',
    data: params
  });
};

//修改申请表
export const updateApplication = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.UPDATEAPPLICATION,
    method: 'put',
    data: params
  });
};

//获取已关联的字段信息列表
export const getLoanApplyModelField = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.GETLOANAPPLYMODELFIELD,
    method: 'get',
    params: params
  });
};

//获取字段列表
export const getFieldList = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.FIELDLIST,
    method: 'get',
    params: params
  });
};

//停用启用申请表
export const enableApplication = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.ENABLE + '?' + $params2query(params),
    method: 'put'
  });
};

//复制申请表
export const copyApplication = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.COPYAPPLICATION + '?' + $params2query(params),
    method: 'put'
  });
};

/** ================ 认证模型管理 ================ **/

//获取认证模型列表
export const getIdentifyManageList = (_params) => {
  return httpSingle({
    url: API.PRODUCT.IDENTIFYMANAGE.LIST,
    method: 'get',
    params: _params
  });
};

//获取认证模型详情
export const getIdentifyModelDetail = (id) => {
  return httpSingle({
    url: API.PRODUCT.IDENTIFYMANAGE.LIST + '/' + id,
    method: 'get'
  });
};

//添加认证模型
export const addIdentifyModel = (params) => {
  return httpSingle({
    url: API.PRODUCT.IDENTIFYMANAGE.LIST,
    method: 'post',
    data: params
  });
};

//修改认证模型
export const updateIdentifyModel = (params) => {
  return httpSingle({
    url: API.PRODUCT.IDENTIFYMANAGE.LIST,
    method: 'put',
    data: params
  });
};

//获取所有认证项
export const getAllAuthItem = () => {
  return httpSingle({
    url: API.PRODUCT.IDENTIFYMANAGE.AUTHITEM,
    method: 'get'
  });
};
/** ================ 备案库 ================ **/
//添加用户公司信息
export const addUserRecordLibrary = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.USER.ADDRECORDLIBRARY,
    method: 'post',
    data: params
  });
};
//获取用户公司信息
export const getAllUserList = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.USER.LIST,
    method: 'get',
    params: params,
  });
};
//查询用户公司信息列表
export const searchUserList = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.USER.SEARCHRECORDPAGE,
    method: 'get',
    params: params,
  });
};
//删除用户公司信息
export const deleteUserRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.USER.DELETERECORD + `/${params}`,
    method: 'put',
  });
};
//修改用户公司信息
export const updateUserRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.USER.UPDATERECORD,
    method: 'put',
    data: params
  });
};
//添加用户公司信息
export const addInsuranceRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.INSURANCE.ADDRECORDLIBRARY,
    method: 'post',
    data: params
  });
};
//获取用户公司信息
export const getInsuranceList = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.INSURANCE.LIST,
    method: 'get',
    params: params
  });
}
//查询用户公司信息列表
export const getInsuranceRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.INSURANCE.SEARCHRECORDPAGE,
    method: 'get',
    params: params
  });
}
//删除用户公司信息
export const delectInsuranceRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.INSURANCE.DELETERECORD + `/${params}`,
    method: 'put',
  });
};
//修改用户公司信息
export const updateInsuranceRecord = (params) => {
  return httpSingle({
    url: API.PRODUCT.RECORDLIBRARY.INSURANCE.UPDATERECORD,
    method: 'put',
    data: params
  });
};

/** ================ 申请表类目管理 ================ **/
//获取申请表类目信息列表
export const getLoanApplyCategory= (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATIONCATEGORY.LIST,
    method: 'get',
    params
  });
};

//新增申请表类目
export const addCategory= (data) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATIONCATEGORY.ADDCATEGORY,
    method: 'post',
    data
  });
};

//修改申请表类目
export const updateCategory= (data) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATIONCATEGORY.UPDATECATEGORY,
    method: 'put',
    data
  });
};

//修改申请表类目顺序
export const updateCategorySort= (data) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATIONCATEGORY.UPDATECATEGORYSORT,
    method: 'post',
    data
  });
};

//修改申请表类目状态
export const enableCategory= (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATIONCATEGORY.ENABLECATEGORY,
    method: 'put',
    params
  });
};

//获取已关联的字段信息列表
export const getApplyPreviewField = (params) => {
  return httpSingle({
    url: API.PRODUCT.APPLICATION.PREVIEWFIELD,
    method: 'get',
    params: params
  });
};
