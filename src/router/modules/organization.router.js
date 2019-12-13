/**
 * 机构管理
 */
export default {
  path: '/:orgCode/organization',
  meta: {title: '机构管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'organizationInfo'},
  children: [
    {
      path: '/:orgCode/organizationInfo',
      meta: {title: '机构信息', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'organizationInfo'},
      children: [
        {
          path: '',
          name: 'organizationInfo',
          component: () => import('@/pages/organization/organizationInfo')
        }
      ]
    }
  ]
}