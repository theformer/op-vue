/**
 * 产品管理
 */

export default {
  path: '/:orgCode/product',
  meta: {title: '产品管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'productList'},
  children: [
    {
      path: 'productList',
      meta: {title: '产品列表', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'productList'},
      children: [
        {
          path: '',
          name: 'productList',
          component: () => import('@/pages/product/productList')
        }
      ]
    },
    {
      path: 'application',
      meta: {title: '申请表管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'applicationList'},
      children: [
        {
          path: '',
          name: 'applicationList',
          component: () => import('@/pages/product/applicationList')
        }
      ]
    },
    {
      path: 'applicationCategory',
      meta: {title: '申请表类目管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'applicationCategory'},
      children: [
        {
          path: '',
          name: 'applicationCategory',
          component: () => import('@/pages/product/applicationCategory')
        }
      ]
    },
    {
      path: 'identifyManage',
      meta: {title: '认证模型管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'identifyManageList'},
      children: [
        {
          path: '',
          name: 'identifyManageList',
          component: () => import('@/pages/product/identifyManageList')
        }
      ]
    },
    {
      path: 'recordLibrary',
      meta: {title: '备案库', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'recordLibrary'},
      children: [
        {
          path: '',
          name: 'recordLibrary',
          component: () => import('@/pages/product/recordLibrary')
        }
      ]
    },
  ]
}