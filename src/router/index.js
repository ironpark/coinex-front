import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/DashBoard'
import Trader from '@/components/Trader'
import Bucket from '@/components/Bucket'
import Backtest from '@/components/Backtest'
import Donation from '@/components/Donation'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'DashBoard',
      component: Dashboard
    },
    {
      path: '/trader',
      name: 'Hello',
      component: Trader
    },
    {
      path: '/bucket',
      name: 'Bucket',
      component: Bucket
    },
    {
      path: '/backtest',
      name: 'Backtest',
      component: Backtest
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Donation
    },
    {
      path: '/strategy',
      name: 'strategy',
      component: Donation
    },
    {
      path: '/donation',
      name: 'Donation',
      component: Donation
    }
  ]
})
