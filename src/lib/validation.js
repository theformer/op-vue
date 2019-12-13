// 银行卡
const card = /^\d{8,28}$/;
// 身份证号
// const ident = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
// 手机号码
const mobile = /^((13[0-9])|(14[5-9])|(15[0-3,5-9])|(17[0-9])|(18[0-9])|19[8,9])\d{8}$/;
// 手机号码
const phone = /^1\d{10}$/;
// 手机验证码
const code = /^\d{4}$/;
// 密码
const password = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()+=|{}':;',[\\\].<>/?]+)$)^[\w~!@#$%^&*()+=|{}':;',[\\\].<>/?]{6,20}$/;
// 组织机构代码
const orgNo = /^[A-Za-z0-9]{8}-\d$/;
// 公积金账号
const pfAccount = /^\d{9,20}$/;
// 邮编
const postCode = /^\d{6}$/;
// 注册号
const regNo = /^\d{15}$/;
// 电话号码
const telephone = /^0\d{2,3}-\d{7,8}(-\d{1,4})?$/;
// 手机或电话
const telOrMobile = new RegExp(
  `^(${telephone.toString().slice(2, -2)})|(${mobile.toString().slice(2, -2)})$`
);
// 社会信用代码
const usciCode = /^[A-Za-z0-9]{18}$/;

//小数点后保留两位小数
const inviteTwoRule = /^(0([.]([1-9]\d?|0[1-9])|$)|[1-9]\d{0,3}([.]\d{1,2}|$))$/;

/**
 * 校验浮点数精度
 * @param {Number} num
 * @param {Number} precise
 */
const floatValidator = function(num, precise) {
  if (typeof num !== "number") return false;
  const splits = String(num).split(".");
  return !splits[1] || splits[1].length <= precise;
};

//正整数
const RegInt = /^[1-9]\d*$/;

//正数
const integer = /^\d+(\.\d{1,2})?$/;

//校验只允许输入带小数点的正负数
const floatTwo = /^-?\d+(\.\d{0,2})?$/;

// 身份证号 18位
// const ident18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

//身份证号 15 或 18 位
const ident = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

//身份证号15位
// const ident15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;

//限制输入框中字符个数和限制汉字、字母和数字
const inviteReg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
const inviteCodeRule = (rule, value, callback, num, minNum = 2) => {
  if (value) {
    let valueLength = 0;
    for (var i = 0; i < value.length; i++) {
      let re = /[^\u4e00-\u9fa5]/;
      let temp = value.substring(i, i + 1);
      if (re.test(temp)) {
        valueLength = valueLength + 1;
      } else {
        valueLength = valueLength + 2;
      }
    }
    if(valueLength < minNum) {
      callback("最少" + minNum + "个字符");
    } else if (valueLength > num) {
      callback("最多" + num + "个字符");
    } else if (!inviteReg.test(value)) {
      callback("请输入字母，数字或汉字");
    } else {
      callback();
    }
  } else {
    callback();
  }
};

//利率限制，限制输入数字不可以超过100，不可以为负数，小数点不可以超过2位
const rateRule = (rule, value, callback, name) => {
  if (value) {
    if (isNaN(value) || value < 0 || value >= 100) {
      callback('请正确输入' + name);
    } else if (!floatValidator(parseFloat(value),2)) {
      callback('保留小数点后2位')
    } else {
      callback();
    }
  } else {
    callback();
  }
};

//限制输入框中字符个数
const inviteCodeStrRule = (rule, value, callback, num, errorMsg, minNum= 2) => {
  if (value) {
    let valueLength = 0;
    for (var i = 0; i < value.length; i++) {
      let re = /[^\u4e00-\u9fa5]/;
      let temp = value.substring(i, i + 1);
      if (re.test(temp)) {
        valueLength = valueLength + 1;
      } else {
        valueLength = valueLength + 2;
      }
    }
    if (valueLength > num) {
      callback(errorMsg ? errorMsg : "最多" + num + "个字符");
    } else if (valueLength < minNum) {
      callback("最少" + minNum + "个字符");
    } else {
      callback();
    }
  } else {
    callback();
  }
};
export default {
  card,
  ident,
  mobile,
  phone,
  code,
  password,
  orgNo,
  pfAccount,
  postCode,
  regNo,
  telephone,
  telOrMobile,
  usciCode,
  floatValidator,
  RegInt,
  integer,
  inviteCodeRule,
  floatTwo,
  rateRule,
  inviteTwoRule,
  inviteCodeStrRule
};
