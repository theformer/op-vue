/**
 * 进件管理
 */
export default {
  path: '/:orgCode/income',
  meta: {title: '进件管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'incomeList'},
  children: [
    {
      path: 'incomeList',
      meta: {title: '进件列表', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'incomeList'},
      children: [
        {
          path: '',
          name: 'incomeList',
          component: () => import('@/pages/income/incomeList')
        },
        {
          path: 'checkDetail/:id/:from?',
          name: 'incomeDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/income/incomeDetail')
        },
        {
          path: 'auditDetail/:id',
          name: 'incomeAudit',
          meta: {title: '审核详情'},
          component: () => import('@/pages/income/incomeAudit')
        }
      ]
    },
    {
      path: 'dataUploadList',
      meta: {title: '数据上传', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'dataUploadList'},
      children: [
        {
          path: '',
          name: 'dataUploadList',
          component: () => import('@/pages/income/dataUploadList')
        },
        {
          path: 'checkDetail/:id',
          name: 'dataUploadDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/income/dataUploadDetail')
        },
      ]
    }
  ]
}
