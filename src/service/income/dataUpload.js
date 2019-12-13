import { httpSingle } from "../../lib/axios";
import API from '@/constant/API';

//获取数据上传列表
export const getDataUploadList = (params) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.UPLOADLIST,
    method: 'get',
    params: params
  });
};

//上传zip
export const uploadFile = (params) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.UPLOADFILE,
    method: 'post',
    data: params
  });
};

//导入数据
export const importData = (uploadNumber) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.IMPORTDATA + '/' + uploadNumber,
    method: 'put'
  });
};

//删除记录
export const deleteData = (uploadNumber) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.IMPORTDATA + '/' + uploadNumber,
    method: 'delete'
  });
};

//查看详情(数据上传详情)，复用进件列表接口
export const getDataList = (params) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.DATALIST,
    method: 'get',
    params: params
  });
};

//删除单条数据
export const deleteSingleData = (id) => {
  return httpSingle({
    url: API.INCOME.DATAUPLOAD.DELETEDATA + '/' + id,
    method: 'delete'
  });
};
