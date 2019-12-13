/**
 * 客户管理
 */
export default {
  path: '/:orgCode/customer',
  meta: {title: '客户管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'customerList'},
  children: [
    {
      path: 'customerList',
      meta: {title: '客户列表', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'customerList'},
      children: [
        {
          path: '',
          name: 'customerList',
          component: () => import('@/pages/customer/customerList')
        },
        {
          path: 'detail/:id',
          name: 'customerDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/customer/customerDetail')
        }
      ]
    }
  ]
}