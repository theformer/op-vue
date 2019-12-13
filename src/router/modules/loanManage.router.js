/**
 * 贷后管理
 */
export default {
  path:'/:orgCode/loanManage',
  meta: {title: '贷后管理', isMenu: true},
  component: () => import('@/pages/components/public'),
  redirect: {name: 'loanOrders'},
  children:[
    {
      path: 'loanOrders',
      meta: {title: '贷后订单', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'loanOrders'},
      children: [
        {
          path: '',
          name: 'loanOrders',
          component: () => import('@/pages/loanManage/loanOrders')
        },
        {
          path: 'checkDetail/:id',
          name: 'loanDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/income/incomeDetail')
        },
      ]
    },
    {
      path: 'shouldBill',
      meta: {title: '待还账单', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'shouldBill'},
      children: [
        {
          path: '',
          name: 'shouldBill',
          component: () => import('@/pages/loanManage/shouldBill')
        },
        {
          path: 'checkDetail/:id',
          name: 'shouldBillDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/income/incomeDetail')
        },
      ]
    },
    {
      path: 'paidBills',
      meta: {title: '已还账单', isMenu: true},
      component: () => import('@/pages/components/content'),
      redirect: {name: 'paidBills'},
      children: [
        {
          path: '',
          name: 'paidBills',
          component: () => import('@/pages/loanManage/paidBills')
        },
        {
          path: 'checkDetail/:id',
          name: 'paidBillsDetail',
          meta: {title: '查看详情'},
          component: () => import('@/pages/income/incomeDetail')
        },
      ]
    }
  ]
}