/**
 * 权限管理
 */
export default {
  path: '/:orgCode/rights',
  meta: {title: '权限管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'roleList'},
  children: [
    {
      path: 'roleList',
      meta: {title: '角色管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'roleList'},
      children: [
        {
          path: '',
          name: 'roleList',
          component: () => import('@/pages/rights/roleList')
        }
      ]
    },
    {
      path: 'accountList',
      meta: {title: '账号管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'accountList'},
      children: [
        {
          path: '',
          name: 'accountList',
          component: () => import('@/pages/rights/accountList')
        }
      ]
    }
  ]
}