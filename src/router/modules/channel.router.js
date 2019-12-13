/**
 * 渠道管理
 */
export default {
  path: '/:orgCode/channel',
  meta: {title: '渠道管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'channelList'},
  children: [
    {
      path: 'channelList',
      meta: {title: '渠道列表', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'channelList'},
      children: [
        {
          path: '',
          name: 'channelList',
          component: () => import('@/pages/channel/channelList')
        }
      ]
    },
    {
      path: 'channelAccount',
      meta: {title: '渠道账号管理', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'channelAccount'},
      children: [
        {
          path: 'checkDetail',
          name: 'channelAccount',
          component: () => import('@/pages/channel/channelAccount')
        },
      ]
    }
  ]
}