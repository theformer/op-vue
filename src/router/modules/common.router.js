/**
 * 公共
 */
export default [
  {
    path: '/:orgCode/blank',
    component: () => import('@/pages/components/public'),
    children: [
      {
        path: '',
        name: 'blank',
        component: () => import('@/pages/components/content')
      }
    ]
  },
  {
    path: '/:orgCode/login',
    name: 'login',
    meta: {title: '盘古OSS'},
    component: () => import('@/pages/login')
  },
  {
    path: '*',
    name: '404',
    meta: {title: '页面未找到'},
    component: () => import('@/pages/404')
  }
]