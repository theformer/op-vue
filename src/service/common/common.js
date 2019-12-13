import {httpSingle} from '../../lib/axios';
import API from '../../constant/API'

/**
 * 获取所有数据字典
 * @returns {*}
 * @constructor
 */
export const R_AllSysEnum = () => {
  return httpSingle({
    url: API.COMMON.ALL_SYS_ENUM,
    method: 'get'
  });
};

/**
 * 根据dicCode 获取数据字典内容
 * @returns {*}
 * @constructor
 */
export const R_SysEnumByDicCode = (dicCode) => {
  return httpSingle({
    url: API.COMMON.SYS_ENUM_BY_DODE,
    method: 'get',
    params: {dicCode: dicCode}
  });
};

export const getRegionEnum = () => {
  return httpSingle({
    url: API.COMMON.AREA_LIST,
    method: 'get'
  });
};

/*
* 上传图片*/
export const upload = () => {
  return httpSingle({
    url: API.COMMON.UPLOAD,
    method: 'post'
  });
};