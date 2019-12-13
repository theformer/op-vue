const SERVER = {
  // 服务端公共模块，swagger对应地址：http://10.200.133.151:9040/swagger-ui.html
  BASIC: '/System/',
  // 服务端用户模块，swagger对应地址：http://10.200.133.147:9050/swagger-ui.html
  User: '/User/',
  UserWeb: '/UserWeb/',
  // 服务端风控模块, swagger对应地址：http://10.200.133.150:9030/swagger-ui.html
  RiskControl: '/RiskControl/',
  // 服务端订单模块, swagger对应地址：http://10.200.133.148:9020/swagger-ui.html
  LOAN: '/Loan/',
  LoanWeb: '/LoanWeb/',
  // 服务端订单模块, swagger对应地址：http://10.200.133.149:9060/swagger-ui.html
  REPORT: '/Report/'
};

export default {
  COMMON: {
    // 所有数据字典
    ALL_SYS_ENUM: SERVER.BASIC + 'sys_dict/all',
    // 根据type获取对应字典
    SYS_ENUM_BY_TYPE: SERVER.BASIC + 'sys_dict',
    //上传图片
    UPLOAD: SERVER.BASIC + 'fileInfo',
  },
  ACCOUNT: {
    // 账号登录退出
    LOGIN: SERVER.UserWeb + 'account/user/login',
    FASTLOGIN: SERVER.UserWeb + 'account/user/fastLoginOss',
    REGISTER: SERVER.UserWeb + 'account/user/register',
    LOGOUT: SERVER.UserWeb + 'account/user/logout',
    SENDCODE: SERVER.UserWeb + 'account/user/send_code',
    RESETPWD: SERVER.UserWeb + 'account/user/reset/password/login_password',
    CHECKMENU: SERVER.User + 'authority/menu/check',
    MENUS: SERVER.User + 'authority/menu/findMenus',
    TENANTSTATUS: SERVER.LoanWeb + 'tenant/tenant-status',
    CHECKTOKEN: SERVER.UserWeb + 'account/user/checkToken',
  },
  ORGANIZATION: {
    // 机构管理
  },
  RIGHTS: {
    // 角色管理
    ROLE: {
      LIST: SERVER.User + 'authority/role',
      DETAIL: SERVER.User + 'authority/role/',
      MENUDATA: SERVER.User + 'authority/menu'
    },
    ACCOUNT: {
      // 账号管理
      LIST: SERVER.User + 'sys_business_account',
      QUERYSYSACCOUNT: SERVER.UserWeb + 'account/user/query_sysAccount',
      DETAIL: SERVER.User + 'sys_business_account/queryOne',
    }
  },
  CUSTOMER: {
    // 客户管理
    LIST: SERVER.User + 'sys_business_customer/query_pager',
    EXPORTEXCEL: SERVER.User + 'sys_business_customer/export_excel',
    BASICINFO: SERVER.User + 'sys_business_customer/query_one',
    LOANLIST: SERVER.LOAN + 'loanApply/getLoanApplyById'
  },
  CHANNEL: {
    // 渠道管理
    LIST: SERVER.User + 'channel',
    CHANNELACCOUNT: SERVER.User + 'channel/account',
    QRCODE: SERVER.User + 'channel/qrcode',
    DOWNLOADQRCODE: SERVER.User + 'channel/qrcode/image',
    ADDCHANNELACCOUNT: SERVER.User + 'sys_business_account/createSysAccountForSalesman',
    UPDATECHANNELACCOUNT: SERVER.User + 'sys_business_account/updateSysAccountForSalesman',
    GETCHANNELACCOUNT: SERVER.User + 'sys_business_account/queryOne',
    GETCHANNELRISKRESULT:SERVER.User+'sys_business_account/acquireRiskResult',
    GETQUERYRISKRESULT:SERVER.User+'sys_business_account/queryRiskResult',
    // 渠道账号管理
    ACCOUNTLIST:SERVER.User+'sys_business_account/query_channel_account',
    ACCOUNTDETAIL:SERVER.User+'sys_business_account/queryOne',
    QUERYCHANNEL:SERVER.User+'sys_business_account/queryChannel'
  },
  PRODUCT: {
    // 产品管理
    PRODUCT: {
      LIST: SERVER.LOAN + 'product/product-list',
      DETAIL: SERVER.LOAN + 'product/product-detail',
      ADDPRODUCT: SERVER.LOAN + 'product/product-add',
      UPDATEPRODUCT: SERVER.LOAN + 'product/product-edit',
      SWITCH: SERVER.LOAN + 'product/product-status-switch',
      MODEL: SERVER.LOAN + 'auth/model',
      FUNDLIST: SERVER.LOAN + 'product/fund-list'

    },
    // 申请表管理
    APPLICATION: {
      LIST: SERVER.LOAN + 'loanApplyModel/getLoanApplyModelPage',
      ADDAPPLICATION: SERVER.LOAN + 'loanApplyModel/addLoanApplyModel',
      UPDATEAPPLICATION: SERVER.LOAN + 'loanApplyModel/updateLoanApplyModel',
      GETLOANAPPLYMODELFIELD: SERVER.LOAN + 'loanApplyModel/getLoanApplyModelField',
      FIELDLIST: SERVER.LOAN + 'loanApplyModel/getAllApplyFieldForLoanApply',
      ENABLE: SERVER.LOAN + 'loanApplyModel/updateDisableOrEnable',
      COPYAPPLICATION: SERVER.LOAN + 'loanApplyModel/copyLoanApplyModel',
      PREVIEWFIELD: SERVER.LOAN + 'loanApplyModel/previewLoanApplyModel',
    },
    // 认证模型管理
    IDENTIFYMANAGE: {
      LIST: SERVER.RiskControl + 'auth/model',
      AUTHITEM: SERVER.RiskControl + 'auth/item'
    },
    RECORDLIBRARY: {
      USER: {
        LIST: SERVER.LOAN + 'loanUserCompanyRecord/getLoanUserCompanyRecordById',
        ADDRECORDLIBRARY: SERVER.LOAN + 'loanUserCompanyRecord/addLoanUserCompanyRecord',
        DELETERECORD: SERVER.LOAN + 'loanUserCompanyRecord/deleteLoanUserCompanyRecordById',
        SEARCHRECORDPAGE: SERVER.LOAN + 'loanUserCompanyRecord/getLoanUserCompanyRecordPage',
        UPDATERECORD: SERVER.LOAN + 'loanUserCompanyRecord/updateLoanUserCompanyRecord'
      },
      INSURANCE: {
        LIST: SERVER.LOAN + 'loanInsuranceCompanyRecord/getLoanInsuranceCompanyRecordById',
        ADDRECORDLIBRARY: SERVER.LOAN + 'loanInsuranceCompanyRecord/addLoanInsuranceCompanyRecord',
        DELETERECORD: SERVER.LOAN + 'loanInsuranceCompanyRecord/deleteLoanInsuranceCompanyRecordById',
        SEARCHRECORDPAGE: SERVER.LOAN + 'loanInsuranceCompanyRecord/getLoanInsuranceCompanyRecordPage',
        UPDATERECORD: SERVER.LOAN + 'loanInsuranceCompanyRecord/updateLoanInsuranceCompanyRecord'
      }
    },
    // 申请表类目管理
    APPLICATIONCATEGORY: {
      LIST: SERVER.LOAN + 'loanApplyCategory/getLoanApplyCategoryByApplyModelId',
      ADDCATEGORY: SERVER.LOAN + 'loanApplyCategory/addLoanApplyCategory',
      UPDATECATEGORY: SERVER.LOAN + 'loanApplyCategory/updateLoanApplyCategory',
      UPDATECATEGORYSORT: SERVER.LOAN + 'loanApplyCategory/sequenceOperationLoanApplyCategory',
      ENABLECATEGORY: SERVER.LOAN + 'loanApplyCategory/updateDisableOrEnable',
    }
  },
  INCOME: {
    // 进件管理
    LIST: SERVER.LOAN + 'loanApply/getLoanApplyPage',
    ALLCHANNEL: SERVER.User + 'channel/all',
    DETAIL: SERVER.LOAN + 'loanApply/getLoanApplyInfoById',
    PERSONALINFO: SERVER.User + 'sys_business_customer/query_one_by_order',
    SALESMANLIST: SERVER.User + 'sys_business_account/getSalesmanByChannelCode',
    UPDATELOANFEE: SERVER.LOAN + 'loanApply/updateLoanFee',
    getRecordLibraryAutoFillData: SERVER.LoanWeb + 'web/front/h5/getRecordLibraryAutoFillData',
    SUBMITORDER: SERVER.LOAN + 'loanApply/updateLoanApplyInfo',
    RETURNBACK: SERVER.LOAN + 'loanApply/returnBackForLoanApply',
    REJECT: SERVER.LOAN + 'loanApply/rejectForLoanApply',
    GROUPLIST: SERVER.LOAN + 'loanApply/getLoanApplyPageForSubOrder',
    IMPORTGROUP: SERVER.LOAN + 'loanApply/importLoanGroupOrderExcel',
    SINGLEORDERTRANSFER: SERVER.LOAN + 'loanApply/order/singleOrderTransfer',
    BATCHORDERTRANSFER: SERVER.LOAN + 'loanApply/order/batchOrderTransfer',
    UPLOADPOLICY: SERVER.LOAN + 'loanApply/policyUpload',
    DATAUPLOAD: {
      UPLOADFILE: SERVER.LOAN + 'loanApply/importData/upload',
      UPLOADLIST: SERVER.LOAN + 'loanApply/importData/queryPager',
      IMPORTDATA: SERVER.LOAN + 'loanApply/importData',
      DATALIST: SERVER.LOAN + 'loanApply/importData/getLoanApplyPage',
      DELETEDATA: SERVER.LOAN + 'loanApply/importData/deleteLoanApply'
    }
  },
  DATACOUNT: {
    // 数据统计管理
    LIST: SERVER.REPORT + 'user_action/queryPager',
    EXPORTEXCEL: SERVER.REPORT + 'user_action/excel',
    // 数据概览
    DATAOVERVIEW: {
      LOANSTATISTICS: SERVER.REPORT + 'loan_statistics/getLoanStatistics',
      LOANCOUNTSTATISTICS: SERVER.REPORT + 'loan_statistics/getLoanCountStatistics',
      LOANAMTSTATISTICS: SERVER.REPORT + 'loan_statistics/getLoanAmtStatistics',
      ALLPRODUCT: SERVER.LOAN + 'product/product-list_noPage',
      GETRELATIONCHANNEL: SERVER.User + 'channel/queryChannelListByProductCode',
      GETRELATIONPRODUCT: SERVER.User + 'channel/queryProductListByChannelCode',
      //LOANSTATISTICSBYTIME: SERVER.REPORT + 'loan_statistics/getLoanStatisticsByTime',
      LOANSUCCESSSTATISTICSBYTIME: SERVER.REPORT + 'loan_statistics/getLoanSuccessStatisticsByTime',
      LOANPAYTATISTICSBYTIME: SERVER.REPORT + 'loan_statistics/getLoanPayStatisticsByTime',
      LOANPAIDTATISTICSBYTIME: SERVER.REPORT + 'loan_statistics/getLoanPaidStatisticsByTime',
      EXPORTLOANSUCCESS: SERVER.REPORT + 'loan_statistics/excel/loan_success',
      EXPORTLOANPAY: SERVER.REPORT + 'loan_statistics/excel/loan_pay',
      EXPORTLOANPAID: SERVER.REPORT + 'loan_statistics/excel/loan_paid',
    }
  },
  LOANMANAGE:{
    //贷后管理
    LIST:SERVER.LOAN + 'loanApply/getLoanSuccessApplyPage',
    DETAIL:SERVER.LOAN + 'loanApply/getLoanApplyInfoAndBillById',
    GETBILLPAGEINFO:SERVER.LOAN+'loan_bill/getBillPageInfo',
    EXPORTEXCEL: SERVER.LOAN + 'loanApply/getLoanSuccessExcel',
    EXPORTSHOULDEXCEL:SERVER.LOAN + 'loan_bill/excel',
    SURRENDERLOAN:SERVER.LOAN+'loanApply/policy_return'
  }
};
