/**
 * 数据统计管理
 */
export default {
  path: '/:orgCode/dataCount',
  meta: {title: '数据统计管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'dataOverview'},
  children: [
    {
      path: 'dataCountList',
      meta: {title: '数据统计列表', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'dataCountList'},
      children: [
        {
          path: '',
          name: 'dataCountList',
          component: () => import('@/pages/dataCount/dataCountList')
        }
      ]
    }, {
      path: 'dataOverview',
      meta: {title: '数据概览', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'dataOverview'},
      children: [
        {
          path: '',
          name: 'dataOverview',
          component: () => import('@/pages/dataCount/dataOverview')
        }
      ]
    }
  ]
}