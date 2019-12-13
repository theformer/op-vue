/**
 * 手机号码脱敏
 * @param value 手机号码
 * @returns {void|never|string} 4-7位*号替换手机号
 */
const filter_hidePhone = value => {
  if (value) {
    return value.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
  }
};

/**
 * 启停用状态
 * @param value
 * @returns {*}
 */
const filter_formatState = value => {
  return {false: '停用', true: '启用'}[value];
};

/**
 * 是否有效
 * @param value
 * @returns {*}
 */
const filter_isEffective = value => {
  return {0: '否', 1: '是'}[value];
};

/**
 * 是否显示
 * @param value
 * @returns {*}
 */
const filter_isDispaly = value => {
  return {0: '隐藏', 1: '显示'}[value];
};

/** 还款方式*/
const filter_repayMethod = value => {
  return {0: '先息后本', 'XXHB': '先息后本'}[value];
};

/**实名认证*/
const filter_realName = value => {
  return {1: '是', 0: '否'}[value];
}

/**
 * 身份证号脱敏
 * @param value 身份证号
 * @returns {void|never|string} 显示前三位及7～14位数字，其他数字以“*”代替
 */
const filter_hideIdCardNo = value => {
  if (value) {
    return value.replace(/^(\d{3})\d{3}(\d{8})\d+/, "$1***$2****");
  }
};

/**是否认证*/
const filter_identify = value => {
  return {1: '已认证', 0: '未认证'}[value];
}

/**是否通过*/
const filter_pass = value => {
  return {'PASS': '通过', 'REJECT': '拒绝'}[value];
}

/**计息方式*/
const filter_interest = value => {
  return {1: '按月计息'}[value];
}

/**性别*/
const filter_sex = value => {
  return {1: '男', 2: '女'}[value];
}

/**金额 千分位显示*/
const filter_formatMoney = value => {
  if (value) {
    return value.toString().replace(/\d+/, function (n) { // 先提取整数部分
      return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { // 对整数部分添加分隔符
        return $1 + ',';
      });
    });
  } else {
    return value
  }
}



export {
  filter_hidePhone,
  filter_formatState,
  filter_isEffective,
  filter_isDispaly,
  filter_repayMethod,
  filter_realName,
  filter_hideIdCardNo,
  filter_identify,
  filter_pass,
  filter_interest,
  filter_sex,
  filter_formatMoney
}