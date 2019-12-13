import {R_SysEnumByDicCode} from "../service/common/common";
import store from '../store/store'

const $setLocalStorage = function (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
const $getLocalStorage = function (key) {
  return JSON.parse(window.localStorage.getItem(key) || null);
};
const $removeLocalStorage = function (key) {
  window.localStorage.removeItem(key);
};
const $clearLocalStorage = function () {
  window.localStorage.clear();
};

/**
 * 浮点数乘法
 * @param {Number} num 乘数(浮点数)
 * @param {Number} multiplier 被乘数
 * @returns {Number}
 */
const $floatMultiply = function (num, multiplier) {
  const splits = String(num).split(".");
  const integer = Number(splits.join(""));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return (integer * multiplier) / scale;
};

/**
 * 浮点数除法
 * @param {Number} num 除数(浮点数)
 * @param {Number} divider 被除数
 * @returns {Number}
 */
const $floatDivide = function (num, divider) {
  const splits = String(num).split(".");
  const integer = Number(splits.join(""));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return integer / (scale * divider);
};
/**
 * 浮点数转换为百分比
 * @param {Number} val
 * @returns {String} 包含%的百分比，且保留两位小数
 */
const RegInt = /^[1-9]\d*$/;
const $floatToPercentage = function (val, num) {
  if (num) {
    return $floatToFixed($floatMultiply(Number(val), 100), num);
  } else {
    return $floatToFixed($floatMultiply(Number(val), 100)) + "%";
  }
};

/**
 * 保留两位小数
 */
const $floatToFixed = function (val, num) {
  const pointPosition = String(val).indexOf(".") + 1; //找出小数点的位置
  const decimalNum = String(val).length - pointPosition; //小数的位数
  if (RegInt.test(Number(val)) || decimalNum == 1 || decimalNum == 2) {
    return val;
  } else {
    if (num) {
      return Math.round(Number(val) * 1000) / 1000;
    } else {
      return Math.round(Number(val) * 100) / 100;
    }
  }
};

/**
 * 深拷贝
 * @param {Object | Array} obj
 * @returns {Object | Array}
 */
const $deepcopy = function (obj) {
  if (!(typeof obj == "object")) {
    return;
  }
  for (var key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] === null || obj[key] === undefined || obj[key] === "" || obj[key] === 'null' || obj[key] === 'NULL' || obj[key] === 'undefined')
    ) {
      delete obj[key];
    }
  }
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 获取指定DicCode数据字典
 * @param dicCode 字典code
 * @returns {*}
 */
const $getSysEnumByDicCode = function (dicCode) {

  return new Promise(resolve => {

    let enums = store.state.enums || {};

    if (enums[dicCode]) {
      resolve(enums[dicCode]);
    } else {
      R_SysEnumByDicCode(dicCode).then(res => {
        let data = [];
        if (res.code === '200') {
          res.body.forEach(item => {
            data.push({text: item.itemName, value: item.itemValue});
          });
          enums[dicCode] = data;
          store.commit("saveSysEnum", enums);
          resolve(enums[dicCode]);
        } else {
          resolve([]);
        }

      }).catch(() => {
        resolve([]);
      })
    }

  })

};

/**
 * 过滤数据字典
 * @param 获取值 字典值
 * @returns {String}
 */

const $filterSysEnumByDicCode = function (value, group) {
  if (
    Object.prototype.toString.call(value) != "[object Null]" &&
    Object.prototype.toString.call(value) != "[object Undefined]"
  ) {
    value = value.toString();
  }
  if (
    Object.prototype.toString.call(value) == "[object Null]" ||
    Object.prototype.toString.call(value) == "[object Undefined]" ||
    value.length == 0
  ) {
    return "-";
  }
  let res = [];
  if (group) {
    const key = `${group}`;
    res =
      this.$store.state.enums[key] &&
      this.$store.state.enums[key].filter(_ => _.value === value);
  } else {
    for (const key in this.$store.state.enums) {
      this.$store.state.enums[key].forEach(item => {
        if (item.value === value) {
          res = res.concat(this.$store.state.enums[key]);
        }
      });
    }
    res = res.filter(_ => _.value === value);
  }
  return res && res[0] ? res[0].text : value;
};


window.URL = window.URL || window.webkitURL || window.mozURL;

/**
 * 创建文件blob地址
 * @param {Blob} file
 * @returns {String}
 */
const $createObjectURL = function(file) {
    var binaryData = [];
    binaryData.push(file);
    return window.URL.createObjectURL(new Blob(binaryData, {type: "application/x-msdownload"}))

};
/**
 * 回收blob地址
 * @param {String} url
 */
const $revokeObjectURL = function(url) {
  window.URL.revokeObjectURL(url);
};
/**
 * 下载Excel文件
 * @param {} data
 * @param {} data
 * 直接下载文件
 */
const $downloadExcel = function(data, filename) {
  if ("msSaveOrOpenBlob" in navigator) {
    // Microsoft Edge and Microsoft Internet Explorer 10-11
    window.navigator.msSaveOrOpenBlob(data, filename);
  } else {
    // standard code for Google Chrome, Mozilla Firefox etc
    const url = $createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = decodeURI(filename);
    document.body.appendChild(anchor);
    anchor.click();
    $revokeObjectURL(url);
  }
};

const $params2query = function (params) {
  let queryarr = [];
  Object.keys(params).forEach(i => {
    let item = typeof params[i] === 'object' ? JSON.stringify(params[i]) : params[i]
    params[i] != undefined && queryarr.push(`${i}=${encodeURIComponent(item)}`
    )
  });
  return queryarr.join('&')
};

const $hasButton = function(button) {
  let buttons = store.state.buttons;
  return buttons.includes(button);
}

export {
  $floatMultiply,
  $floatDivide,
  $floatToPercentage,
  $setLocalStorage,
  $getLocalStorage,
  $removeLocalStorage,
  $clearLocalStorage,
  $deepcopy,
  $getSysEnumByDicCode,
  $filterSysEnumByDicCode,
  $createObjectURL,
  $revokeObjectURL,
  $downloadExcel,
  $params2query,
  $floatToFixed,
  $hasButton
};
